import { NextFunction, Request, Response } from 'express';
import { AmenityInput, AmenityTypes } from '../db/models/Amenity';
import logger from '../helpers/logger';
import AmenityService from '../services/amenity';

const loggerInstance = logger('amenity-controller');
export default class AmenityController {
  static async getAmenitiesByType(
    req: Request<unknown, unknown, unknown, { type: AmenityTypes | AmenityTypes[] }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { type } = req.query;

      const amenities = await AmenityService.findAllByType(type);
      return res.send(amenities);
    } catch (error) {
      loggerInstance.error('There was an error getting the location amenities', error);
      return next(error);
    }
  }

  static async createAmentiy(
    req: Request<unknown, unknown, { name: AmenityInput['name'] }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const [amenity] = await AmenityService.findOrCreateAmenity(req.body.name);
      loggerInstance.info(`Amenity with name ${req.body.name} returned successfully`);
      return res.send(amenity);
    } catch (error) {
      loggerInstance.error(`There was an error returning amenity with name ${req.body.name}`, error);
      return next(error);
    }
  }
}
