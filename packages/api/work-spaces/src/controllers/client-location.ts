import { getClientLocationNullPercentage } from '@wimet/api-shared';
import { NextFunction, Request, Response } from 'express';
import { FloorInput } from '../db/models/Floor';
import { LocationStatus } from '../db/models/Location';
import { ClientLocationDTO } from '../dto/client-location';
import logger from '../helpers/logger';
import ClientLocationService from '../services/client-location';
import FloorService from '../services/floor';

const loggerInstance = logger('client-invitations-controller');

export default class ClientLocationController {
  static async updateClientLocation(
    req: Request<{ companyId: number; locationId: number }, unknown, ClientLocationDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user;

      const response = await ClientLocationService.setClientLocation(
        id,
        req.body,
        req.body.companyId,
        req.params.locationId
      );

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error updating the client location', error);
      next(error);
    }
  }

  static async getLocation(req: Request<{ locationId: number }>, res: Response, next: NextFunction) {
    try {
      const { locationId } = req.params;
      const { id: userId } = req.user;

      const location = await ClientLocationService.findOneByUser(userId, locationId);
      const parsedLocation = location.toJSON();

      return res.send({ ...parsedLocation, ...getClientLocationNullPercentage(parsedLocation) });
    } catch (error) {
      loggerInstance.error('There was an error getting the location', error);
      return next(error);
    }
  }

  static async createLocationFloor(
    req: Request<{ locationId: number }, unknown, FloorInput>,
    res: Response,
    next: NextFunction
  ) {
    const { locationId } = req.params;
    const { id: userId } = req.user;
    try {
      const location = await FloorService.createLocationFloor(userId, locationId, {
        number: req.body.number,
      });

      return res.send(location);
    } catch (error) {
      loggerInstance.error(`There was an error creating the flor for user ${userId} and location ${locationId}`, error);
      return next(error);
    }
  }

  static async findAllByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;
      const { status } = req.query;
      const { floorsRequired } = req.query;

      const locations = await ClientLocationService.findAllByAccountManager(
        userId,
        status as LocationStatus,
        !!floorsRequired
      );
      return res.send(locations);
    } catch (error) {
      loggerInstance.error('There was an error getting all locations', error);
      return next(error);
    }
  }
}
