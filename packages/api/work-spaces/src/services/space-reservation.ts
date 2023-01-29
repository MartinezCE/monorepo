/* eslint-disable import/no-cycle */
import { addMonths, parseISO, getDay } from 'date-fns';
import { getTimezoneOffset, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import createHttpError from 'http-errors';
import MonthlySpaceService from './monthly-space';
import SlackService from './slack';
import PlanRenovationService from './plan-renovation';
import User from '../db/models/User';
import Company from '../db/models/Company';
import Space from '../db/models/Space';
import SpaceDiscountMonthlySpace from '../db/models/SpaceDiscountMonthlySpace';
import MonthlySpace from '../db/models/MonthlySpace';
import SpaceDiscount from '../db/models/SpaceDiscount';
import { SpaceReservationDTO, SpaceReservationHourlyTypes } from '../dto/space-reservation';
import HourlySpaceReservation, {
  HourlySpaceReservationHourlyTypes,
  HourlySpaceReservationInput,
} from '../db/models/HourlySpaceReservation';
import HourlySpaceHistory from '../db/models/HourlySpaceHistory';
import FeePercentage from '../db/models/FeePercentage';
import Credits from '../db/models/Credits';
import HourlySpaceReservationHelper from '../helpers/hourly-space-reservation';
import PlanRenovation from '../db/models/PlanRenovation';
import db from '../db';
import {
  NOT_ENOUGH_AVAILABLE_CREDITS,
  PLAN_NOT_AVAILABLE,
  REQUIRED_PLAN,
  SPACE_VALUE_MUST_BE_LESS_MAX_CREDITS,
  TOTAL_AMOUNT_OF_PERSONAL_CREDITS_EXCEEDED,
} from '../config/errorCodes';
import PlanService, { PlanWithRenovations } from './plan';
import HourlySpaceReservationService from './hourly-space-reservation';
import { PlanStatus } from '../db/models/Plan';
import PlanType, { PlanTypes } from '../db/models/PlanType';

export const typePrices: {
  [SpaceReservationHourlyTypes.DAYPASS]: 'fullDayPrice';
  [SpaceReservationHourlyTypes.HALF_DAY]: 'halfDayPrice';
  [SpaceReservationHourlyTypes.PER_HOUR]: 'price';
} = {
  [SpaceReservationHourlyTypes.DAYPASS]: 'fullDayPrice',
  [SpaceReservationHourlyTypes.HALF_DAY]: 'halfDayPrice',
  [SpaceReservationHourlyTypes.PER_HOUR]: 'price',
};

export default class SpaceReservationService {
  static async handleMonthlyReservation(
    user: User,
    company: Company,
    space: Space,
    monthly: SpaceReservationDTO['monthly'],
    originTz: string,
    destinationTz: string
  ) {
    const originDate = utcToZonedTime(monthly.fromDate, originTz);
    const destinationDate = zonedTimeToUtc(originDate, destinationTz);

    await SpaceReservationService.createMonthlyReservation(
      user,
      company,
      space,
      space.location.company.users[0], // TODO: Change this to get Partner based on spaceId and not "Space with related Users".
      destinationDate,
      monthly.monthsQuantity
    );
  }

  static async handleHourlyReservation(
    user: User,
    company: Company,
    space: Space,
    hourly: SpaceReservationDTO['hourly'],
    originTz: string,
    destinationTz: string
  ) {
    const [[plan], feePercentage, credit] = await Promise.all([
      user.getPlans({
        where: { companyId: company.id },
        include: [{ model: PlanRenovation.scope({ method: ['currentOne', destinationTz] }), attributes: ['id'] }],
      }) as Promise<Partial<PlanWithRenovations>[]>,
      FeePercentage.findOne({ where: { companyId: space.location.companyId }, rejectOnEmpty: true }),
      Credits.findOne({ where: { currencyId: space.location.currencyId }, rejectOnEmpty: true }),
    ]);

    if (!plan) throw createHttpError(400, REQUIRED_PLAN);
    if (plan.status !== PlanStatus.ACTIVE) throw createHttpError(400, PLAN_NOT_AVAILABLE);

    const lastPlanRenovation = plan.planRenovations[0];
    const listOfHourlySpaceHistory: HourlySpaceHistory[] = [];

    const payload = await Promise.all(
      hourly.map(async h => {
        const originOffset = getTimezoneOffset(originTz, parseISO(h.day));
        const { originStartDate, originEndDate } = await HourlySpaceReservationHelper.getDatesByReservationType(
          h,
          space.id,
          originTz
        );

        const hourlySpaceHistory = await HourlySpaceHistory.findOne({
          where: { spaceId: space.id, dayOfWeek: (getDay(parseISO(h.day)) - 1) % 6 },
          order: [['id', 'desc']],
          rejectOnEmpty: true,
        });

        listOfHourlySpaceHistory.push(hourlySpaceHistory);

        const destinationStartDate = zonedTimeToUtc(originStartDate, destinationTz);
        const destinationEndDate = originEndDate ? zonedTimeToUtc(originEndDate, destinationTz) : null;
        const destinationOffset = getTimezoneOffset(destinationTz, destinationStartDate);

        return {
          userId: user.id,
          spaceId: space.id,
          planRenovationId: lastPlanRenovation.id,
          type: HourlySpaceReservationHourlyTypes[h.type],
          hourlySpaceHistoryId: hourlySpaceHistory.id,
          feePercentageId: feePercentage.id,
          creditId: credit.id,
          originTz,
          originOffset,
          destinationTz,
          destinationOffset,
          startDate: destinationStartDate.toISOString(),
          endDate: destinationEndDate?.toISOString(),
          halfDayType: h.halfDay,
        } as HourlySpaceReservationInput;
      })
    );

    return db.transaction(async transaction => {
      const hourlySpaceReservations = await HourlySpaceReservation.bulkCreate(payload, { transaction });
      await SpaceReservationService.createHourlyReservation(
        user,
        company,
        space,
        space.location.company.users[0], // TODO: Change this to get Partner based on spaceId and not "Space with related Users".
        hourlySpaceReservations,
        listOfHourlySpaceHistory,
        credit,
        feePercentage,
        plan
      );
    });
  }

  static async createMonthlyReservation(
    user: User,
    company: Company,
    space: Space,
    partner: User,
    startDate: Date,
    monthsQuantity: number
  ) {
    const monthlySpace = (await MonthlySpaceService.findBySpace(space.id, {
      include: [SpaceDiscount],
    })) as MonthlySpace & {
      spaceDiscounts: (SpaceDiscount & { spaceDiscountMonthlySpace: SpaceDiscountMonthlySpace })[];
    };

    const price = monthlySpace.price * monthsQuantity;
    const discountPercentage =
      monthlySpace.spaceDiscounts.find(s => s.monthsAmount === monthsQuantity)?.spaceDiscountMonthlySpace.percentage ||
      0;
    const totalPrice = price - price * discountPercentage;

    const reservation = {
      startDate,
      untilDate: addMonths(startDate, monthsQuantity),
      monthsQuantity,
    };

    return SlackService.sendNewReservationMsg(user, company, space, partner, {
      monthly: { reservation, totalPrice },
    });
  }

  static async checkMaxReservationCredits(totalCost: number, maxReservationCredits: number) {
    if (totalCost <= maxReservationCredits) return true;
    throw createHttpError(400, SPACE_VALUE_MUST_BE_LESS_MAX_CREDITS);
  }

  static async checkMaxPersonalCredits(
    totalCost: number,
    maxPersonalCredits: number,
    planId: number,
    destinationTz: string,
    userId: number
  ) {
    const renovation = await PlanRenovationService.getCurrentRenovation(planId, destinationTz);
    const reservationsByRenovationId = await HourlySpaceReservationService.getReservationsByUser(userId, renovation.id);
    const userUsedCredits = reservationsByRenovationId.reduce((acc, el) => acc + el.usedCredits, 0);

    if (maxPersonalCredits - (userUsedCredits + totalCost) >= 0) return true;
    throw createHttpError(400, TOTAL_AMOUNT_OF_PERSONAL_CREDITS_EXCEEDED);
  }

  static async checkAvailableCredits(totalCost: number, planId: number, planTypeId: number, destinationTz: string) {
    const planType = await PlanType.findByPk(planTypeId);

    if (planType.name === PlanTypes.ENTERPRISE) return true;

    const availableCredits = await PlanService.getAvailableCredits(planId, destinationTz);

    if (availableCredits - totalCost >= 0) return true;
    throw createHttpError(400, NOT_ENOUGH_AVAILABLE_CREDITS);
  }

  static async createHourlyReservation(
    user: User,
    company: Company,
    space: Space,
    partner: User,
    hourlyReservations: HourlySpaceReservation[],
    hourlySpaceHistory: HourlySpaceHistory[],
    credit: Credits,
    feePercentage: FeePercentage,
    plan: Partial<PlanWithRenovations>
  ) {
    const reservations = hourlyReservations
      .map((h, idx) => {
        const { price } = hourlySpaceHistory[idx];
        const creditPrice = credit.value;
        const fee = feePercentage.value;
        const start = utcToZonedTime(h.startDate, h.destinationTz);
        const end = h.endDate ? utcToZonedTime(h.endDate, h.destinationTz) : null;

        const creditsCount = HourlySpaceReservationService.getHourlySpaceCreditsCount(h, price, creditPrice, fee);
        const { usedCredits: credits } = creditsCount;

        return { day: start, type: h.type, halfDayType: h.halfDayType, credits, perHour: { start, end } };
      })
      .sort((a, b) => a.day.getTime() - b.day.getTime());

    const totalCost = reservations.reduce((acc, el) => acc + el.credits, 0);

    await Promise.all([
      SpaceReservationService.checkMaxReservationCredits(totalCost, plan.maxReservationCredits),
      SpaceReservationService.checkMaxPersonalCredits(totalCost, plan.maxPersonalCredits, plan.id, company.tz, user.id),
      SpaceReservationService.checkAvailableCredits(totalCost, plan.id, plan.planTypeId, company.tz),
    ]);

    return SlackService.sendNewReservationMsg(user, company, space, partner, {
      hourly: { reservations, totalCredits: totalCost },
    });
  }
}
