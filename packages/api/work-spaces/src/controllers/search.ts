import { NextFunction, Request, Response } from 'express';
import SpaceHelper from '../helpers/space';
import LocationService from '../services/location';
import logger from '../helpers/logger';

const loggerInstance = logger('search-controller');

export default class SearchController {
  static async findSpaces(
    req: Request<unknown, unknown, { lat: number; lng: number; radius: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { lat, lng, radius, ...rawFilters } = req.query;
    try {
      const filters = SpaceHelper.getCleanFilters(rawFilters);

      if (!lng || !lat) return res.send([]);

      const locations = await LocationService.findAllInRadius(
        { lat: Number(lat), lng: Number(lng) },
        Number(radius),
        filters
      );

      return res.send(locations);
    } catch (e) {
      loggerInstance.error(`Error while trying to search on lat: '${lat}', lng: '${lng}'`, e);
      return next(e);
    }
  }
}
