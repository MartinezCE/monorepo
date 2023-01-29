import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import db from '../db';
import WimetBills from '../db/models/WimetBills';
import logger from '../helpers/logger';
import HourlySpaceReservationService from './hourly-space-reservation';

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default class WimetBillsService {
  static async createMonthlyBill() {
    logger('WimetBillsService').info('Creating new partner bills.');
    await db.transaction(async transaction => {
      const startDate = subMonths(startOfMonth(new Date()), 1);
      const endDate = endOfMonth(startDate);

      const reservations = await HourlySpaceReservationService.getAllBetween(startDate, endDate, tz, tz);
      const groupedReservations = reservations.reduce((acc, r) => {
        const { companyId } = r.space.location;

        acc[companyId] = acc[companyId] || [];
        acc[companyId].push(r);

        return acc;
      }, {} as { [companyId: number]: typeof reservations[number][] });

      return WimetBills.bulkCreate(
        Object.keys(groupedReservations).map(companyId => ({
          companyId: Number(companyId),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        })),
        { transaction }
      );
    });
  }
}
