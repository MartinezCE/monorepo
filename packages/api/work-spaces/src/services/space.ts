/* eslint-disable import/no-cycle */
import { Transaction } from 'sequelize/dist';
import { getSpaceNullPercentage } from '@wimet/api-shared';
import database from '../db';
import Location from '../db/models/Location';
import Space from '../db/models/Space';
import SpaceAmenity from '../db/models/SpaceAmenity';
import SpaceFile from '../db/models/SpaceFile';
import { SpaceDTO } from '../dto/space';
import FileService from './file';
import HourlySpaceService from './hourly-space';
import MonthlySpaceService from './monthly-space';
import SpaceReservationTypeService from './space-reservation-type';
import SpaceScheduleService from './space-schedule';
import SpaceReservationType from '../db/models/SpaceReservationType';
import Company from '../db/models/Company';
import SpaceType from '../db/models/SpaceType';
import Amenity from '../db/models/Amenity';
import LocationFile from '../db/models/LocationFile';
import LocationAmenity from '../db/models/LocationAmenity';
import AmenityService from './amenity';
import { SpaceFilters } from '../helpers/space';
import Currency from '../db/models/Currency';
import Credits from '../db/models/Credits';
import User from '../db/models/User';

export default class SpaceService {
  static async createSpace(
    userId: number,
    payload: SpaceDTO,
    locationId?: number,
    transaction?: Transaction
  ): Promise<Space> {
    const location = await Location.scope({
      method: ['byUser', userId, locationId],
    }).findOne({
      rejectOnEmpty: true,
      transaction,
    });
    const space = await Space.create(
      {
        ...payload,
        locationId: location.id,
      },
      {
        include: [Location],
        transaction,
      }
    );

    return Space.scope({
      method: ['byUser', userId],
    }).findOne({
      where: {
        id: space.id,
      },
      transaction,
    });
  }

  static async removeSpaceByUser(userId: number, spaceId: number) {
    const space = await Space.scope({
      method: ['byUser', userId],
    }).findOne({ where: { id: spaceId }, rejectOnEmpty: true });

    return space.destroy();
  }

  static async editSpace(userId: number, payload: SpaceDTO, id?: number, transaction?: Transaction): Promise<Space> {
    const space = await Space.scope({
      method: ['byUser', userId],
    }).findOne({
      where: {
        id,
      },
      transaction,
      rejectOnEmpty: true,
    });

    return space.update(payload, { transaction });
  }

  static async setSpace(userId: number, payload: SpaceDTO, locationId?: number, id?: number) {
    const { amenities, spaceFiles, schedule, hourly } = payload || {};

    const newSpace = await database.transaction(async (t: Transaction) => {
      let space: Space;

      if (id) {
        space = await SpaceService.editSpace(userId, payload, id, t);
      } else {
        space = await SpaceService.createSpace(userId, payload, locationId, t);
      }

      if (Array.isArray(amenities)) {
        await SpaceAmenity.destroy({ where: { spaceId: space.id }, force: true, transaction: t });
        await SpaceAmenity.bulkCreate(
          amenities.map(amenityId => ({ amenityId, spaceId: space.id })),
          { transaction: t }
        );
      }

      if (Array.isArray(spaceFiles)) {
        await SpaceFile.destroy({ where: { spaceId: space.id }, force: true, transaction: t });
        await SpaceFile.bulkCreate(
          spaceFiles.map(file => ({
            type: file.type,
            url: file.url,
            key: file.key,
            mimetype: file.mimetype,
            name: file.name,
            spaceId: space.id,
          })),
          { transaction: t }
        );
      }

      return space;
    });

    await database.transaction(async (t: Transaction) => {
      if (schedule) {
        await SpaceScheduleService.create(newSpace.id, schedule, t, true);
      }
      const reservationType = await SpaceReservationTypeService.getOneById(newSpace.spaceReservationTypeId);

      if (reservationType.value === 'MONTHLY') {
        await MonthlySpaceService.createOrEdit(newSpace.id, payload.monthly, t);
      }

      if (reservationType.value === 'HOURLY' && hourly) {
        await HourlySpaceService.removeFromSpace(newSpace.id, t);
        if (payload.hourly.length > 0) {
          await HourlySpaceService.create(newSpace.id, payload.hourly, t);
        }
      }
    });

    return SpaceService.findOneByUser(userId, newSpace.id);
  }

  static async findOneByUser(userId: number, spaceId?: number, transaction?: Transaction) {
    const space = await Space.scope({
      method: ['byUser', userId],
    }).findOne({
      where: {
        id: spaceId,
      },
      rejectOnEmpty: true,
      transaction,
    });

    const config = await SpaceService.getSpaceConfig(space);

    return {
      ...space.toJSON(),
      ...config,
      ...SpaceService.getSpaceFiles(space),
    };
  }

  static getSpaceFiles(space: Space) {
    return {
      spaceFiles: FileService.groupFileByType(space.spaceFiles),
    };
  }

