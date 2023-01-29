import { NonNullFindOptions, Op, Sequelize } from 'sequelize';
import { Transaction } from 'sequelize/dist';
import createHttpError from 'http-errors';
import { getSpaceNullPercentage } from '@wimet/api-shared';
import database from '../db';
import Amenity from '../db/models/Amenity';
import Company from '../db/models/Company';
import Location, { LocationAttributes } from '../db/models/Location';
import LocationAmenity from '../db/models/LocationAmenity';
import { LocationDTO } from '../dto/location';
import LocationFile from '../db/models/LocationFile';
import Space, { SpaceStatus } from '../db/models/Space';
import SpaceType from '../db/models/SpaceType';
import SpaceFile from '../db/models/SpaceFile';
import SpaceAmenity from '../db/models/SpaceAmenity';
import { SpaceFilters } from '../helpers/space';
import SpaceService from './space';
import HourlySpaceService from './hourly-space';
import Currency from '../db/models/Currency';
import Credits from '../db/models/Credits';
import SpaceReservationType from '../db/models/SpaceReservationType';
import LocationHelper from '../helpers/location';
import { LOCATION_ACTIVE_SPACES, LOCATION_NOT_FOUND } from '../config/errorCodes';
import logger from '../helpers/logger';

const loggerInstance = logger('location-service');

// TODO: Create Location Scope to avoid duplication

export default class LocationService {
  static async setLocation(userId: number, payload: LocationDTO, companyId?: number, id?: number) {
    const { spaces, amenities, locationFiles, ...locationPayload } = payload;

    const newLocation = await database.transaction(async t => {
      const [location] = await LocationHelper.findOrCreateByUser(id, userId, companyId, locationPayload, t);

      // TODO - Move to another endpoint
      if (Array.isArray(spaces) && spaces.length > 0) {
        const newSpaces = spaces
          .map(space =>
            Array.from({ length: space.count }, (_, index) => ({
              name: `${space.name} ${index + 1}`,
              spaceTypeId: space.spaceTypeId,
              locationId: location.id,
              spaceReservationTypeId: 1, // TODO - Change this
            }))
          )
          .flat();

        await Space.bulkCreate(newSpaces, { transaction: t });
      }

      if (Array.isArray(amenities)) {
        await LocationAmenity.destroy({ where: { locationId: location.id }, force: true, transaction: t });
        await LocationAmenity.bulkCreate(
          amenities.map(amenityId => ({ amenityId, locationId: location.id })),
          { transaction: t }
        );
      }

      if (Array.isArray(locationFiles)) {
        await LocationFile.destroy({ where: { locationId: location.id }, force: true, transaction: t });
        await LocationFile.bulkCreate(
          locationFiles.map(file => ({
            type: file.type,
            url: file.url,
            key: file.key,
            mimetype: file.mimetype,
            name: file.name,
            locationId: location.id,
          })),
          { transaction: t }
        );
      }

      return location;
    });

    return Location.findByPk(newLocation.id, {
      include: [
        LocationFile,
        {
          model: LocationAmenity,
          include: [Amenity],
        },
      ],
    });
  }

  static async removeLocationByUser(userId: number, locationId: number) {
    const location = await Location.scope({ method: ['byUser', userId, locationId] }).findOne({ rejectOnEmpty: true });
    const spaces = await location.getSpaces({ where: { status: SpaceStatus.PUBLISHED } });

    if (spaces.length > 0) throw createHttpError(400, LOCATION_ACTIVE_SPACES);

    return location.destroy();
  }

  static async findAllByUser(userId: number, companyId: number) {
    const location = await Location.scope({
      method: ['byUser', userId, { [Op.not]: null }],
    }).findAll({
      where: {
        companyId,
      },
    });

    return Promise.all(
      location.map(async l => {
        const types: SpaceType['value'][] = ['MEETING_ROOM', 'SHARED', 'PRIVATE_OFFICE'];
        let spaceCount = await Space.count({
          where: {
            locationId: l.id,
          },
          attributes: ['spaceTypeId', 'spaceType.value'],
          group: ['spaceTypeId'],
          distinct: true,
          include: [
            {
              model: SpaceType,
            },
          ],
        });

        spaceCount = types.map(t => {
          const count = spaceCount.find(s => s.value === t);
          if (count) return count;
          return { count: 0, spaceTypeId: null, value: t };
        });

        return {
          data: l,
          spaceCount,
        };
      })
    );
  }

  static async findOneByUser(userId: number, locationId: number, transaction?: Transaction) {
    return Location.scope({
      method: ['byUser', userId, locationId],
    }).findOne({ transaction, rejectOnEmpty: true });
  }

  static async findByPkByUser(
    userId: number,
    locationId?: number,
    options?: Omit<NonNullFindOptions<LocationAttributes>, 'where'>
  ) {
    try {
      return await Location.scope({ method: ['byUser', userId, locationId] }).findOne(options);
    } catch (e) {
      loggerInstance.error('Location not found for user', e);
      throw createHttpError(404, LOCATION_NOT_FOUND);
    }
  }

  static async findAllInRadius({ lat, lng }: { lat: number; lng: number }, radius: number, filters: SpaceFilters) {
    const distance = Sequelize.literal(
      `6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(${lng}) - radians(longitude)) + sin(radians(${lat})) * sin(radians(latitude)))`
    );
    const locations = (await Location.findAll({
      include: [
        Company.scope('withFeePercentage'),
        {
          model: Space,
          where: filters,
          include: [SpaceFile, SpaceAmenity, SpaceReservationType],
        },
        {
          model: Currency,
          attributes: ['id'],
          include: [{ model: Credits, attributes: ['value'] }],
        },
      ],
      where: Sequelize.where(distance, { [Op.lte]: radius }),
    })) as unknown as (Location & { spaces: Space[] })[];

    const parsedLocations = await Promise.all(
      locations.map(async l => {
        const spaces = await Promise.all(
          l.spaces.map(async s => {
            const data = s.toJSON();
            const creditPrice = l.currency.credit.value;
            const feePercentage = l.company.feePercentage?.value;

            const { percentage } = getSpaceNullPercentage(data);
            const config = await SpaceService.getSpaceConfig(s);

            const averageCreditsWithFee = SpaceService.getCreditsCount(
              HourlySpaceService.getAveragePrice(config.hourly),
              l.currency.credit.value,
              feePercentage
            );

            return {
              ...data,
              ...config,
              ...SpaceService.getSpaceFiles(s),
              percentage,
              averageCreditsWithFee,
              hourly: HourlySpaceService.addCredits(config.hourly, creditPrice, feePercentage),
            };
          })
        );
        return {
          ...l.toJSON(),
          spaces,
        };
      })
    );

    return parsedLocations.filter(l => l.spaces.length);
  }

  static async updateCompany(locationIds: number[], companyId: number) {
    return Location.update(
      {
        companyId,
      },
      {
        where: {
          id: {
            [Op.in]: locationIds,
          },
        },
      }
    );
  }

  static async findBySeat(seatId: number, transaction?: Transaction) {
    return Location.scope([{ method: ['bySeat', seatId] }]).findOne({ transaction });
  }
}
