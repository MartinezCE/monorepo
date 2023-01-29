import { NextFunction, Request, Response } from 'express';
import database from '../db';
import { AmenityInput } from '../db/models/Amenity';
import LocationAmenity from '../db/models/LocationAmenity';
import LocationFile, { LocationFileInput } from '../db/models/LocationFile';
import { LocationDTO } from '../dto/location';
import { SpaceDTO } from '../dto/space';
import { FileTypes, S3File } from '../interfaces';
import AmenityService from '../services/amenity';
import FileService from '../services/file';
import LocationService from '../services/location';
import SpaceService from '../services/space';
import SpaceHelper from '../helpers/space';
import SeatService from '../services/seat';
import logger from '../helpers/logger';
import FloorService from '../services/floor';
import BlueprintService from '../services/blueprint';

const loggerInstance = logger('location-controller');

type CsvParsedItem = {
  name: string;
  spaceTypeId: number;
  isAvailable: boolean;
};

export default class LocationController {
  static async updateLocation(
    req: Request<{ companyId: number; locationId: number }, unknown, LocationDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await LocationService.setLocation(
        req.user.id,
        req.body,
        req.params.companyId,
        req.params.locationId
      );

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error creating the partner and company', error);
      next(error);
    }
  }

  static async deleteLocation(req: Request<{ locationId: number }>, res: Response, next: NextFunction) {
    try {
      const { locationId } = req.params;
      const { id } = req.user;

      await LocationService.removeLocationByUser(id, locationId);

      return res.sendStatus(204);
    } catch (error) {
      loggerInstance.error('There was an error deleting the location', error);
      return next(error);
    }
  }

  static async createLocationAmenity(
    req: Request<{ locationId: number }, unknown, AmenityInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { locationId } = req.params;
      const { id } = req.user;

      const locationAmenity = await database.transaction(async t => {
        const [amenity] = await AmenityService.findOrCreateAmenity(req.body.name, t);
        const location = await LocationService.findOneByUser(id, locationId, t);

        return AmenityService.addAmenity(LocationAmenity, amenity.id, { locationId: location.id }, t);
      });

      return res.send(locationAmenity);
    } catch (error) {
      loggerInstance.error('There was an error creating the amenity for the location');
      return next(error);
    }
  }

  static async removeLocationAmenity(
    req: Request<{ locationId: number; amenityId: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { amenityId, locationId } = req.params;
      const { id } = req.user;

      const location = await LocationService.findOneByUser(id, locationId);
      await AmenityService.removeAmenity(LocationAmenity, amenityId, { locationId: location.id });
      return res.sendStatus(204);
    } catch (error) {
      loggerInstance.error('There was an error removing the amenity from the location');
      return next(error);
    }
  }

  static async addLocationFiles(
    req: Request<{ locationId?: number }, LocationFileInput['type']>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { locationId } = req.params;
      const { type } = req.query;
      const { id } = req.user;

      const location = await LocationService.findOneByUser(id, locationId);
      const files = await FileService.addFiles(LocationFile, req.files as S3File[], () => ({
        type: type as FileTypes,
        locationId: location.id,
      }));

      return res.send(files);
    } catch (error) {
      loggerInstance.error('There was an error adding location files', error);
      return next(error);
    }
  }

  static async removeLocationFile(
    req: Request<{ locationId: number; fileId: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { locationId, fileId } = req.params;
      const { id } = req.user;

      const location = await LocationService.findOneByUser(id, locationId);
      await FileService.removeFile(LocationFile, fileId, { locationId: location.id });

      return res.sendStatus(204);
    } catch (error) {
      loggerInstance.error('There was an error removing location file', error);
      return next(error);
    }
  }

  static async createSpace(req: Request<{ locationId: number }, unknown, SpaceDTO>, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const { locationId } = req.params;

      const space = await SpaceService.setSpace(id, req.body, locationId);

      return res.send(space);
    } catch (error) {
      loggerInstance.error('There was an error creating the space', error);
      return next(error);
    }
  }

  static async getLocation(req: Request<{ locationId: number }>, res: Response, next: NextFunction) {
    try {
      const { locationId } = req.params;
      const { id: userId } = req.user;

      const location = await LocationService.findOneByUser(userId, locationId);
      const parsedLocation = location.toJSON();

      const data = {
        ...parsedLocation,
        locationFiles: FileService.groupFileByType(location.locationFiles),
      };

      return res.send(data);
    } catch (error) {
      loggerInstance.error('There was an error getting the location', error);
      return next(error);
    }
  }

  static async getAllSpaces(
    req: Request<{ locationId: number }, unknown, LocationDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const filters = SpaceHelper.getCleanFilters(req.query);

      const space = await SpaceService.findAllByLocationId(req.params.locationId, filters);

      res.send(space);
    } catch (error) {
      next(error);
    }
  }

  static async getSeatsByLocation(req: Request<{ locationId: number }>, res: Response, next: NextFunction) {
    try {
      const availability = await SeatService.getSeatsByLocation(req.params.locationId);
      res.send(availability);
    } catch (error) {
      next(error);
    }
  }

  static async bullkCreateSeats(req: Request, res: Response, next: NextFunction) {
    try {
      const { items, locationId } = req.body;

      Object.entries(items).forEach(async (item: [string, CsvParsedItem[]]) => {
        const [key, seats] = item;
        const floor = await FloorService.findOrCreateByLocationAndName(locationId, key);
        const blueprint = await BlueprintService.findOrCreateAssociatedToFloor(locationId, floor.id);
        const newSeats = seats.map(seat => {
          return {
            blueprintId: blueprint.id,
            name: seat.name,
            spaceTypeId: seat.spaceTypeId,
            isAvailable: seat.isAvailable,
          };
        });
        await SeatService.bulkUpsert(newSeats, blueprint.id);
      });

      res.send({});
    } catch (err) {
      next(err);
    }
  }
}
