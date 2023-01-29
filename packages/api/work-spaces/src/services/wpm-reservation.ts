/* eslint-disable import/no-cycle */
/* eslint-disable class-methods-use-this */
import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';
import { getTimezoneOffset, utcToZonedTime } from 'date-fns-tz';
import { calendar_v3 } from 'googleapis';
import createHttpError from 'http-errors';
import { isUndefined, last } from 'lodash';
import { Op, Transaction } from 'sequelize';
import { INVALID_SEAT_IDS, SEAT_NOT_FOUND, UNAUTHORIZED_BLUEPRINT } from '../config/errorCodes';
import db from '../db';
import User from '../db/models/User';
import WPMReservation, {
  WPMReservationProvider,
  WPMReservationProviderNames,
  WPMReservationStatus,
} from '../db/models/WPMReservation';
import { WPMReservationTypes } from '../db/models/WPMReservationType';
import { WPMReservationDTO } from '../dto/wpm-reservation';
import DateHelper from '../helpers/date';
import logger from '../helpers/logger';
import BlueprintService from './blueprint';
import CompanyService from './company';
import GoogleCalendarService from './google-calendar';
import LocationService from './location';
import SeatService from './seat';
import SpaceTypeService from './space-type';
import UserService from './user';
import WPMReservationTypeService from './wpm-reservation-type';

const loggerInstance = logger('wpm-reservation-service');

const reservationValidators: {
  [k in WPMReservationTypes]?: (
    newReservation: {
      startAt: Date;
      endAt: Date;
      type: WPMReservationTypes;
    },
    oldReservation: WPMReservation
  ) => boolean;
} = {
  [WPMReservationTypes.DAYPASS]: () => false,
  [WPMReservationTypes.MORNING]: newReservation => newReservation.type === WPMReservationTypes.AFTERNOON,
  [WPMReservationTypes.AFTERNOON]: newReservation => newReservation.type === WPMReservationTypes.MORNING,
  [WPMReservationTypes.CUSTOM]: (newReservation, r) => {
    const { startAt, endAt, destinationTz: tz } = r;
    const start = utcToZonedTime(startAt, tz);
    const end = utcToZonedTime(endAt, tz);

    const isStartInsideInterval = isWithinInterval(newReservation.startAt, { start, end });
    const isEndInsideInterval = isWithinInterval(newReservation.endAt, { start, end });

    return !isStartInsideInterval && !isEndInsideInterval;
  },
};

class WPMReservationService {
  parsedReservationTypes: { [k: number]: WPMReservationTypes };

  async getParsedReservationTypes() {
    if (this.parsedReservationTypes) return this.parsedReservationTypes;

    const reservationTypes = await WPMReservationTypeService.getReservationTypes();
    this.parsedReservationTypes = reservationTypes.reduce((acc, type) => {
      acc[type.id] = type.name;
      return acc;
    }, {} as { [k: number]: WPMReservationTypes });

    return this.parsedReservationTypes;
  }

  async checkIfSeatIsAvailable(
    typeId: number,
    seatId: number,
    startAt: string,
    endAt: string,
    destinationTz: string,
    excludedReservations: WPMReservation[] = [],
    transaction?: Transaction
  ) {
    const newReservationEndOfDay = DateHelper.toDestinationTz(endAt, destinationTz, destinationTz, endOfDay);
    const newReservation = {
      startAt: utcToZonedTime(startAt, destinationTz),
      endAt: utcToZonedTime(endAt, destinationTz),
      type: (await this.getParsedReservationTypes())[typeId],
    };

    const wpmReservations = await WPMReservation.scope([
      { method: ['withReservationType'] },
      { method: ['betweenDates', startAt, newReservationEndOfDay] },
    ]).findAll({
      where: {
        id: { [Op.notIn]: excludedReservations.map(r => r.id) },
        seatId,
        status: { [Op.not]: WPMReservationStatus.CANCEL },
      },
      transaction,
    });

    wpmReservations.forEach(r => {
      const reservationType = r.WPMReservationType.name;
      const isValid = reservationValidators[reservationType](newReservation, r);

      if (!isValid) throw createHttpError(400, `RESERVED_SEAT_${reservationType}`);
    });
  }

