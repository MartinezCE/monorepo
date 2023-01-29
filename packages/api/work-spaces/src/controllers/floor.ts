import { NextFunction, Request, Response } from 'express';
import Blueprint, { BlueprintStatus } from '../db/models/Blueprint';
import logger from '../helpers/logger';
import { S3File } from '../interfaces';
import FileService from '../services/file';
import FloorService from '../services/floor';

const loggerInstance = logger('floor-controller');

export default class FloorController {
  static async createBlueprint(req: Request<{ floorId?: number }>, res: Response, next: NextFunction) {
    try {
      const { floorId } = req.params;

      const floor = await FloorService.findOneByUser(req.user.id, floorId);
      const files = await FileService.addFiles(Blueprint, req.files as S3File[], f => ({
        floorId: floor.id,
        name: req.body.name || f.originalname.split('.')[0],
        status: BlueprintStatus.PUBLISHED,
      }));

      return res.send(files);
    } catch (error) {
      loggerInstance.error('There was an error adding floor', error);
      return next(error);
    }
  }

  static async delete(req: Request<{ floorId?: number }>, res: Response, next: NextFunction) {
    try {
      const { floorId } = req.params;
      const { id } = req.user;
      const floor = await FloorService.findOneByUser(id, floorId);

      await floor.destroy();

      return res.send();
    } catch (error) {
      loggerInstance.error('There was an error adding floor', error);
      return next(error);
    }
  }
}
