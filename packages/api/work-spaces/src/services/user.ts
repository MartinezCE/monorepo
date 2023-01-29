/* eslint-disable import/no-cycle */
import createHttpError from 'http-errors';
import { isUndefined } from 'lodash';
import { Transaction, UpsertOptions, Op, FindOptions, NonNullFindOptions } from 'sequelize';
import { EMAIL_ALREADY_EXISTS } from '../config/errorCodes';
import db from '../db';
import Amenity from '../db/models/Amenity';
import Blueprint from '../db/models/Blueprint';
import Company from '../db/models/Company';
import Plan from '../db/models/Plan';
import User, { AuthProvidersName, UserAttributes, UserInput, UserStatus } from '../db/models/User';
import UserAmenity from '../db/models/UserAmenity';
import UserRole from '../db/models/UserRole';
import { UserAmenityDTO } from '../dto/amenities';
import { UserBlueprintDTO } from '../dto/blueprint';
import logger from '../helpers/logger';
import AmenityService from './amenity';
import BlueprintService from './blueprint';
import CompanyService from './company';
import PlanService from './plan';

type GetUsersByCompanyFilters = {
  havePlans?: boolean;
};

const loggerInstance = logger('user-service');

export default class UserService {
  static async getUserById(
    id: number,
    transaction?: Transaction,
    opts?: Omit<NonNullFindOptions<UserAttributes>, 'where' | 'rejectOnEmpty'>
  ) {
    return User.scope(['mainContext']).findByPk(id, { rejectOnEmpty: true, transaction, ...opts });
  }

  static async getUserByEmail(email: string, validate?: boolean) {
    const user = await User.scope(['mainContext']).findOne({ where: { email } });

    if (validate && user) {
      throw createHttpError(409, EMAIL_ALREADY_EXISTS);
    }

    return user;
  }

  static async createUser(payload: UserInput, transaction?: Transaction) {
    return User.create(payload, {
      transaction,
    });
  }

  static async setUser(userId: number, payload: UserInput) {
    return User.update(payload, { where: { id: userId }, individualHooks: true });
  }

  static async enabledUser(userId: number) {
    return User.update({ status: UserStatus.APPROVED }, { where: { id: userId } });
  }

  static async setUserAvatar(userId: number, avatarUrl: string, avatarKey: string) {
    return User.update({ avatarUrl, avatarKey }, { where: { id: userId } });
  }

  static async setUserRole(userId: number, userRoleId: UserInput['userRoleId']) {
    return User.update({ userRoleId }, { where: { id: userId } });
  }

  static async setUserPlan(userId: number, userPlanId: number) {
    const user = await UserService.getUserById(userId);
    const plans = await user.getPlans();
    await Promise.all(
      plans.map(async p => {
        await PlanService.deletePlanUser(Number(p.id), Number(userId));
      })
    );
    const plan = await Plan.findOne({ where: { id: userPlanId } });
    await plan.addUser(userId);
    return plan;
  }

  static async getUserByAuth(email: string, password: string) {
    const user = await UserService.getUserByEmail(email);

    const isValid = await user?.validatePassword(password);

    return isValid ? user : undefined;
  }

  static async upsertUser(payload: UserInput, options?: UpsertOptions<UserAttributes>) {
    return User.upsert(payload, options);
  }

  static async findByProviderId(provider: AuthProvidersName, profileId: string, transaction?: Transaction) {
    return User.scope(['mainContext']).findOne({
      where: {
        authProviders: {
          [provider]: { profileId },
        },
      },
      transaction,
    });
  }

  static async findAllInByEmail(emails: string[], { where, ...options }: FindOptions<UserAttributes> = {}) {
    return User.findAll({
      where: {
        email: { [Op.in]: emails },
      },
      ...options,
    });
  }

  static async getUserByCompany(companyId: number, userId: number, options?: NonNullFindOptions<UserAttributes>) {
    try {
      return await User.scope([{ method: ['byCompany', companyId] }]).findOne({
        where: { id: userId },
        ...options,
      });
    } catch (e) {
      loggerInstance.error('Error getting the company user', e);
      throw e;
    }
  }

  static async getUsersByCompany(companyId: number, options?: FindOptions<User>, filters?: GetUsersByCompanyFilters) {
    const { havePlans } = filters || {};

    try {
      return await User.scope([
        { method: ['byCompany', companyId] },
        ...(filters
          ? [...(!isUndefined(havePlans) ? [{ method: ['filterByPlans', havePlans] as [string, boolean] }] : [])]
          : []),
      ]).findAll(options);
    } catch (e) {
      loggerInstance.error('Error getting the company user', e);
      throw e;
    }
  }

  static async getWPMUsers(userId: number, companyId: number, isWPMEnabled: boolean) {
    try {
      return await db.transaction(async transaction => {
        const company = await CompanyService.findCompanyByUserId(userId, companyId, {
          rejectOnEmpty: true,
          transaction,
        });

        const users = await UserService.getUsersByCompany(company.id, {
          include: [
            UserRole,
            {
              model: Blueprint,
              include: [Amenity],
            },
          ],
          attributes: ['id', 'firstName', 'lastName', 'email', 'isWPMEnabled'],
          transaction,
        });

        return users.filter(u => {
          if (isWPMEnabled) return u.isWPMEnabled || u.blueprints.length > 0;
          return !u.isWPMEnabled && !u.blueprints.length;
        });
      });
    } catch (e) {
      loggerInstance.error('Error getting the filtered company users', e);
      throw e;
    }
  }