  async createReservation(
    user: User,
    WPMReservationTypeId: number,
    seatId: number,
    startAt: Date,
    endAt: Date = null,
    originTz: string,
    destinationTz: string,
    provider?: WPMReservationProvider,
    providerPayload?: calendar_v3.Schema$Events,
    canceledReservationsOnTransaction: WPMReservation[] = [],
    parentTransaction?: Transaction
  ) {
    return db.transaction({ transaction: parentTransaction }, async transaction => {
      const [company, seat, location, seatSpaceType] = await Promise.all([
        CompanyService.findCompanyBySeatId(seatId),
        SeatService.getOne(seatId),
        LocationService.findBySeat(seatId, transaction),
        SpaceTypeService.findByType('MEETING_ROOM'),
      ]);
      const originOffset = getTimezoneOffset(originTz);
      const destinationOffset = getTimezoneOffset(destinationTz);
      const isMeetingRoom = seat.spaceTypeId === seatSpaceType.id;

      const destinationStartAt = isMeetingRoom
        ? DateHelper.toDestinationTz(startAt, originTz, destinationTz)
        : DateHelper.toDestinationTz(startAt, originTz, destinationTz, startOfDay);

      const destinationEndAt =
        endAt && isMeetingRoom
          ? DateHelper.toDestinationTz(endAt, originTz, destinationTz)
          : DateHelper.toDestinationTz(startAt, originTz, destinationTz, endOfDay);

      if (isMeetingRoom) {
        const customWPMType = await WPMReservationTypeService.findByName(WPMReservationTypes.CUSTOM);
        WPMReservationTypeId = customWPMType.id;
      }

      await this.checkIfSeatIsAvailable(
        WPMReservationTypeId,
        seatId,
        destinationStartAt,
        destinationEndAt,
        destinationTz,
        canceledReservationsOnTransaction,
        transaction
      );

      const reservation = await WPMReservation.create(
        {
          WPMReservationTypeId,
          userId: user.id,
          seatId,
          originTz,
          originOffset,
          destinationTz,
          destinationOffset,
          startAt: destinationStartAt,
          endAt: destinationEndAt,
          status: WPMReservationStatus.PENDING,
          provider,
          providerPayload,
        },
        { transaction }
      );

      const seatMigratedFromGoogle = !!seat.provider?.calendarId;
      const reservationCreatedByGoogle = !!reservation.provider?.eventId;

      if (seatMigratedFromGoogle && !reservationCreatedByGoogle) {
        const { data } = await GoogleCalendarService.createEvent(
          last(company.adminProviders.google).refreshToken,
          seat.provider.calendarId,
          destinationStartAt,
          destinationEndAt,
          user,
          seat,
          reservation,
          location
        );

        await reservation.update(
          { provider: { name: 'google', eventId: data.id, synced: false }, providerPayload: data },
          { transaction }
        );
      }

      return reservation;
    });
  }

  async getAllReservationsByCompany(companyId: number, originTz?: string, destinationTz?: string, selectedDate?: Date) {
    try {
      return await WPMReservation.scope([
        { method: ['byCompany', companyId] },
        { method: 'withLocation' },
        { method: 'withReservationType' },
        ...(!isUndefined(selectedDate)
          ? [{ method: ['byDate', selectedDate, originTz, destinationTz] as [string, Date, string, string] }]
          : []),
      ]).findAll();
    } catch (e) {
      loggerInstance.error('Error getting the company reservations', e);
      throw e;
    }
  }

  async getAllReservationsByUser(userId: number) {
    try {
      return await WPMReservation.scope([
        { method: ['byUser', userId] },
        { method: 'withLocation' },
        { method: 'withReservationType' },
      ]).findAll();
    } catch (e) {
      loggerInstance.error('Error getting the user reservations', e);
      throw e;
    }
  }

