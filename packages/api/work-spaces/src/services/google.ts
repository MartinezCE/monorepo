import { Profile } from 'passport';
import axios from 'axios';
import createHttpError from 'http-errors';
import database from '../db';
import { GooglePeoplePhoneNumberResponse } from '../interfaces';
import UserService from './user';
import User from '../db/models/User';
import { UserRoleEnum, UserTypeEnum } from '../common/enum/user';
import { GOOGLE_AUTH_USER_ERROR, INVALID_USER } from '../config/errorCodes';
import { CompanyDTO } from '../dto/company';
import UserTypeService from './user-type';
import CompanyService from './company';
import UserType from '../db/models/UserType';
import UserRoleService from './user-role';
import logger from '../helpers/logger';

const loggerInstance = logger('google-auth-service');

export default class GoogleAuthService {
  static async getPhoneNumber(tokenId: string, accessToken: string) {
    // TODO: Create axios instance for google api
    const { data } = await axios.get<GooglePeoplePhoneNumberResponse>(
      `https://people.googleapis.com/v1/people/${tokenId}?personFields=phoneNumbers`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return data.phoneNumbers?.[0]?.canonicalForm;
  }

  static async auth(
    payload: { company: CompanyDTO | null; userType: UserTypeEnum },
    accessToken: string,
    refreshToken: string,
    profile: Profile
  ) {
    const { company, userType } = payload || {};
    const phoneNumber = await GoogleAuthService.getPhoneNumber(profile.id, accessToken);
    const email = profile.emails?.[0]?.value;

    let user: User;
    let isNewUser: boolean;

    await database.transaction(async t => {
      let partnerType: UserType;
      let userRoleId: number;

      if (userType) {
        partnerType = await UserTypeService.getOneByName(userType);
      }

      if (userType === UserTypeEnum.CLIENT) {
        const accountManagerRole = await UserRoleService.getOneByName(UserRoleEnum.ACCOUNT_MANAGER);

        userRoleId = accountManagerRole.id;
      }

      try {
        let existUser: User | null;
        existUser = await UserService.findByProviderId('google', profile.id);
        if (!existUser) {
          existUser = await UserService.getUserByEmail(email);
        }
        [user, isNewUser] = await UserService.upsertUser(
          {
            id: existUser?.id,
            email,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            phoneNumber,
            userTypeId: partnerType?.id,
            userRoleId,
            authProviders: {
              google: { profileId: profile.id, refreshToken },
            },
          },
          { transaction: t, returning: true }
        );
      } catch (e) {
        loggerInstance.error('There was an error creating the partner with Google', e);
        throw createHttpError(409, GOOGLE_AUTH_USER_ERROR);
      }

      if (isNewUser) {
        if (!company) throw createHttpError(404, INVALID_USER);

        await CompanyService.createCompanyByUser(user, company, t);
      }

      return user;
    });

    return UserService.getUserByEmail(email);
  }

  static async getUserData(accessToken: string) {
    try {
      const useInfo = await axios.get('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return useInfo.data.id;
    } catch (err) {
      throw createHttpError(404, INVALID_USER);
    }
  }
}
