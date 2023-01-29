/* eslint-disable import/no-cycle */
import { NonNullFindOptions, Op, QueryTypes, Transaction } from 'sequelize';
import createHttpError from 'http-errors';
import { last, merge } from 'lodash';
import User, { AuthProvidersName } from '../db/models/User';
import {
  COMPANY_ALREADY_EXISTS,
  COMPANY_ALREADY_HAS_AMENITY,
  COMPANY_NOT_FOUND,
  PROVIDER_ID_NOT_FOUND,
} from '../config/errorCodes';
import State from '../db/models/State';
import Company, { AdminAuthProviders, CompanyAttributes, CompanyInput } from '../db/models/Company';
import db from '../db';
import Country from '../db/models/Country';
import TimezoneService from './timezone';
import Amenity from '../db/models/Amenity';
import CompanyAmenity from '../db/models/CompanyAmenity';
import UserAmenity from '../db/models/UserAmenity';
import SeatAmenity from '../db/models/SeatAmenity';
import UserService from './user';
import SeatService from './seat';
import logger from '../helpers/logger';

const loggerInstance = logger('company-service');

export default class CompanyService {
  static async findCompanyByUserId(
    userId: number,
    companyId?: number,
    options?: Omit<NonNullFindOptions<CompanyAttributes>, 'where'>
  ) {
    try {
      const instance = Company.scope([{ method: ['byUser', userId] }, 'withFeePercentage']);
      if (companyId) {
        return await instance.findByPk(companyId, options);
      }
      return await instance.findOne(options);
    } catch (e) {
      loggerInstance.error('Company not found for user', e);
      throw createHttpError(404, COMPANY_NOT_FOUND);
    }
  }

  static async createCompanyByUser(user: User, company: CompanyInput, transaction?: Transaction) {
    const state = await State.findByPk(company.stateId, { include: [Country], transaction, rejectOnEmpty: true });
    const tz = await TimezoneService.getTimezone(state.name, state.country.name);

    try {
      await user.createCompany(
        { name: company.name, companyTypeId: company.companyTypeId, stateId: state.id, tz },
        { transaction }
      );
    } catch (e) {
      loggerInstance.error('There was an error creating the company', e);
      throw createHttpError(409, COMPANY_ALREADY_EXISTS);
    }
  }

  static async findCompanyById(companyId: number, transaction?: Transaction) {
    try {
      return await Company.findByPk(companyId, { transaction });
    } catch (e) {
      loggerInstance.error('Company not found', e);
      throw createHttpError(404, COMPANY_NOT_FOUND);
    }
  }

  static async setCompany(companyId: number, payload: CompanyInput) {
    return Company.update(payload, { where: { id: companyId } });
  }

  static async setCompanyAvatar(companyId: number, avatarUrl: string, avatarKey: string) {
    return Company.update({ avatarUrl, avatarKey }, { where: { id: companyId } });
  }

  static async getCompanyCollaborators(userId: number, companyId: number, limit: number = 10000, offset: number = 0) {
    try {
      const results = await db.query<{
        firstName: string;
        lastName: string;
        email: string;
        roleId: number;
        value: string;
        isRegistered: number;
        isWPMEnabled: number;
      }>(
        `
        SELECT users.id, users.first_name, users.last_name, users.email, users.user_role_id as role_id, user_roles.value, plan_users.plan_id as plan_id, plans.name as plan_name, true as is_registered, is_wpm_enabled
          FROM users
          INNER JOIN user_roles ON user_roles.id = users.user_role_id
          INNER JOIN companies_users ON companies_users.user_id = users.id
          INNER JOIN companies ON companies.id = companies_users.company_id
          LEFT JOIN plan_users ON users.id = plan_users.user_id 
          LEFT JOIN  plans ON plan_users.plan_id = plans.id 
          WHERE companies.id = ${companyId}
          AND plans.deleted_at IS NULL
          AND EXISTS (SELECT 1 FROM companies_users WHERE companies_users.user_id = ${userId} AND companies_users.company_id = ${companyId}) AND companies_users.deleted_at IS NULL
        UNION
        SELECT client_invitations.id, first_name, last_name, client_invitations.to_email as email, client_invitations.role_id, user_roles.value, null as plan_id, null as plan_name, false as is_registered, false as is_wpm_enabled
          FROM \`client-invitations\` as client_invitations
          LEFT JOIN user_roles ON user_roles.id = client_invitations.role_id
          WHERE client_invitations.company_id = ${companyId}
          AND client_invitations.deleted_at IS NULL
        LIMIT ${limit} OFFSET ${offset}
        `,
        {
          fieldMap: {
            first_name: 'firstName',
            last_name: 'lastName',
            email: 'email',
            role_id: 'userRoleId',
            value: 'userRole',
            plan_id: 'userPlan',
            plan_name: 'planName',
            is_registered: 'isRegistered',
            is_wpm_enabled: 'isWPMEnabled',
          },
          type: QueryTypes.SELECT,
        }
      );

      return results.map(res => ({ ...res, isRegistered: !!res.isRegistered, isWPMEnabled: !!res.isWPMEnabled }));
    } catch (e) {
      loggerInstance.error('Error getting the company collaborators', e);
      throw createHttpError(500, 'Error getting the company collaborators');
    }
  }

