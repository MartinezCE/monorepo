import { HourlySpaceReservationHalfDayTypes } from '../db/models/HourlySpaceReservation';

// TODO: Remove this type and normalize using the ones from HourlySpaceReservation
export enum SpaceReservationHourlyTypes {
  PER_HOUR = 'PER_HOUR',
  HALF_DAY = 'HALF_DAY',
  DAYPASS = 'DAYPASS',
}

// TODO: Remove this type and normalize using the ones from HourlySpaceReservation
export enum SpaceReservationHalfDayTypes {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
}

export interface SpaceReservationDTO {
  spaceId: number;
  monthly?: { fromDate: string; monthsQuantity: number };
  hourly?: {
    day: string;
    hourlyId: number;
    type: SpaceReservationHourlyTypes;
    halfDay?: HourlySpaceReservationHalfDayTypes;
    perHour?: { start: string; end: string };
  }[];
}
