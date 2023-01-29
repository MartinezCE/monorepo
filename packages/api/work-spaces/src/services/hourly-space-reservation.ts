/* eslint-disable import/no-cycle */
import { differenceInHours } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { isUndefined } from 'lodash';
import { Op } from 'sequelize';
import HourlySpaceReservation, { HourlySpaceReservationHourlyTypes } from '../db/models/HourlySpaceReservation';
import DateService from '../helpers/date';
import SpaceService from './space';
import { typePrices } from './space-reservation';

export default class HourlySpaceReservationService {
  static calculateSummaryUsedCredits(reservations: HourlySpaceReservation[]) {
    const res = reservations.reduce(
      (acc, reservation) => {
        const { currencyId, usedCredits, value } = HourlySpaceReservationService.calculateUsedCredits(reservation);

        acc.values[currencyId] = acc.values[currencyId] || { currencyId, usedCredits: 0, value: 0 };
        acc.values[currencyId].usedCredits += usedCredits;
        acc.values[currencyId].value += value;
        acc.usedCredits += usedCredits;

        return acc;
      },
      {
        usedCredits: 0,
        values: {},
      } as {
        usedCredits: number;
        values: {
          [currencyId: number]: {
            currencyId: number;
            usedCredits: number;
            value: number;
          };
        };
      }
    );

    return { ...res, values: Object.values(res.values) };
  }

  static calculateUsedCredits(reservation: HourlySpaceReservation) {
    const price = reservation.hourlySpaceHistory[typePrices[reservation.type]];
    const creditPrice = reservation.credit.value;
    const feePercentage = reservation.feePercentage.value;
    const { currencyId } = reservation.credit;

    const { usedCredits, value } = HourlySpaceReservationService.getHourlySpaceCreditsCount(
      reservation,
      price,
      creditPrice,
      feePercentage
    );

    return { currencyId, usedCredits, value };
  }

  static getHourlySpaceCreditsCount(
    reservation: HourlySpaceReservation,
    price: number,
    creditPrice: number,
    feePercentage: number
  ) {
    const { type, startDate, endDate, destinationTz } = reservation;

    let usedCredits = SpaceService.getCreditsCount(price, creditPrice, feePercentage);

    if (type === HourlySpaceReservationHourlyTypes.PER_HOUR && startDate && endDate) {
      const start = utcToZonedTime(startDate, destinationTz);
      const end = utcToZonedTime(endDate, destinationTz);

      const hourQuantity = Math.abs(differenceInHours(end, start, { roundingMethod: 'round' }));
      usedCredits *= hourQuantity;
    }

    const value = SpaceService.getPriceFromCredits(price, creditPrice);

    return { usedCredits, value };
  }

  static async computeUsedCredits(reservations: HourlySpaceReservation[]) {
    return reservations.map(reservation => ({
      ...reservation.toJSON(),
      usedCredits: HourlySpaceReservationService.calculateUsedCredits(reservation).usedCredits,
    }));
  }

  static async getReservationsByPlan(planId: number) {
    return this.computeUsedCredits(
      await HourlySpaceReservation.scope([{ method: ['byPlan', planId] }, { method: 'mainContext' }]).findAll()
    );
  }

  static async getReservationsByRenovation(planRenovationId: number) {
    return this.computeUsedCredits(
      await HourlySpaceReservation.scope([{ method: 'mainContext' }]).findAll({
        where: { planRenovationId },
      })
    );
  }

  static async getReservationsByCompany(companyId: number, limit = 10000, offset = 0) {
    return this.computeUsedCredits(
      await HourlySpaceReservation.scope([{ method: ['byCompany', companyId] }, { method: 'mainContext' }]).findAll({
        limit,
        offset,
      })
    );
  }

  static async getReservationsByPartner(companyId: number, limit = 10000, offset = 0) {
    return this.computeUsedCredits(
      await HourlySpaceReservation.scope([{ method: ['byPartner', companyId] }, { method: 'mainContext' }]).findAll({
        limit,
        offset,
      })
    );
  }

  static async getReservationsByUser(userId: number, planRenovationId?: number) {
    return this.computeUsedCredits(
      await HourlySpaceReservation.scope([{ method: ['byUser', userId] }, { method: 'mainContext' }]).findAll(
        !isUndefined(planRenovationId) ? { where: { planRenovationId } } : {}
      )
    );
  }

  static async getAllBetweenByCompany(
    start: Date,
    end: Date,
    originTz: string,
    destinationTz: string,
    companyId: number
  ) {
    const startDate = DateService.toDestinationTz(start, originTz, destinationTz);
    const endDate = DateService.toDestinationTz(end, originTz, destinationTz);
    return HourlySpaceReservation.scope([{ method: 'mainContext' }, { method: ['byPartner', companyId] }]).findAll({
      where: {
        startDate: { [Op.gte]: startDate },
        endDate: { [Op.lte]: endDate },
      },
    });
  }

  static async getAllBetween(start: Date, end: Date, originTz: string, destinationTz: string) {
    const startDate = DateService.toDestinationTz(start, originTz, destinationTz);
    const endDate = DateService.toDestinationTz(end, originTz, destinationTz);
    return HourlySpaceReservation.scope([{ method: 'mainContext' }]).findAll({
      where: {
        startDate: { [Op.gte]: startDate },
        endDate: { [Op.lte]: endDate },
      },
    });
  }
}
