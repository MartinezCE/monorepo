import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { Transaction } from 'sequelize';
import db from '../db';
import ClientInvitation from '../db/models/ClientInvitation';
import Company from '../db/models/Company';
import User from '../db/models/User';
import UserService from './user';
import EmailService from './email';
import UserRoleService from './user-role';
import { UserRoleEnum } from '../common/enum/user';
import { ClientInvitationDTO } from '../dto/client-invitations';
import logger from '../helpers/logger';

export type JWTInvitationPayload = {
  invitationId: number;
  email: string;
  firstName?: string;
  lastName?: string;
  companyId: number;
};

const loggerInstance = logger('client-invitations-service');

export default class ClientInvitationsService {
  static async groupUserByRegistration(emails: ClientInvitationDTO['emails'], transaction?: Transaction) {
    const registeredUsers = await (UserService.findAllInByEmail(
      emails.map(({ email }) => email),
      {
        attributes: ['id', 'email'],
        include: {
          model: Company,
          attributes: ['id'],
        },
        transaction,
      }
    ) as Promise<(User & { companies: Partial<Company>[] })[]>);

    return emails.reduce(
      (acc, el) => {
        const user = registeredUsers.find(u => u.email === el.email);

        if (user) acc.usedEmails.push(el);
        else acc.freeEmails.push(el);

        return acc;
      },
      {
        freeEmails: [] as ClientInvitationDTO['emails'],
        usedEmails: [] as ClientInvitationDTO['emails'],
      }
    );
  }

  static async createInvitationToken(
    invitationId: number,
    email: string,
    firstName: string,
    lastName: string,
    companyId: number
  ) {
    return new Promise<string>((res, rej) =>
      jwt.sign({ invitationId, email, firstName, lastName, companyId }, process.env.JWT_SECRET, {}, (err, token) => {
        if (err) rej(err);
        res(token);
      })
    );
  }

  static async createClientInvitations(userId: number, company: Company, emails: ClientInvitationDTO['emails']) {
    return db.transaction(async t => {
      const { freeEmails, usedEmails } = await ClientInvitationsService.groupUserByRegistration(emails, t);

      if (usedEmails.length) {
        // TODO: Move to error codes and allow a custom body key to send the emails list
        throw createHttpError(
          400,
          `The following users are already registered: ${usedEmails.map(({ email }) => email).join(', ')}`
        );
      }

      const defaultRole = await UserRoleService.getOneByName(UserRoleEnum.MEMBER);
      const invitations = await ClientInvitation.bulkCreate(
        freeEmails.map(({ email, firstName, lastName }) => ({
          toEmail: email,
          firstName,
          lastName,
          userId,
          roleId: defaultRole.id,
          companyId: company.id,
        })),
        { transaction: t, ignoreDuplicates: true }
      );

      await Promise.all(
        invitations.map(async i => {
          const token = await ClientInvitationsService.createInvitationToken(
            i.id,
            i.toEmail,
            i.firstName,
            i.lastName,
            company.id
          );

          await EmailService.send(
            'client_invitation',
            {
              username: i.firstName,
              mktSiteBaseUrl: process.env.MKT_SITE_BASE_URL,
              companyName: company.name,
              registerBaseUrl: process.env.REGISTER_BASE_URL,
              token,
            },
            [i.toEmail]
          );
        })
      );

      return {
        invitations,
      };
    });
  }

  static async verifyInvitationToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET) as JWTInvitationPayload;
    } catch (e) {
      loggerInstance.error('Error verifying client-invitation token', e);
      throw e;
    }
  }

  static async getInvitationByIdByEmail(id: number, toEmail: string, paranoid?: boolean, transaction?: Transaction) {
    try {
      return await ClientInvitation.findOne({
        where: { id, toEmail },
        rejectOnEmpty: true,
        transaction,
        paranoid,
      });
    } catch (e) {
      loggerInstance.error('Error getting client-invitation by id and email', e);
      throw e;
    }
  }

  static async removeClientInvitation(id: number, companyId: number, transaction?: Transaction) {
    try {
      await ClientInvitation.destroy({
        where: { id, companyId },
        transaction,
      });
    } catch (e) {
      loggerInstance.error('Error removing the invitation', e);
      throw e;
    }
  }
}
