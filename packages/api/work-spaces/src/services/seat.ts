/* eslint-disable import/no-cycle */
import { addDays } from 'date-fns';
import createHttpError from 'http-errors';
import { FindOptions, NonNullFindOptions, Op, Sequelize, Transaction } from 'sequelize';
import { SEAT_ACTIVE_RESERVATIONS } from '../config/errorCodes';
import database from '../db';
import Seat, { SeatAttributes, SeatProviderNames } from '../db/models/Seat';
import SeatAmenity from '../db/models/SeatAmenity';
import { SeatDTO } from '../dto/seat';
import logger from '../helpers/logger';
import BlueprintService from './blueprint';
import CompanyService from './company';
import GoogleCalendarService from './google-calendar';
import SpaceTypeService from './space-type';

const loggerInstance = logger('seat-service');

type GetSeatsByBlueprintType = {
  userId: number;
  blueprintId?: number;
  selectedDate?: Date;
  includeAmenities?: boolean;
  filterByUserAmenity?: boolean;
  includeReservations?: boolean;
  includeReservationsUser?: boolean;
  originTz: string;
  destinationTz: string;
  options?: FindOptions<SeatAttributes>;
};
export default class SeatService {
  static async destroyNotInByUser(seats: SeatDTO[], userId: number, blueprintId: number, transaction?: Transaction) {
    const seatsToDelete = await Seat.scope([
      { method: ['byUser', userId] },
      { method: ['byBlueprint', blueprintId] },
    ]).findAll({
      where: {
        id: {
          [Op.notIn]: seats.map(s => s.id || -1),
        },
      },
      attributes: ['id'],
      transaction,
    });

    return Seat.destroy({
      where: {
        id: seatsToDelete.map(s => s.id),
      },
      transaction,
    });
  }

  static async bulkUpsert(seats: SeatDTO[], blueprintId: number, transaction?: Transaction) {
    const updateOnDuplicate: Exclude<keyof SeatAttributes, 'id' | 'blueprintId'>[] = ['geometry'];
    return Seat.bulkCreate(
      seats.map(s => ({ ...s, blueprintId })),
      { updateOnDuplicate, transaction }
    );
  }

  static async setSeats(userId: number, seats: SeatDTO[], blueprintId: number) {
    await SeatService.destroyNotInByUser(seats, userId, blueprintId);
    return SeatService.bulkUpsert(seats, blueprintId);
  }

  static async getSeatsByBlueprint({
    userId,
    blueprintId,
    selectedDate,
    includeAmenities,
    filterByUserAmenity,
    includeReservations,
    includeReservationsUser,
    originTz,
    destinationTz,
    options,
  }: GetSeatsByBlueprintType) {
    return Seat.scope([
      { method: ['byBlueprint', blueprintId ?? { [Op.not]: null }] },
      { method: 'withSpaceType' },
      ...(includeAmenities ? [{ method: 'withAmenities' }] : []),
      ...(filterByUserAmenity ? [{ method: ['filterByUserAmenity', userId] as [string, number] }] : []),
      ...(includeReservations
        ? [
            {
              method: ['withReservations', includeReservationsUser, selectedDate, originTz, destinationTz] as [
                string,
                boolean,
                Date,
                string,
                string
              ],
            },
          ]
        : []),
    ]).findAll(options);
  }

  static async getSeatByBlueprint(params: GetSeatsByBlueprintType) {
    return (await SeatService.getSeatsByBlueprint(params))[0];
  }

  static async getSeatsByLocation(locationId: number) {
    const scoped = Seat.scope([{ method: ['byLocation', locationId] }]);
    const totalSeats = await scoped.count();
    const seatsAvailable = await scoped.count({
      where: {
        isAvailable: true,
      },
    });

    return {
      totalSeats,
      seatsAvailable,
    };
  }

  static async getOne(seatId: number) {
    return Seat.scope([{ method: 'withAmenities' }, { method: 'withSpaceType' }]).findByPk(seatId);
  }

  static async createSeatByBlueprint(
    userId: number,
    companyId: number,
    blueprintId: number,
    { id, amenities, ...payload }: SeatDTO
  ) {
    const newSeat = await database.transaction(async transaction => {
      const blueprint = await BlueprintService.getOneByUser(userId, blueprintId, { transaction, rejectOnEmpty: true });
      const seat = await Seat.create({ blueprintId: blueprint.id, ...payload }, { transaction });

      if (Array.isArray(amenities)) {
        const parsedAmenities = [...new Set(amenities)];
        await SeatService.setSeatsAmenities(companyId, seat.id, parsedAmenities, transaction);
      }

      return seat;
    });

    return SeatService.getOne(newSeat.id);
  }

