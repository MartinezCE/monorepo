/* eslint-disable import/no-cycle */
import { addMonths, endOfDay, endOfMonth, startOfDay, subDays } from 'date-fns';
import createHttpError from 'http-errors';
import { Transaction } from 'sequelize';
import {
  PLAN_USER_ACTIVE_RESERVATIONS,
  USER_PLAN_EXISTS,
  PLAN_HAS_RESERVATIONS,
  PLAN_NOT_FOUND,
} from '../config/errorCodes';
import database from '../db/database';
import HourlySpaceReservation from '../db/models/HourlySpaceReservation';
import Plan from '../db/models/Plan';
import PlanRenovation from '../db/models/PlanRenovation';
import PlanType, { PlanTypes } from '../db/models/PlanType';
import User from '../db/models/User';
import { PlanDTO } from '../dto/plan';
import CompanyService from './company';
import SlackService from './slack';
import PlanRenovationService from './plan-renovation';
import Company from '../db/models/Company';
import DateService from '../helpers/date';
import logger from '../helpers/logger';
import HourlySpaceReservationService from './hourly-space-reservation';
import PlanCredit from '../db/models/PlanCredit';
import CreditsService from './credits';

export type PlanWithRenovations = Plan & {
  planRenovations: (PlanRenovation & {
    hourlySpaceReservations: HourlySpaceReservation[];
  })[];
};

export type InitialPlanRenovationsProps = {
  plan: Plan;
  startDate: string;
  endDate: string;
  originTz: string;
  destinationTz: string;
  planCreditId?: number;
  planType: PlanTypes;
};

const loggerInstance = logger('plan-service');

export default class PlanService {
  static async createInitialPlanRenovations(payload: InitialPlanRenovationsProps, transaction?: Transaction) {
    const { plan, startDate, endDate, destinationTz, planCreditId, planType } = payload;
    const { startDate: nextStartDate, endDate: nextEndDate } = PlanRenovationService.getNextStartEndDate(
      endDate,
      destinationTz,
      destinationTz,
      planType
    );

    return Promise.all([
      plan.createPlanRenovation({ planId: plan.id, startDate, endDate, planCreditId }, { transaction }),
      plan.createPlanRenovation(
        { planId: plan.id, startDate: nextStartDate, endDate: nextEndDate, planCreditId },
        { transaction }
      ),
    ]);
  }

  static async createPlan(
    companyId: number,
    payload: PlanDTO,
    userId: number,
    originTz: string,
    destinationTz: string
  ) {
    return database.transaction(async transaction => {
      const { startDate: date, users, credits, ...rest } = payload;
      const planTypeName = credits ? PlanTypes.CUSTOM : PlanTypes.ENTERPRISE;
      const startCb = planTypeName === PlanTypes.CUSTOM ? null : startOfDay;
      const endCb = planTypeName === PlanTypes.CUSTOM ? (d: Date) => endOfDay(subDays(addMonths(d, 1), 1)) : endOfMonth;

      // @TODO MARU -> FORMATEAR BIEN EN START DATE Y END DATE PARA EL PAYLOAD DE CARGA DE CREDITOS
      const { startDate, endDate } = DateService.zonedStartEndDate(date, originTz, destinationTz, startCb, endCb);

      const planType = await PlanType.findOne({ where: { name: planTypeName }, rejectOnEmpty: true, transaction });
      const plan = await Plan.create({ ...rest, companyId, startDate, planTypeId: planType.id }, { transaction });

      const planRenovationPayload: InitialPlanRenovationsProps = {
        plan,
        startDate,
        endDate,
        originTz,
        destinationTz,
        planType: planTypeName,
      };

      if (planTypeName === PlanTypes.CUSTOM) {
        const { id: creditId } = await CreditsService.getByCompany(companyId, transaction);
        const planCredit = await PlanCredit.create({ planId: plan.id, value: credits, creditId }, { transaction });
        planRenovationPayload.planCreditId = planCredit.id;
      }

      await Promise.all([
        PlanService.createInitialPlanRenovations(planRenovationPayload, transaction),
        plan.setUsers(users, { transaction }),
      ]);

      await SlackService.sendNewPlanMsg(plan, userId, planType, users);

      return plan;
    });
  }

  static async updatePlan(
    planId: number,
    companyId: number,
    { startDate: _, users, ...payload }: PlanDTO,
    transaction?: Transaction
  ) {
    const plan = await Plan.findOne({ where: { id: planId, companyId }, transaction, rejectOnEmpty: true });
    await plan.update({ ...payload, companyId }, { transaction });

    if (users) await plan.setUsers(users, { transaction });

    return plan;
  }

  static async getAllPlans(companyId: number, destinationTz: string, limit: number = 10000, offset: number = 0) {
    const plans = (await Plan.findAll({
      limit,
      offset,
      where: { companyId },
      include: [
        PlanType,
        User,
        // { model: User, attributes: { exclude: ['password'] }, through: { attributes: [] } },
        // PlanRenovation.scope(['withReservations', { method: ['currentOne', destinationTz] }]),
      ],
    })) as PlanWithRenovations[];

    return plans;
  }