  static getSpaceWithUser(spaceId: number) {
    return Space.findOne({
      where: {
        id: spaceId,
      },
      include: [
        {
          model: Location,
          required: true,
          include: [
            {
              model: Company,
              required: true,
              include: [
                {
                  model: User,
                },
              ],
            },
            {
              model: Currency,
              attributes: ['id'],
              include: [{ model: Credits, attributes: ['value'] }],
            },
          ],
        },
      ],
    });
  }

  // TODO: Remove includes & move to a new scope
  static async findAllByLocationId(locationId: number, filters?: SpaceFilters) {
    const spaces = await Space.findAll({
      where: {
        locationId,
        ...filters,
      },
      include: [
        SpaceReservationType,
        {
          model: Location,
          required: true,
          include: [
            {
              model: Company.scope('withFeePercentage'),
              required: true,
            },
            {
              model: Currency,
              attributes: ['id'],
              include: [{ model: Credits, attributes: ['value'] }],
            },
          ],
        },
        {
          model: SpaceAmenity,
          include: [
            {
              model: Amenity,
            },
          ],
        },
        SpaceFile,
        SpaceType,
      ],
    });

    return Promise.all(
      spaces.reduce((acc, space) => {
        const parsedSpace = space.toJSON();
        const nullpercentage = getSpaceNullPercentage(parsedSpace);
        const feePercentage = space.location.company.feePercentage?.value;
        const creditPrice = space.location.currency.credit.value;

        acc.push(
          // eslint-disable-next-line no-async-promise-executor
          new Promise(async (res, rej) => {
            try {
              const config = await SpaceService.getSpaceConfig(space);

              res({
                ...parsedSpace,
                ...config,
                ...SpaceService.getSpaceFiles(space),
                ...nullpercentage,
                averageCreditsWithFee: SpaceService.getCreditsCount(
                  HourlySpaceService.getAveragePrice(config.hourly),
                  creditPrice,
                  feePercentage
                ),
                hourly: HourlySpaceService.addCredits(config.hourly, creditPrice, feePercentage),
              });
            } catch (err) {
              rej(err);
            }
          })
        );

        return acc;
      }, [] as Promise<unknown>[])
    );
  }

  static async findOneById(id: number, transaction?: Transaction) {
    const space = await Space.findOne({
      where: {
        id,
      },
      include: [
        SpaceReservationType,
        {
          model: Location,
          required: true,
          include: [
            {
              model: Company.scope('withFeePercentage'),
              required: true,
            },
            LocationFile,
            {
              model: LocationAmenity,
              include: [Amenity],
            },
            {
              model: Currency,
              attributes: ['id'],
              include: [{ model: Credits, attributes: ['value'] }],
            },
          ],
        },
        {
          model: SpaceAmenity,
          include: [
            {
              model: Amenity,
            },
          ],
        },
        SpaceFile,
        SpaceType,
      ],
      rejectOnEmpty: true,
      transaction,
    });

    const config = await SpaceService.getSpaceConfig(space);
    const parsedSpace = space.toJSON();
    const feePercentage = space.location.company.feePercentage?.value;
    const creditPrice = space.location.currency.credit.value;

    return {
      ...parsedSpace,
      location: {
        ...parsedSpace.location,
        locationFiles: FileService.groupFileByType((space.location as unknown as Location).locationFiles),
        locationsAmenities: (space.location as unknown as Location).locationsAmenities.reduce(
          (acc, locationAmenity) => {
            const amenity = locationAmenity['amenity'] as Amenity; // eslint-disable-line @typescript-eslint/dot-notation
            const key = amenity.type;

            return AmenityService.groupOne(acc, key, amenity);
          },
          {}
        ),
      },
      spacesAmenities: space.spacesAmenities.reduce((acc, spaceAmenity) => {
        const amenity = spaceAmenity['amenity'] as Amenity; // eslint-disable-line @typescript-eslint/dot-notation
        const key = amenity.type;

        return AmenityService.groupOne(acc, key, amenity);
      }, {}),
      ...SpaceService.getSpaceFiles(space),
      ...config,
      averageCreditsWithFee: SpaceService.getCreditsCount(
        HourlySpaceService.getAveragePrice(config.hourly),
        creditPrice,
        feePercentage
      ),
      hourly: HourlySpaceService.addCredits(config.hourly, creditPrice, feePercentage),
    };
  }

  static async getSpaceConfig(space: Space) {
    return {
      monthly: await MonthlySpaceService.findBySpace(space.id),
      hourly: await HourlySpaceService.findAllBySpace(space.id),
      schedule: await SpaceScheduleService.findAllBySpace(space.id),
    };
  }

  static getPriceWithFee = (price: number, feePercentage: number) => price + price * feePercentage;

  static getCreditsCount = (price: number, creditPrice: number, feePercentage: number) =>
    Math.ceil(SpaceService.getPriceWithFee(Number(price), Number(feePercentage)) / Number(creditPrice));

  static getPriceFromCredits = (credits: number, creditPrice: number) => credits * creditPrice;
}
