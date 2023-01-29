/* eslint-disable consistent-return */
/* eslint-disable import/no-cycle */
import {
  addDays,
  addMonths,
  differenceInMonths,
  endOfDay,
  endOfMonth,
  startOfDay,
  startOfMonth,
  subDays,
} from 'date-fns';
import { FindOptions, Op, Transaction } from 'sequelize';
import { groupBy, reduce, orderBy } from 'lodash';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import db from '../db';
import PlanRenovation from '../db/models/PlanRenovation';
import Plan from '../db/models/Plan';
import PlanCredit from '../db/models/PlanCredit';
import Company from '../db/models/Company';
import logger from '../helpers/logger';
import DateService from '../helpers/date';
import HourlySpaceReservationService from './hourly-space-reservation';
import PlanType, { PlanTypes } from '../db/models/PlanType';

export default class PlanRenovationService {
  static async getAllLastRenovations(transaction?: Transaction) {
    return PlanRenovation.findAll({
      where: db.literal(
        '(`planRenovation`.`plan_id`, `planRenovation`.`end_date`) IN (SELECT plan_id, MAX(end_date) FROM plan_renovations GROUP BY plan_id)'
      ),
      include: [{ model: Plan, required: true, include: [{ model: Company, required: true }] }],
      transaction,
    });
  }

  /**
   * This returns all renovations without last two, that have a `planCreditId` and is not updated with calculated `unusedCredits`.
   * It is mandatory to use this method after the cron, to ensure that all "old" renovations are updated.
   */
  static async getFinishedPlanCreditRenovations(transaction?: Transaction) {
    // `DATE_ADD(MAX(end_date), INTERVAL -2 MONTH)` is to limit renovations to previous ones
    return PlanRenovation.scope('withReservations').findAll({
      where: {
        id: {
          [Op.in]: db.literal(`(
            SELECT t1.id
            FROM plan_renovations AS t1
            LEFT JOIN (
              SELECT *,
              DATE_ADD(MAX(end_date) OVER (PARTITION BY plan_id), INTERVAL -2 MONTH) AS max_end_date,
              SUM(CASE WHEN unused_credits IS NULL THEN 1 ELSE 0 END) OVER (PARTITION BY plan_id) AS uncalculated_rows
              FROM plan_renovations
            ) AS t2
            ON (
              t1.plan_id = t2.plan_id AND (
                (t1.id < t2.id AND t2.unused_credits IS NOT NULL) OR
                (t1.end_date > t2.max_end_date) OR
                (t2.uncalculated_rows <= 2)
              )
            )
            WHERE t2.id IS NULL
            AND t1.plan_credit_id IS NOT NULL
          )`),
        },
      },
      include: [PlanCredit],
      transaction,
    });
  }

  static generateMissingRenovations(
    missingRenovations: number,
    data: {
      planId: number;
      endDate: Date;
      originTz: string;
      planCreditId: number;
      planType: PlanTypes;
    }
  ) {
    const { planId, endDate, originTz, planCreditId, planType } = data;

    return [...Array(missingRenovations)].reduce((acc, _, i) => {
      const lastRenovationEndDate = i === 0 ? endDate : acc[i - 1].endDate;
      const { startDate: nextStartDate, endDate: nextEndDate } = PlanRenovationService.getNextStartEndDate(
        lastRenovationEndDate,
        originTz,
        originTz,
        planType
      );

      acc.push({ planId, startDate: nextStartDate, endDate: nextEndDate, planCreditId });
      return acc;
    }, [] as { planId: number; startDate: string; endDate: string; planCreditId: number }[]);
  }

  static async getMissingRenovations(renovations: PlanRenovation[]) {
    const renovationsToCreate: { planId: number; startDate: string; endDate: string }[] = [];

    await Promise.all(
      renovations.map(async r => {
        const { tz: originTz } = r.plan.company;
        const { startDate, endDate } = r;
        const originStartDate = utcToZonedTime(startDate, originTz);
        const originEndDate = utcToZonedTime(endDate, originTz);

        const planType = await PlanType.findByPk(r.plan.planTypeId);

        // /**
        //  * We always must have two renovations (current one and next one)
        //  * Thats why we calculate when the next renovation should start
        //  * with that info we can check how many renovations are missing
        //  */
        const originStartOfMonth = startOfMonth(originStartDate);
        const nextRenovationStartOfMonth = addMonths(startOfMonth(new Date()), 1);

        const missingRenovations = differenceInMonths(nextRenovationStartOfMonth, originStartOfMonth);

        if (missingRenovations < 1) return;

        const newRenovations = PlanRenovationService.generateMissingRenovations(missingRenovations, {
          planId: r.planId,
          endDate: zonedTimeToUtc(originEndDate, originTz),
          originTz,
          planType: planType.name,
          planCreditId: r.planCreditId,
        });

        renovationsToCreate.push(...newRenovations);
      })
    );

    return renovationsToCreate;
  }