  async createReservations(
    blueprintId: number,
    reservations: WPMReservationDTO['reservations'],
    originTz: string,
    destinationTz: string
  ) {
    const areValidSeats = await BlueprintService.hasSeats(
      blueprintId,
      reservations.map(({ seatId }) => seatId)
    );
    if (!areValidSeats) throw createHttpError(400, INVALID_SEAT_IDS);

    return Promise.all(
      reservations.map(async ({ seatId, typeId, startAt, endAt, userId }) => {
        const user = await UserService.getUserById(userId);
        this.createReservation(user, typeId, seatId, startAt, endAt, originTz, destinationTz);
      })
    );
  }

  async getSeatReservationsByUser(
    userId: number,
    seatId: number,
    selectedDate: Date,
    originTz: string,
    destinationTz: string
  ) {
    const seat = await SeatService.getOne(seatId);

    if (!seat) throw createHttpError(404, SEAT_NOT_FOUND);

    try {
      await BlueprintService.getOneAssociatedToUser(userId, seat.blueprintId);
    } catch (_) {
      throw createHttpError(403, UNAUTHORIZED_BLUEPRINT);
    }

    const reservations = await WPMReservation.scope([
      { method: ['byDate', selectedDate, originTz, destinationTz] },
      { method: 'withReservationType' },
      { method: 'withUser' },
    ]).findAll({ where: { seatId } });

    return reservations;
  }

  async getReservationsUsers(companyId: number, originTz?: string, destinationTz?: string, selectedDate?: Date) {
    return User.findAll({
      include: {
        model: WPMReservation.scope([
          { method: ['byCompany', companyId] },
          { method: ['byDate', selectedDate, originTz, destinationTz] },
        ]),
      },
      attributes: { exclude: ['password'] },
    });
  }

  async getReservationsByLocation(
    userId: number,
    locationId: number,
    selectedDate: Date,
    originTz: string,
    destinationTz: string
  ) {
    return WPMReservation.scope([
      { method: ['withLocation', locationId] },
      { method: ['byDate', selectedDate, originTz, destinationTz] },
    ]).findAll({ where: { userId } });
  }

  async getReservationsUsersByLocation(
    locationId: string,
    selectedDate: Date,
    originTz: string,
    destinationTz: string
  ) {
    return WPMReservation.scope([
      { method: ['byLocation', locationId] },
      { method: ['byDate', selectedDate, originTz, destinationTz] },
    ]).findAll({
      attributes: ['id', 'startAt', 'status'],
    });
  }

  async setCheckIn(reservationId: number) {
    return WPMReservation.update({ status: WPMReservationStatus.DONE }, { where: { id: reservationId } });
  }

  async setCancel(reservationId: number) {
    return WPMReservation.update({ status: WPMReservationStatus.CANCEL }, { where: { id: reservationId } });
  }

  async findOneByProvider(
    providerName: WPMReservationProviderNames,
    providerId: string,
    searchOpts?: { synced?: boolean; includeCanceled?: boolean },
    transaction?: Transaction
  ) {
    return WPMReservation.findOne({
      where: {
        provider: {
          name: providerName,
          eventId: providerId,
          ...(typeof searchOpts?.synced === 'boolean' ? { synced: searchOpts?.synced } : {}),
        },
        ...(!searchOpts?.includeCanceled ? { status: { [Op.notIn]: [WPMReservationStatus.CANCEL] } } : {}),
      },
      order: [['id', 'DESC']],
      transaction,
    });
  }

  async findAllByProvider(
    providerName: WPMReservationProviderNames,
    providerId: string,
    includeCanceled = false,
    transaction?: Transaction
  ) {
    return WPMReservation.findAll({
      where: {
        provider: { name: providerName, eventId: providerId },
        ...(!includeCanceled ? { status: { [Op.notIn]: [WPMReservationStatus.CANCEL] } } : {}),
      },
      transaction,
    });
  }

  async getLastReservationBySeat(seatId: number, transaction?: Transaction) {
    return WPMReservation.findOne({
      where: { seatId },
      order: [['id', 'DESC']],
      transaction,
    });
  }
}

export default new WPMReservationService();
