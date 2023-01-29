import createHttpError from 'http-errors';
import { Transaction } from 'sequelize/dist';
import { UserRoleEnum, UserTypeEnum } from '../common/enum/user';
import { COMPANY_ALREADY_EXISTS, INVITATION_EXPIRED } from '../config/errorCodes';
import database from '../db';
import State from '../db/models/State';
import User, { UserStatus } from '../db/models/User';
import UserType from '../db/models/UserType';
import { SignUpDTO } from '../dto/auth';
import ClientInvitationsService from './client-invitation';
import CompanyService from './company';
import UserService from './user';
import UserRoleService from './user-role';
import SlackService from './slack';
import Company from '../db/models/Company';
import FeePercentage from '../db/models/FeePercentage';
import TimezoneService from './timezone';
import Country from '../db/models/Country';
import logger from '../helpers/logger';

type SignUpConfig = {
  skipCompany?: boolean;
  userType: UserTypeEnum;
};

const DEFAULT_FEE_PERCENTAGE = 0.1;
const loggerInstance = logger('auth-service');

export default class AuthService {
  static async signUp(payload: SignUpDTO, { userType, skipCompany }: SignUpConfig, transaction?: Transaction) {
    const { company, ...user } = payload;
    return database.transaction({ transaction }, async t => {
      loggerInstance.info(`Searching for user type userTypeId: ${userType}`);
      const { id: userTypeId } = await UserType.findOne({
        where: {
          value: userType,
        },
        rejectOnEmpty: true,
      });

      let newUser: User;
      let newCompany: Company;

      try {
        loggerInstance.info(`Checking if user by email: ${payload?.email} already exists`);
        await UserService.getUserByEmail(payload?.email, true);
        loggerInstance.info(`Creating user instance for user email: ${payload?.email} and userTypeId: ${userTypeId}`);
        newUser = await UserService.createUser({ ...user, userTypeId }, t);
        loggerInstance.info(`User with userId ${newUser.id} and email: ${payload?.email} has been created`);
      } catch (e) {
        loggerInstance.error(`There was an error creating the user of type ${userType}`, e);
        throw e;
      }

      if (!skipCompany) {
        loggerInstance.warn(`Checking the company for signup with userId: ${newUser.id}`);
        loggerInstance.info(`Looking for the state and country by stateId: ${company.stateId}`);
        const state = await State.findByPk(company.stateId, {
          include: [Country],
          transaction: t,
          rejectOnEmpty: true,
        });
        loggerInstance.info(`Looking the timezone for the state: ${state.name} and country: ${state.country.name}`);
        const tz = await TimezoneService.getTimezone(state.name, state.country.name);

        try {
          loggerInstance.info(`Attepting to create the company for userId: ${newUser.id}`);
          newCompany = await newUser.createCompany(
            {
              name: company.name,
              tz,
              companyTypeId: company.companyTypeId,
              stateId: state.id,
              websiteUrl: company.websiteUrl,
              peopleAmount: company.peopleAmount,
            },
            { transaction: t }
          );
        } catch (e) {
          loggerInstance.error(`There was an error creating the company. The company already exists`, e);
          throw createHttpError(409, COMPANY_ALREADY_EXISTS);
        }
        loggerInstance.info(`Company for userId: ${newUser.id} has been created with id: ${newCompany.id}`);
      }
      return { newUser, newCompany };
    });
  }

  static async signUpInvitedClient(payload: SignUpDTO) {
    return database.transaction(async t => {
      const { token, ...data } = payload;
      const { invitationId, email, companyId } = await ClientInvitationsService.verifyInvitationToken(token);
      loggerInstance.info(`Attepting to signup with client invitation for email: ${email}`);
      loggerInstance.info(`Looking for company with companyId: ${companyId}`);
      const company = await CompanyService.findCompanyById(companyId);

      loggerInstance.info(`Looking for invitation with invitationId: ${invitationId}`);
      const invitation = await ClientInvitationsService.getInvitationByIdByEmail(invitationId, email, false, t);

      if (invitation.deletedAt) {
        loggerInstance.error(`invitation with invitationId: ${invitationId} has been expired`);
        throw createHttpError(403, INVITATION_EXPIRED);
      }

      const { newUser } = await AuthService.signUp(
        {
          ...data,
          status: UserStatus.APPROVED,
          email,
          userRoleId: invitation.roleId,
          company,
        },
        {
          userType: UserTypeEnum.CLIENT,
          skipCompany: true,
        }
      );
      loggerInstance.warn(
        `Attepting to create new user by with email ${email} and destroy invitation with invitationId: ${invitationId}`
      );
      await Promise.all([invitation.destroy({ transaction: t }), newUser.addCompany([company.id], { transaction: t })]);
      SlackService.sendNewUserMsg(newUser, company);
      return newUser;
    });
  }

  static async signUpPartner(payload: SignUpDTO) {
    loggerInstance.info(`Attepting to signup as partner for email: ${payload.email}`);
    return database.transaction(async t => {
      const { newUser, newCompany } = await AuthService.signUp(payload, { userType: UserTypeEnum.PARTNER }, t);
      loggerInstance.info(`New user created with userId: ${newUser.id} for email: ${payload.email}`);
      loggerInstance.info(
        `Creating fee percentage for userId: ${newUser.id} and companyId: ${newCompany.id} with default value of: ${DEFAULT_FEE_PERCENTAGE}`
      );
      await FeePercentage.create({ companyId: newCompany.id, value: DEFAULT_FEE_PERCENTAGE }, { transaction: t });
      await SlackService.sendNewPartnerMsg(newUser, newCompany);

      return newUser;
    });
  }

  static async signUpClient(payload: SignUpDTO) {
    const { token } = payload;
    payload.isWPMEnabled = false;
    payload.status = UserStatus.PENDING;
    loggerInstance.info(`Attempting to sign up client with email: ${payload.email}`);
    if (token) {
      loggerInstance.warn(`Client with email: ${payload.email} was invited to signup with client invitation`);
      return AuthService.signUpInvitedClient(payload);
    }
    loggerInstance.info(`Attempting to get the account manager role by name: ${UserRoleEnum.ACCOUNT_MANAGER}`);
    const accountManagerRole = await UserRoleService.getOneByName(UserRoleEnum.ACCOUNT_MANAGER);
    payload.userRoleId = accountManagerRole.id;

    const { newUser, newCompany } = await AuthService.signUp(payload, { userType: UserTypeEnum.CLIENT });
    loggerInstance.info(
      `Created new user with userId: ${newUser.id}, companyId: ${newCompany.id} and userType: ${UserTypeEnum.CLIENT}`
    );

    SlackService.sendNewClientMsg(newUser, newCompany);

    return newUser;
  }
}