  static async createMissingRenovations() {
    logger('PlanRenovationService').info('Creating new plan renovations...');
    await db.transaction(async transaction => {
      const renovations = await PlanRenovationService.getAllLastRenovations(transaction);
      const renovationsToCreate = await PlanRenovationService.getMissingRenovations(renovations);

      if (!renovationsToCreate.length) {
        return logger('PlanRenovationService').info('No renovations to create! Skipping...');
      }

      logger('PlanRenovationService').info(`Creating ${renovationsToCreate.length} renovations...`);
      return PlanRenovation.bulkCreate(renovationsToCreate, { transaction });
    });
  }

  static updateUnusedCredits = async () => {
    logger('PlanRenovationService').info('Updating previous renovations unused credits...');
    return db.transaction(async transaction => {
      const renovations = await PlanRenovationService.getFinishedPlanCreditRenovations(transaction);

      if (!renovations.length) {
        return logger('PlanRenovationService').info('No renovations to update! Skipping...');
      }

      const groups = groupBy(orderBy(renovations, ['startDate'], ['asc']), r => r.planId);
      const payload = reduce(
        groups,
        (groupAcc, group) => {
          const lastUnusedCredits = group[0].unusedCredits ?? null;
          const finalGroup = lastUnusedCredits !== null ? group.slice(1) : group;

          const calculatedRenovations = finalGroup.reduce<PlanRenovation['_attributes'][]>((acc, r, i) => {
            let totalCredits = Number(r.planCredit.value);

            if (i === 0 && lastUnusedCredits) {
              totalCredits += lastUnusedCredits;
            } else {
              totalCredits += acc[i - 1]?.unusedCredits || 0;
            }

            const { usedCredits } = PlanRenovationService.getUsedCredits(r);
            const unusedCredits = totalCredits - usedCredits;

            acc.push({ ...r.toJSON(), usedCredits, unusedCredits, totalCredits, updatedAt: new Date() });
            return acc;
          }, []);

          return [...groupAcc, ...calculatedRenovations];
        },
        [] as PlanRenovation['_attributes'][]
      );

      logger('PlanRenovationService').info(`Updating ${payload.length} renovations...`);
      return PlanRenovation.bulkCreate(payload, {
        transaction,
        updateOnDuplicate: ['usedCredits', 'unusedCredits', 'totalCredits', 'updatedAt'],
      });
    });
  };

  static calculateNextStartDate = (startDate: Date) => startOfMonth(addMonths(startDate, 1));

  static getNextStartEndDate(
    endDate: string | number | Date,
    originTz: string,
    destinationTz: string,
    planType: PlanTypes
  ) {
    return DateService.zonedStartEndDate(
      endDate,
      originTz,
      destinationTz,
      planType === PlanTypes.ENTERPRISE ? PlanRenovationService.calculateNextStartDate : d => startOfDay(addDays(d, 1)),
      planType === PlanTypes.ENTERPRISE ? endOfMonth : d => endOfDay(subDays(addMonths(d, 1), 1))
    );
  }

  static async getCurrentRenovation(planId: number, destinationTz: string) {
    return PlanRenovation.scope(['withReservations', { method: ['currentOne', destinationTz] }]).findOne({
      where: { planId },
      rejectOnEmpty: true,
    });
  }

  static async getRenovations(planId: number, options?: FindOptions<PlanRenovation['_attributes']>) {
    return PlanRenovation.scope('withReservations').findAll({ where: { planId }, ...options });
  }

  static async getPreviousRenovations(planId: number, options?: FindOptions<PlanRenovation['_attributes']>) {
    const renovations = await this.getRenovations(planId, options);
    /**
     * We remove the last two renovations because they are the current and the next one
     * (We always keep one extra to fix possible timezone issues)
     */
    return renovations.slice(2);
  }

  static async getPreviousRenovation(planId: number, destinationTz: string): Promise<PlanRenovation | undefined> {
    return PlanRenovation.scope(['withReservations', { method: ['previousOne', destinationTz] }]).findOne({
      where: { planId },
    });
  }

  static getUsedCredits(renovation: PlanRenovation) {
    return HourlySpaceReservationService.calculateSummaryUsedCredits(renovation.hourlySpaceReservations);
  }
}
