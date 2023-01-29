import { NextFunction, Request, Response } from 'express';
import database from '../db';
import { AmenityInput } from '../db/models/Amenity';
import SpaceAmenity from '../db/models/SpaceAmenity';
import SpaceFile, { SpaceFileInput } from '../db/models/SpaceFile';
import { SpaceDTO } from '../dto/space';
import logger from '../helpers/logger';
import { FileTypes, S3File } from '../interfaces';
import AmenityService from '../services/amenity';
import FileService from '../services/file';
import SpaceService from '../services/space';
import SpaceOfferService from '../services/space-offer';
import SpaceTypeService from '../services/space-type';

const loggerInstance = logger('space-controller');

export default class SpaceController {
  static async createSpaceAmenity(
    req: Request<{ spaceId: number }, unknown, AmenityInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { spaceId } = req.params;
      const { id } = req.user;

      const spaceAmenity = await database.transaction(async t => {
        const [amenity] = await AmenityService.findOrCreateAmenity(req.body.name, t);
        const space = await SpaceService.findOneByUser(id, spaceId, t);

        return AmenityService.addAmenity(SpaceAmenity, amenity.id, { spaceId: space.id }, t);
      });

      return res.send(spaceAmenity);
    } catch (error) {
      loggerInstance.error('There was an error creating the amenity for the space', error);
      return next(error);
    }
  }

  static async deleteSpace(req: Request<{ spaceId: number }>, res: Response, next: NextFunction) {
    try {
      const { spaceId } = req.params;
      const { id } = req.user;

      await SpaceService.removeSpaceByUser(id, spaceId);

      return res.sendStatus(204);
    } catch (error) {
      loggerInstance.error('There was an error deleting the space', error);
      return next(error);
    }
  }

  static async removeSpaceAmenity(
    req: Request<{ spaceId: number; amenityId: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { amenityId, spaceId } = req.params;
      const { id } = req.user;

      const space = await SpaceService.findOneByUser(id, spaceId);
      await AmenityService.removeAmenity(SpaceAmenity, amenityId, { spaceId: space.id });
      return res.sendStatus(204);
    } catch (error) {
      loggerInstance.error('There was an error removing the amenity from the space');
      return next(error);
    }
  }

  static async getSpaceFiles(req: Request<{ spaceId: number }>, res: Response, next: NextFunction) {
    try {
      const { spaceId } = req.params;
      const { id: userId } = req.user;

      const space = await SpaceService.findOneByUser(userId, spaceId);
      return res.send(space);
    } catch (error) {
      loggerInstance.error('There was an error getting the space', error);
      return next(error);
    }
  }

  static async addSpaceFiles(
    req: Request<{ spaceId?: number }, SpaceFileInput['type']>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { spaceId } = req.params;
      const { type } = req.query;
      const { id } = req.user;

      const space = await SpaceService.findOneByUser(id, spaceId);
      const files = await FileService.addFiles(SpaceFile, req.files as S3File[], () => ({
        type: type as FileTypes,
        spaceId: space.id,
      }));

      return res.send(files);
    } catch (error) {
      loggerInstance.error('There was an error adding space files', error);
      return next(error);
    }
  }

  static async removeSpaceFile(req: Request<{ spaceId: number; fileId: number }>, res: Response, next: NextFunction) {
    try {
      const { spaceId, fileId } = req.params;
      const { id } = req.user;

      const space = await SpaceService.findOneByUser(id, spaceId);
      await FileService.removeFile(SpaceFile, fileId, { spaceId: space.id });

      return res.sendStatus(204);
    } catch (error) {
      loggerInstance.error('There was an error removing space file', error);
      return next(error);
    }
  }

  static async getSpace(req: Request<{ spaceId: number }>, res: Response, next: NextFunction) {
    try {
      const { spaceId } = req.params;

      const space = await SpaceService.findOneById(spaceId);

      return res.send(space);
    } catch (error) {
      loggerInstance.error('There was an error getting the space', error);
      return next(error);
    }
  }

  static async getSpaceOffersBySpaceType(req: Request, res: Response, next: NextFunction) {
    try {
      const { typeId } = req.params;
      const response = await SpaceOfferService.getSpaceOffersBySpaceType(typeId);
      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error getting the offer types', error);
      next(error);
    }
  }

  static async editSpace(req: Request<{ spaceId: number }, unknown, SpaceDTO>, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const { spaceId } = req.params;

      const space = await SpaceService.setSpace(id, req.body, null, spaceId);

      return res.send(space);
    } catch (error) {
      loggerInstance.error('There was an error editting the space', error);
      return next(error);
    }
  }

  static async getAllSpacesTypes(_: Request, res: Response, next: NextFunction) {
    try {
      const response = await SpaceTypeService.findAll();
      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error getting the offer types', error);
      next(error);
    }
  }
}
