import { NextFunction, Request, Response } from 'express';
import db from '../db';
import logger from '../helpers/logger';
import CompanyService from '../services/company';
import CurrencyService from '../services/currency';
import GoogleCalendarService from '../services/google-calendar';
import UserService from '../services/user';

const loggerInstance = logger('google-calendar-controller');

export default class GoogleCalendarController {
  static async getUserResources(req: Request, res: Response, next: NextFunction) {
    const { id: userId } = req.user;

    try {
      const user = await UserService.getUserById(userId);
      const company = await CompanyService.findCompanyByUserId(user.id);
      const { refreshToken } = CompanyService.extractToken(company.adminProviders, 'google');
      const resources = await GoogleCalendarService.getResources(refreshToken);

      return res.json(resources);
    } catch (e) {
      loggerInstance.error(`There was an error while fetching ${userId} google resources`);
      return next(e);
    }
  }

  static async migrateResources(
    req: Request<unknown, unknown, { resourceIds: string[] }>,
    res: Response,
    next: NextFunction
  ) {
    const { id: userId } = req.user;
    const { resourceIds } = req.body;

    try {
      return await db.transaction(async transaction => {
        const user = await UserService.getUserById(userId, transaction);
        const company = await CompanyService.findCompanyByUserId(user.id, undefined, {
          rejectOnEmpty: true,
          transaction,
        });
        const { refreshToken } = CompanyService.extractToken(company.adminProviders, 'google');
        const currency = await CurrencyService.getByState(company.stateId);
        const resources = await Promise.all(resourceIds.map(r => GoogleCalendarService.getResource(refreshToken, r)));

        const seats = await GoogleCalendarService.migrateFromResources(
          resources,
          refreshToken,
          user.id,
          company.id,
          currency.id,
          transaction
        );

        return res.json(seats);
      });
    } catch (e) {
      loggerInstance.error(`There was an error migrating Google resourceIds on userId: ${userId}`);
      return next(e);
    }
  }
}
