import { SpaceReservationHourlyTypes } from '@wimet/apps-shared';

export const typeCredits: {
  [SpaceReservationHourlyTypes.DAYPASS]: 'fullDayCreditsWithFee';
  [SpaceReservationHourlyTypes.HALF_DAY]: 'halfDayCreditsWithFee';
  [SpaceReservationHourlyTypes.PER_HOUR]: 'dayCreditsWithFee';
} = {
  [SpaceReservationHourlyTypes.DAYPASS]: 'fullDayCreditsWithFee',
  [SpaceReservationHourlyTypes.HALF_DAY]: 'halfDayCreditsWithFee',
  [SpaceReservationHourlyTypes.PER_HOUR]: 'dayCreditsWithFee',
};