  static async getCompanyByBlueprintId(blueprintId: number, transaction?: Transaction) {
    try {
      return await Company.scope([{ method: ['byBlueprint', blueprintId] }]).findOne({ transaction });
    } catch (e) {
      loggerInstance.error('Company not found', e);
      throw createHttpError(404, COMPANY_NOT_FOUND);
    }
  }

  static async removeAmenity(companyId: number, amenityId: number) {
    return db.transaction(async transaction => {
      const amenity = await Amenity.findOne({ where: { id: amenityId }, rejectOnEmpty: true });

      const [users, seats] = await Promise.all([
        UserService.getAllByCompanyAndAmenity(companyId, amenityId, transaction),
        SeatService.getAllByCompanyAndAmenity(companyId, amenityId, transaction),
      ]);

      await Promise.all([
        CompanyService.removeCompanyAmenity(companyId, amenityId, transaction),
        amenity.removeUsers(users, { transaction }),
        amenity.removeSeats(seats, { transaction }),
      ]);
    });
  }

  static async replaceAmenity(companyId: number, amenityId: number, newAmenityId: number) {
    return db.transaction(async transaction => {
      const existsNewCompanyAmenity = await CompanyAmenity.findOne({ where: { companyId, amenityId: newAmenityId } });

      if (existsNewCompanyAmenity) throw createHttpError(400, COMPANY_ALREADY_HAS_AMENITY);

      const [users, seats] = await Promise.all([
        UserService.getAllByCompanyAndAmenity(companyId, amenityId, transaction),
        SeatService.getAllByCompanyAndAmenity(companyId, amenityId, transaction),
      ]);

      await Promise.all([
        CompanyAmenity.update({ amenityId: newAmenityId }, { where: { companyId, amenityId }, transaction }),
        UserAmenity.update(
          { amenityId: newAmenityId },
          { where: { amenityId, userId: { [Op.in]: users.map(u => u.id) } }, transaction }
        ),
        SeatAmenity.update(
          { amenityId: newAmenityId },
          { where: { amenityId, seatId: { [Op.in]: seats.map(s => s.id) } }, transaction }
        ),
      ]);
    });
  }

  static async findAllCompanyAmenitiesByIds(companyId: number, ids: number[]) {
    return CompanyAmenity.findAll({
      where: {
        companyId,
        amenityId: { [Op.in]: ids },
      },
    });
  }

  static async addCompanyAmenities(companyId: number, amenitiesId: number[], transaction?: Transaction) {
    const companyAmenities = await CompanyAmenity.count({ where: { companyId, amenityId: { [Op.in]: amenitiesId } } });

    if (companyAmenities) throw createHttpError(400, COMPANY_ALREADY_HAS_AMENITY);

    return CompanyAmenity.bulkCreate(
      amenitiesId.map(amenityId => ({ companyId, amenityId })),
      { transaction }
    );
  }

  static async removeCompanyAmenity(companyId: number, amenityId: number, transaction?: Transaction) {
    return CompanyAmenity.destroy({
      where: { companyId, amenityId },
      transaction,
    });
  }

  static async addAdminAuthProvider(
    companyId: number,
    currentProviders: AdminAuthProviders,
    provider: AuthProvidersName,
    providerId: string,
    refreshToken: string
  ) {
    return Company.update(
      {
        adminProviders: merge<AdminAuthProviders, AdminAuthProviders>(currentProviders || {}, {
          [provider]: [{ profileId: providerId, refreshToken }],
        }),
      },
      { where: { id: companyId } }
    );
  }

  static extractToken(adminProviders: AdminAuthProviders, provider: AuthProvidersName) {
    const token = last(adminProviders?.[provider] || []);

    if (!token) throw createHttpError(400, PROVIDER_ID_NOT_FOUND);
    return token;
  }

  static async findCompanyBySeatId(seatId: number) {
    return Company.scope({ method: ['bySeat', seatId] }).findOne();
  }
}
