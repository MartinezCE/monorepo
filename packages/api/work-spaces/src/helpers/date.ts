import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export default class DateHelper {
  static toDestinationTz(
    date: string | number | Date,
    originTz: string,
    destinationTz: string,
    cb?: (date: Date) => Date
  ) {
    const originDate = utcToZonedTime(date, originTz);
    const resDate = cb?.(originDate) || originDate;
    const destinationDate = zonedTimeToUtc(resDate, destinationTz);

    return destinationDate.toISOString();
  }

  static zonedStartEndDate(
    date: string | number | Date,
    originTz: string,
    destinationTz: string,
    startCb?: (date: Date) => Date,
    endCb?: (date: Date) => Date
  ) {
    const originDate = utcToZonedTime(date, originTz);
    const originStartDate = startCb?.(originDate) || originDate;
    const originEndDate = endCb?.(originStartDate) || originStartDate;

    const destinationStartDate = zonedTimeToUtc(originStartDate, destinationTz);
    const destinationEndDate = zonedTimeToUtc(originEndDate, destinationTz);

    /**
     * This is a final parsed date, ready to be stored in the database.
     * If you want to manipulate it, you must use `utcToZonedTime`, and then `zonedTimeToUtc`
     */
    const startDate = destinationStartDate.toISOString();
    const endDate = destinationEndDate.toISOString();

    return { startDate, endDate };
  }
}
