import { NextFunction, Request, Response } from 'express';
import { ClientInvitationDTO } from '../dto/client-invitations';
import logger from '../helpers/logger';
import ClientInvitationsService from '../services/client-invitation';
import CompanyService from '../services/company';

const loggerInstance = logger('client-invitations-controller');

export default class ClientInvitationsController {
  static async createClientInvitations(
    req: Request<unknown, unknown, ClientInvitationDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user;

      const company = await CompanyService.findCompanyByUserId(id, req.body.companyId, { rejectOnEmpty: true });
      const response = await ClientInvitationsService.createClientInvitations(id, company, req.body.emails);

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error creating the invitations', error);
      next(error);
    }
  }

  static async removeClientInvitation(
    req: Request<{ invitationId: number }, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user;
      const { invitationId } = req.params;

      const company = await CompanyService.findCompanyByUserId(id, undefined, { rejectOnEmpty: true });
      await ClientInvitationsService.removeClientInvitation(invitationId, company.id);

      res.send();
    } catch (error) {
      loggerInstance.error('There was an removing the invitations', error);
      next(error);
    }
  }
}
