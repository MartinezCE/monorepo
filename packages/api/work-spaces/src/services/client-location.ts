/* eslint-disable import/no-cycle */
import { NonNullFindOptions, Transaction } from 'sequelize';
import { getClientLocationNullPercentage } from '@wimet/api-shared';
import database from '../db/database';
import Blueprint from '../db/models/Blueprint';
import Floor from '../db/models/Floor';
import Location, { LocationAttributes, LocationProviderNames, LocationStatus } from '../db/models/Location';
import { ClientLocationDTO } from '../dto/client-location';
import FloorService from './floor';
import BlueprintService from './blueprint';
import { FloorDTO } from '../dto/floor';
import LocationHelper from '../helpers/location';
import User from '../db/models/User';
import UserService from './user';
import { UserRoleEnum } from '../common/enum/user';
import CompanyService from './company';
import SlackService from './slack';
import UserType, { UserTypes } from '../db/models/UserType';
import UserRole from '../db/models/UserRole';
import Seat from '../db/models/Seat';
import GoogleCalendarService from './google-calendar';

export default class ClientLocationService {
  static async setClientLocation(userId: number, payload: ClientLocationDTO, companyId?: number, id?: number) {
    const response = await database.transaction(async t => {
      const [user, company] = await Promise.all([
        UserService.getUserById(userId, t, { include: [UserType] }),
        CompanyService.findCompanyById(companyId, t),
      ]);
      const { floors, ...locationPayload } = payload;
      let locationStatusOnCreate: LocationStatus;

      if (user.userType.value === UserTypes.CLIENT) {
        locationStatusOnCreate = LocationStatus.PUBLISHED;
      }

      const [location, created] = await LocationHelper.findOrCreateByUser(
        id,
        userId,
        companyId,
        locationPayload,
        t,
        locationStatusOnCreate
      );

      if (floors?.length > 0) {
        await ClientLocationService.setFloorsAndBlueprints(floors, userId, location.id, t);
      }

      if (created && location.status === LocationStatus.PENDING) {
        await SlackService.sendNewClientLocation(user, company, location);
      }

      return location;
    });

    return ClientLocationService.findOneByUser(userId, response.id);
  }

  static async setFloorsAndBlueprints(floors: FloorDTO[], userId: number, locationId: number, t: Transaction) {
    await Promise.all([
      FloorService.destroyNotInByUser(floors, userId, locationId, t),
      BlueprintService.destroyNotInByUser(floors.flatMap(f => f?.blueprints).filter(Boolean), userId, locationId, t),
    ]);

    const newFloors = await FloorService.bulkUpsert(floors, locationId, t);

    await BlueprintService.bulkUpsert(
      floors.flatMap(({ blueprints = [] }, i) =>
        blueprints.map(({ seats, ...blueprint }) => ({
          ...blueprint,
          floorId: newFloors[i].id,
        }))
      ),
      t
    );
  }

  static async findOneByUser(userId: number, locationId: number, transaction?: Transaction) {
    return Location.scope({ method: ['byUser', userId, locationId] }).findOne({
      order: [[Floor, 'id', 'asc']],
      include: [
        {
          model: Floor,
          include: [
            {
              model: Blueprint,
              include: [
                {
                  model: Seat,
                },
              ],
            },
          ],
        },
      ],
      transaction,
      rejectOnEmpty: true,
    });
  }

  static async findAllByUser(userId: number, transaction?: Transaction) {
    const userRole = await UserService.getUserRole(userId);
    const onlyAllowed = userRole.value !== UserRoleEnum.ACCOUNT_MANAGER;

    return Location.scope({ method: ['byUser', userId] }).findAll({
      order: [[Floor, 'id', 'asc']],
      include: [
        {
          model: Floor,
          include: [
            {
              model: Blueprint,
              include: onlyAllowed
                ? [
                    {
                      model: User,
                      attributes: [],
                      through: {
                        attributes: [],
                        where: { userId },
                      },
                      where: { id: userId, isWPMEnabled: true },
                    },
                  ]
                : [],
            },
          ],
        },
      ],
      transaction,
    });
  }

  static async findAllByAccountManager(
    userId: number,
    status?: LocationStatus,
    floorsRequired?: boolean,
    transaction?: Transaction
  ) {
    const locations = await Location.scope({ method: ['byUser', userId] }).findAll({
      order: [[Floor, 'id', 'asc']],
      where: status ? { status } : {},
      include: [
        {
          model: Floor,
          required: floorsRequired,
          include: [
            {
              model: Blueprint,
              required: floorsRequired,
              include: [
                {
                  model: User,
                  include: status
                    ? []
                    : [
                        {
                          model: UserRole,
                          where: { id: UserRoleEnum.ACCOUNT_MANAGER },
                        },
                      ],
                },
              ],
            },
          ],
        },
      ],
      transaction,
    });

    return locations.map(l => {
      const parsedLocation = l.toJSON();
      return { ...parsedLocation, ...getClientLocationNullPercentage(parsedLocation) };
    });
  }

  static async findOneByProvider(
    companyId: number, // TODO: Add companyId scope
    providerName: LocationProviderNames,
    providerId: string,
    options?: Omit<NonNullFindOptions<LocationAttributes>, 'where'>
  ) {
    return Location.findOne({
      where: { provider: { name: providerName, id: providerId } },
      ...options,
    });
  }

  static async findOrCreateByGoogleProvider(
    refreshToken: string,
    userId: number,
    companyId: number,
    currencyId: number,
    providerId: string,
    transaction?: Transaction
  ) {
    let location = await ClientLocationService.findOneByProvider(companyId, 'google', providerId, {
      rejectOnEmpty: false,
      transaction,
    });

    if (!location) {
      const locationPayload = await GoogleCalendarService.parseBuildingToClientLocation(
        refreshToken,
        companyId,
        currencyId,
        providerId
      );

      location = await ClientLocationService.setClientLocation(userId, locationPayload, companyId);
    }

    return location;
  }
}
