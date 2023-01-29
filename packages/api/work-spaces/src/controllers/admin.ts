import { NextFunction, Request, Response } from 'express';
import logger from '../helpers/logger';
import CompanyService from '../services/company';
import LocationService from '../services/location';

const loggerInstance = logger('admin-controller');
export default class AdminController {
  static async assignLocationsToUser(
    req: Request<unknown, unknown, { locationIds: number[]; userId: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { locationIds, userId } = req.body;
    try {
      const company = await CompanyService.findCompanyByUserId(userId, undefined, {
        rejectOnEmpty: true,
      });
      await LocationService.updateCompany(locationIds, company.id);

      loggerInstance.info(`Locations assigned to user ${userId} with company ${company.id} successfully`);

      return res.sendStatus(204);
    } catch (error) {
      loggerInstance.error(`There was an error assigning locations to user ${userId}`, error);
      return next(error);
    }
  }
}
