import { HourlySpaceReservation, WPMReservation } from '@wimet/apps-shared';
import { toDate } from 'date-fns-tz';

export const isPassedDate = (date: Date | string, timeZone: string): boolean => {
  const parsedDate = toDate(new Date(date), { timeZone });
  const today = toDate(new Date(), { timeZone });
  return parsedDate < today;
};

export const orderReservationsByDate = (reservations: WPMReservation[], type: 'asc' | 'desc') =>
  reservations.sort((a, b) => {
    const firstDate = toDate(new Date(a.startAt), { timeZone: a.destinationTz });
    const secondDate = toDate(new Date(b.startAt), { timeZone: b.destinationTz });

    const orderBy = {
      asc: firstDate > secondDate ? 1 : -1,
      desc: firstDate > secondDate ? -1 : 1,
    };

    return orderBy[type];
  });

export const orderReservationWSPsByDate = (reservations: HourlySpaceReservation[], type: 'asc' | 'desc') =>
  reservations.sort((a, b) => {
    const firstDate = toDate(new Date(a.startDate), { timeZone: a.destinationTz });
    const secondDate = toDate(new Date(b.startDate), { timeZone: b.destinationTz });

    const orderBy = {
      asc: firstDate > secondDate ? 1 : -1,
      desc: firstDate > secondDate ? -1 : 1,
    };

    return orderBy[type];
  });
