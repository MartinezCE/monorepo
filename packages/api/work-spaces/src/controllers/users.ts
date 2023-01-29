import { NextFunction, Request, Response } from 'express';
import logger from '../helpers/logger';
import CompanyService from '../services/company';
import HourlySpaceReservationService from '../services/hourly-space-reservation';
import UserService from '../services/user';
import UserAmenityService from '../services/user-amenity';
import UsersService from '../services/users';

const loggerInstance = logger('users-controller');
export default class UsersController {
  static async getReservations(req: Request<{ userId: number }>, res: Response, next: NextFunction) {
    try {
      const reservations = await HourlySpaceReservationService.getReservationsByUser(req.params.userId);

      res.send(reservations);
    } catch (error) {
      loggerInstance.error('There was an error getting the user reservations', error);

      next(error);
    }
  }

  static async setAmenities(
    req: Request<{ userId: number }, unknown, { amenities: number[] }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { amenities: amenitiesId } = req.body;
      const { userId } = req.params;

      const company = await CompanyService.findCompanyByUserId(req.user.id, undefined, { rejectOnEmpty: true });
      await UsersService.setAmenities(userId, company.id, amenitiesId);

      res.send();
    } catch (error) {
      loggerInstance.error('There was an error setting the user amenities', error);
      next(error);
    }
  }

  static async removeWmpPermissions(req, res, next) {
    try {
      const { userId } = req.params;
      const { id } = req.user;
      const company = await CompanyService.findCompanyByUserId(id, null, { rejectOnEmpty: true });

      Promise.all([
        UserService.switchUsersWPM(userId, company.id, [userId], false),
        UserService.setCompanyAllUsersBlueprints(req.user.id, company.id, [], {
          where: { id: userId },
        }),
        UserAmenityService.deleteByUser(userId),
      ]);
      res.send();
    } catch (error) {
      loggerInstance.error('There was an error removing all WPM permissions from user', error);
      next(error);
    }
  }

  static async aprovedAccessUser(req, res, next) {
    try {
      const { userId } = req.params;
      UserService.enabledUser(userId);
      res.send();
    } catch (error) {
      loggerInstance.error('There was an error approving the user', error);
      next(error);
    }
  }
}
