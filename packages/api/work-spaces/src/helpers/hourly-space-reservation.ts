import { set } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import {
  HourlySpaceReservationHalfDayTypes,
  HourlySpaceReservationHourlyTypes,
} from '../db/models/HourlySpaceReservation';
import SpaceSchedule from '../db/models/SpaceSchedule';
import { SpaceReservationHourlyTypes } from '../dto/space-reservation';

// TODO: Move this day config to a common place
const DAY_OF_WEEKS = {
  0: 6,
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};
export default class HourlySpaceReservationHelper {
  static async getDatesByReservationType(
    hourlyReservation: {
      day: string;
      hourlyId: number;
      type: SpaceReservationHourlyTypes;
      halfDay?: HourlySpaceReservationHalfDayTypes;
      perHour?: {
        start: string;
        end: string;
      };
    },
    spaceId: number,
    originTz: string
  ) {
    const originDate = utcToZonedTime(hourlyReservation.day, originTz);
    const dayOfWeek = DAY_OF_WEEKS[originDate.getDay()];
    let originStartDate: Date;
    let originEndDate: Date | null;

    if (HourlySpaceReservationHourlyTypes[hourlyReservation.type] === HourlySpaceReservationHourlyTypes.DAYPASS) {
      const spaceSchedule = await SpaceSchedule.findOne({ where: { spaceId, dayOfWeek } });
      const [openHour, openMin, openSeg] = `${spaceSchedule.openTime}`.split(':').map(el => Number(el));
      const [closeHour, closeMin, closeSeg] = `${spaceSchedule.closeTime}`.split(':').map(el => Number(el));

      originStartDate = set(originDate, { hours: openHour, minutes: openMin, seconds: openSeg });
      originEndDate = set(originDate, { hours: closeHour, minutes: closeMin, seconds: closeSeg });
    }

    if (HourlySpaceReservationHourlyTypes[hourlyReservation.type] === HourlySpaceReservationHourlyTypes.PER_HOUR) {
      const perHourStartZoned = utcToZonedTime(hourlyReservation.perHour.start, originTz);
      const perHourEndZoned = utcToZonedTime(hourlyReservation.perHour.end, originTz);

      originStartDate = perHourStartZoned;
      originEndDate = perHourEndZoned;
    }

    if (HourlySpaceReservationHourlyTypes[hourlyReservation.type] === HourlySpaceReservationHourlyTypes.HALF_DAY) {
      originStartDate = originDate;
      originEndDate = null;
    }

    return { originStartDate, originEndDate };
  }
}