  static async switchUsersWPM(userId: number, companyId: number, users: number[], isWPMEnabled: boolean) {
    try {
      return await db.transaction(async t => {
        // TODO: remove company search from here, pass it by params

        const company = await CompanyService.findCompanyByUserId(userId, companyId, {
          rejectOnEmpty: true,
          transaction: t,
        });

        const userIds = await User.findAll({
          where: {
            id: {
              [Op.in]: users,
            },
          },
          include: [
            {
              model: Company,
              attributes: [],
              through: {
                where: { companyId: company.id },
                attributes: [],
              },
            },
          ],
          attributes: ['id'],
          transaction: t,
        });

        return User.update(
          { isWPMEnabled },
          {
            where: {
              id: {
                [Op.in]: userIds.map(u => u.id),
              },
            },
            transaction: t,
          }
        );
      });
    } catch (e) {
      loggerInstance.error('Error enabling the user WPM', e);
      throw e;
    }
  }

  static async setCompanyUsersBlueprints(
    userId: number,
    companyId: number,
    users: User[],
    blueprintsPayload: UserBlueprintDTO['blueprints']
  ) {
    try {
      return await db.transaction(async transaction => {
        const company = await CompanyService.findCompanyByUserId(userId, companyId, {
          rejectOnEmpty: true,
          transaction,
        });

        const blueprints = await BlueprintService.getAllByCompany(company.id, null, {
          where: {
            id: { [Op.in]: blueprintsPayload.map(b => b.id) },
          },
          transaction,
        });

        // await Promise.all(
        //   blueprints.map(b => {
        //     const blueprint = blueprintsPayload.find(bp => bp.id === b.id);
        //     return UserAmenity.findAll({
        //       where: { id: { [Op.in]: blueprint.amenityIds } },
        //       transaction,
        //     });
        //     // return b.hasAmenities(blueprint.amenityIds, { transaction });
        //   })
        // );

        await Promise.all(
          users.map(async u => {
            const payload = blueprintsPayload.flatMap(bp =>
              bp.amenityIds.map(amenityId => ({ userId: u.id, amenityId, blueprintId: bp.id }))
            );
            // const payload = blueprintsPayload.flatMap(bp => bp.amenityIds);

            await UserAmenity.destroy({ where: { userId: u.id }, force: true, transaction });
            await u.setBlueprints(blueprints, { transaction });
            await UserAmenity.bulkCreate(payload, { transaction });
          })
        );
      });
    } catch (e) {
      loggerInstance.error('Error setting the company users blueprints', e);
      throw e;
    }
  }

  static async setCompanyUsersAmenities(
    companyId: number,
    users: User[],
    amenitiesPayload: UserAmenityDTO['amenityIds']
  ) {
    try {
      return await db.transaction(async transaction => {
        const amenities = await AmenityService.findAllFromSeatsOfCompany(companyId, undefined, {
          where: { id: { [Op.in]: amenitiesPayload } },
          transaction,
        });

        const parsedAmenities = AmenityService.getAmenitiesWithBlueprints(amenities);

        await Promise.all(
          users.map(async u => {
            const payload = parsedAmenities.reduce((acc, amenity) => {
              acc.push(...amenity.blueprints.map(b => ({ userId: u.id, amenityId: amenity.id, blueprintId: b.id })));
              return acc;
            }, [] as { userId: number; amenityId: number; blueprintId: number }[]);

            await UserAmenity.destroy({ where: { userId: u.id }, force: true, transaction });
            await UserAmenity.bulkCreate(payload, { transaction });
          })
        );
      });
    } catch (e) {
      loggerInstance.error('Error setting the company users amenities', e);
      throw e;
    }
  }

  static async setCompanyAllUsersBlueprints(
    userId: number,
    companyId: number,
    blueprints: UserBlueprintDTO['blueprints'],
    options?: FindOptions<User>
  ) {
    const users = await UserService.getUsersByCompany(companyId, options);

    return UserService.setCompanyUsersBlueprints(userId, companyId, users, blueprints);
  }

  static async setCompanyTeamBlueprints(
    userId: number,
    companyId: number,
    teamId: number,
    blueprints: UserBlueprintDTO['blueprints']
  ) {
    const users = await UserService.getUsersByCompany(companyId, {
      // include: [{
      //   model: Team,
      //   where: {}
      // }]
    });

    return UserService.setCompanyUsersBlueprints(userId, companyId, users, blueprints);
  }

  static async getUserRole(userId: number) {
    const user = await User.findByPk(userId, { include: [UserRole], rejectOnEmpty: true });
    return user.userRole;
  }

  static async getUsersByPlan(planId: number, companyId: number) {
    return User.scope([{ method: ['byCompany', companyId] }, { method: ['byPlan', planId] }]).findAll({
      include: [UserRole],
      attributes: { exclude: ['password'] },
    });
  }

  static async removeUserFromCompany(userId: number, companyId: number) {
    const user = await UserService.getUserById(userId);
    return user.removeCompany(companyId);
  }

  static async getAllByCompanyAndAmenity(companyId: number, amenityId: number, transaction?: Transaction) {
    return User.scope([{ method: ['byCompany', companyId] }, { method: ['byAmenity', amenityId] }]).findAll({
      transaction,
    });
  }

  static async availableCompany(userId: string) {
    return User.update({ status: UserStatus.APPROVED }, { where: { id: userId } });
  }

  static async availableWPM(userId: string) {
    return User.update({ isWPMEnabled: true }, { where: { id: userId } });
  }
}
