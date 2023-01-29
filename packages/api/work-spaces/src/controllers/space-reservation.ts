import { NextFunction, Request, Response } from 'express';
import SpaceReservationTypeService from '../services/space-reservation-type';
import SpaceTypeService from '../services/space-type';
import CompanyService from '../services/company';
import UserService from '../services/user';
import SpaceService from '../services/space';
import SpaceReservationService from '../services/space-reservation';
import { SpaceReservationDTO } from '../dto/space-reservation';
import HourlySpaceReservationService from '../services/hourly-space-reservation';
import logger from '../helpers/logger';

const loggerInstance = logger('space-reservation-controller');

export default class SpaceReservationController {
  static async getSpaceTypesByReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const { typeId } = req.params;
      const response = await SpaceTypeService.getSpaceTypesByReservation(typeId);
      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error getting the space types', error);
      next(error);
    }
  }

  static async getReservationTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await SpaceReservationTypeService.getReservationTypes();
      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error getting the space reservation types', error);
      next(error);
    }
  }

  static async createReservation(
    req: Request<unknown, unknown, SpaceReservationDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user;
      const { spaceId, monthly, hourly } = req.body;

      const [user, company, space] = await Promise.all([
        UserService.getUserById(id),
        CompanyService.findCompanyByUserId(id),
        SpaceService.getSpaceWithUser(spaceId),
      ]);

      if (monthly) {
        await SpaceReservationService.handleMonthlyReservation(user, company, space, monthly, req.timezone, company.tz);
      }

      if (hourly) {
        await SpaceReservationService.handleHourlyReservation(user, company, space, hourly, req.timezone, company.tz);
      }

      return res.send();
    } catch (error) {
      loggerInstance.error('There was an error setting the reservation', error);
      return next(error);
    }
  }

  static async getSpaceReservations(
    req: Request<unknown, unknown, unknown, { limit?: number; offset?: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user;
      const { limit, offset } = req.query;
      const company = await CompanyService.findCompanyByUserId(id, undefined, { rejectOnEmpty: true });
      const reservations = await HourlySpaceReservationService.getReservationsByCompany(company.id, limit, offset);

      res.send(reservations);
    } catch (error) {
      loggerInstance.error('There was an error getting space reservations', error);
      next(error);
    }
  }
}