  static async getPlanById(planId: number, companyId: number, destinationTz: string) {
    try {
      const plan = (await Plan.scope([
        { method: ['mainContext', destinationTz] },
        { method: ['byCompany', companyId] },
      ]).findOne({ where: { id: planId }, rejectOnEmpty: true })) as PlanWithRenovations;

      return plan;
    } catch (e) {
      loggerInstance.error('Plan not found', e);
      throw createHttpError(404, PLAN_NOT_FOUND);
    }
  }

  static async getPlanByUser(userId: number, companyId: number, destinationTz: string) {
    try {
      const plan = (await Plan.scope([
        { method: ['mainContext', destinationTz] },
        { method: ['byCompany', companyId] },
        // { method: ['byUser', userId] },
      ]).findOne({ rejectOnEmpty: true })) as PlanWithRenovations;

      return plan;
    } catch (e) {
      loggerInstance.error('Plan not found', e);
      throw createHttpError(404, PLAN_NOT_FOUND);
    }
  }

  static getUsedCredits(plan: PlanWithRenovations) {
    const [lastRenovation] = plan.planRenovations;

    const { usedCredits } = HourlySpaceReservationService.calculateSummaryUsedCredits(
      lastRenovation.hourlySpaceReservations
    );

    return { usedCredits };
  }

  static getUsedCreditsByUser(plan: PlanWithRenovations, userId: number) {
    const [lastRenovation] = plan.planRenovations;

    const { usedCredits, userUsedCredits } = lastRenovation.hourlySpaceReservations.reduce(
      (acc, reservation) => {
        const { usedCredits: credits } = HourlySpaceReservationService.calculateSummaryUsedCredits(
          lastRenovation.hourlySpaceReservations
        );

        if (reservation.userId === userId) {
          acc.userUsedCredits += credits;
        }

        acc.usedCredits += credits;

        return acc;
      },
      { usedCredits: 0, userUsedCredits: 0 }
    );

    return { usedCredits, userUsedCredits };
  }

  static async deletePlan(planId: number, companyId) {
    const plan = await Plan.findOne({
      include: { model: Company, required: true, where: { id: companyId } },
      where: { id: planId },
      rejectOnEmpty: true,
    });

    if (!plan.toJSON().isDeletable) throw createHttpError(400, PLAN_HAS_RESERVATIONS);

    await plan.destroy();
  }

  static async deletePlanUser(planId: number, userId: number) {
    await CompanyService.findCompanyByUserId(userId, undefined, {
      rejectOnEmpty: true,
    });
    const reservations = await HourlySpaceReservation.scope({ method: ['byUser', userId] })
      .findAll
      // {
      //   include: {
      //     model: PlanRenovation,
      //     required: true,
      //     include: [{ model: Plan, required: true, where: { id: planId } }],
      //   },
      //   where: {
      //     endDate: {
      //       [Op.gte]: new Date(), // TODO: convert server date to reservation country date
      //     },
      //   },
      // }
      ();
    if (!reservations.length) {
      const plan = await Plan.findByPk(planId);
      await plan.removeUser(userId);
    } else {
      throw createHttpError(400, PLAN_USER_ACTIVE_RESERVATIONS);
    }
  }

  static async createPlanUser(planId: number, users: number[]) {
    return database.transaction(async transaction => {
      const result = await Promise.all(
        users.map(async userId => {
          const userCompany = await CompanyService.findCompanyByUserId(userId, undefined, {
            rejectOnEmpty: true,
            transaction,
          });
          const alreadyHasPlan = await Plan.findOne({
            include: { model: User, required: true, where: { id: userId } },
          });
          if (alreadyHasPlan) {
            throw createHttpError(400, USER_PLAN_EXISTS);
          } else {
            const plan = await Plan.findOne({
              where: { id: planId, companyId: userCompany.id },
              rejectOnEmpty: true,
              transaction,
            });
            const item = await plan.addUser(userId);
            return item;
          }
        })
      );
      return result;
    });
  }

  /**
   * This method is **only** intendeed to be used with {@link PlanTypes.CUSTOM}!
   *
   * An on-demand plan like {@link PlanTypes.ENTERPRISE} is unlimited right now.
   */
  static async getAvailableCredits(planId: number, destinationTz: string) {
    const planCredit = await PlanCredit.findOne({ where: { planId }, rejectOnEmpty: true });
    const previousRenovation = await PlanRenovationService.getPreviousRenovation(planId, destinationTz);
    const renovation = await PlanRenovationService.getCurrentRenovation(planId, destinationTz);

    const initialAvailableCredits = planCredit.value + (previousRenovation?.unusedCredits || 0);
    const { usedCredits } = PlanRenovationService.getUsedCredits(renovation);

    return initialAvailableCredits - usedCredits;
  }
}