  static async updateSeatByUser(userId: number, companyId: number, seatId: number, { amenities, ...rest }: SeatDTO) {
    const updatedSeat = await database.transaction(async transaction => {
      const seat = await Seat.scope([{ method: ['byUser', userId] }]).findByPk(seatId, {
        rejectOnEmpty: true,
        transaction,
      });

      await seat.update(
        { geometry: rest.geometry, isAvailable: rest.isAvailable, name: rest.name },
        { where: { id: seatId }, transaction }
      );

      if (Array.isArray(amenities)) {
        const parsedAmenities = [...new Set(amenities)];
        await SeatService.setSeatsAmenities(companyId, seat.id, parsedAmenities, transaction);
      }

      return seat;
    });
    return SeatService.getOne(updatedSeat.id);
  }

  static setSeatsAmenities = async (
    companyId: number,
    seatId: number,
    amenities: number[],
    transaction?: Transaction
  ) => {
    const existantCompanyAmenities = await CompanyService.findAllCompanyAmenitiesByIds(companyId, amenities);
    const nonExistantCompanyAmenities = amenities.filter(a => !existantCompanyAmenities.some(c => c.amenityId === a));

    const newCompanyAmenities = await CompanyService.addCompanyAmenities(
      companyId,
      nonExistantCompanyAmenities,
      transaction
    );

    const companyAmenities = [...existantCompanyAmenities, ...newCompanyAmenities];

    await SeatAmenity.destroy({ where: { seatId }, force: true, transaction });
    await SeatAmenity.bulkCreate(
      companyAmenities.map(a => ({ amenityId: a.amenityId, seatId })),
      { transaction }
    );
  };

  static async deleteSeatByUser(userId: number, seatId: number) {
    return database.transaction(async transaction => {
      const seat = await Seat.scope([{ method: ['byUser', userId] }, { method: ['withReservations', false] }]).findOne({
        where: { id: seatId },
        rejectOnEmpty: true,
        transaction,
        logging: m => loggerInstance.debug(m),
      });

      if (seat.WPMReservations.length) throw createHttpError(400, SEAT_ACTIVE_RESERVATIONS);

      await seat.destroy({ transaction });

      return seat;
    });
  }

  static async getAllByCompanyAndAmenity(companyId: number, amenityId: number, transaction?: Transaction) {
    return Seat.scope([{ method: ['byCompany', companyId] }, { method: ['byAmenity', amenityId] }]).findAll({
      transaction,
    });
  }

  static async findOneByProvider(
    companyId: number, // TODO: Add companyId scope
    providerName: SeatProviderNames,
    providerId: string,
    options?: Omit<NonNullFindOptions<SeatAttributes>, 'where'>
  ) {
    return Seat.findOne({
      where: { provider: { name: providerName, id: providerId } },
      ...options,
    });
  }

  static async findOrCreateByGoogleProvider(
    refreshToken: string,
    companyId: number,
    blueprintId: number,
    seatName: string,
    providerId: string,
    calendarId: string,
    transaction?: Transaction
  ) {
    let seat = await SeatService.findOneByProvider(companyId, 'google', providerId);
    if (!seat) {
      const [{ id, expiration, resourceId }, spaceType] = await Promise.all([
        GoogleCalendarService.watchEvents(refreshToken, calendarId),
        SpaceTypeService.findByType('MEETING_ROOM'),
      ]);
      [seat] = await SeatService.bulkUpsert(
        [
          {
            blueprintId,
            provider: {
              name: 'google',
              id: providerId,
              calendarId,
              calendarSyncToken: null,
              webhook: { id, expiration, resourceId },
            },
            name: seatName,
            spaceTypeId: spaceType.id,
            isAvailable: true,
          },
        ],
        blueprintId,
        transaction
      );

      await GoogleCalendarService.runPaginated(refreshToken, seat, calendarId, undefined, transaction);
    }

    return seat;
  }

  static async findOneByWebhookId(providerName: SeatProviderNames, websocketId: string, transaction?: Transaction) {
    return Seat.scope([{ method: ['byWebhook', providerName, websocketId] }]).findOne({
      transaction,
      rejectOnEmpty: true,
    });
  }

  static async updateById(
    seatId: number,
    values: { [key in keyof Seat['_attributes']]?: Seat['_attributes'][key] },
    transaction?: Transaction
  ) {
    return Seat.update(values, { where: { id: seatId }, transaction });
  }

  static async getAllWebhooksNearToExpire(providerName: SeatProviderNames, transaction?: Transaction) {
    return Seat.scope('withCompany').findAll({
      where: {
        provider: {
          [Op.and]: [
            { name: providerName },
            Sequelize.where(
              Sequelize.cast(
                Sequelize.literal('JSON_UNQUOTE(JSON_EXTRACT(`seat`.`provider`, \'$."webhook"."expiration"\'))'),
                'UNSIGNED'
              ),
              { [Op.lte]: addDays(new Date(), 1).getTime() }
            ),
          ],
        },
      },
      transaction,
    });
  }
}
