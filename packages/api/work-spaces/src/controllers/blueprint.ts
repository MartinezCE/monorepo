import { NextFunction, Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { SeatDTO } from '../dto/seat';
import BlueprintService from '../services/blueprint';
import SeatService from '../services/seat';
import FileService from '../services/file';
import { S3File } from '../interfaces';
import UserService from '../services/user';
import { UserRoleEnum } from '../common/enum/user';
import UserAmenity from '../db/models/UserAmenity';
import CompanyService from '../services/company';
import logger from '../helpers/logger';

const loggerInstance = logger('blueprint-controller');

export default class BlueprintController {
  static async removeByUser(req: Request<{ blueprintId: string }>, res: Response, next: NextFunction) {
    const { blueprintId } = req.params;
    try {
      await BlueprintService.removeByUser(req.user.id, blueprintId);
      return res.sendStatus(204);
    } catch (error) {
      loggerInstance.error(
        `There was an error removing file ${blueprintId} for user ${req.user.id} the location amenities`,
        error
      );
      return next(error);
    }
  }

  static async setSeats(req: Request<{ blueprintId: number }, unknown, SeatDTO[]>, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;

      const response = await SeatService.setSeats(id, req.body, req.params.blueprintId);

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error creating the seat', error);
      next(error);
    }
  }

  static async getSeatsByBlueprint(
    req: Request<
      { blueprintId: number },
      unknown,
      unknown,
      { selectedDate: string; includeAmenities?: boolean; includeReservations?: boolean }
    >,
    res: Response,
    next: NextFunction
  ) {
    const { id: userId } = req.user;
    const { blueprintId } = req.params;
    const selectedDate = parseISO(req.query.selectedDate);

    try {
      loggerInstance.info(`Getting seats for blueprint ${blueprintId}`);

      const user = await UserService.getUserById(userId);
      const company = await CompanyService.findCompanyByUserId(user.id);
      const blueprint = await BlueprintService.getOneByUser(userId, blueprintId, { rejectOnEmpty: true });
      const userAmenities = await UserAmenity.count({ where: { userId, blueprintId } });

      const isAccountManager = user.userRole.value === UserRoleEnum.ACCOUNT_MANAGER;
      const hasAmenitiesToFilter = userAmenities > 0;
      const filterByUserAmenity = !isAccountManager && hasAmenitiesToFilter;

      const response = await SeatService.getSeatsByBlueprint({
        userId,
        blueprintId: blueprint.id,
        filterByUserAmenity,
        ...req.query,
        selectedDate,
        originTz: req.timezone,
        destinationTz: company.tz,
      });

      loggerInstance.info(`Seats for blueprint ${blueprintId} returned successfully`);

      res.send(response);
    } catch (error) {
      loggerInstance.error(`There was an error getting the seats by blueprint ${blueprintId}`, error);
      next(error);
    }
  }

  static async createSeat(req: Request<{ blueprintId: number }, SeatDTO>, res: Response, next: NextFunction) {
    const { id } = req.user;
    try {
      loggerInstance.info(`Creating seat for user ${id} and blueprint ${req.params.blueprintId}`);
      const company = await CompanyService.findCompanyByUserId(id);
      const response = await SeatService.createSeatByBlueprint(id, company.id, req.params.blueprintId, req.body);

      loggerInstance.info(`Seat for user ${id} and blueprint ${req.params.blueprintId} created successfully`);

      return res.send(response);
    } catch (error) {
      loggerInstance.error(
        `There was an error creating the seats for user ${id} and blueprint ${req.params.blueprintId}`,
        error
      );
      return next(error);
    }
  }

  static async updateByUser(req: Request<{ blueprintId?: number }>, res: Response, next: NextFunction) {
    try {
      const { blueprintId } = req.params;
      const blueprint = await BlueprintService.getOneByUser(req.user.id, blueprintId);
      const oldBlueprintKey = blueprint.key;
      const file = req.file as S3File;

      await blueprint.update({
        url: file?.location || null,
        mimetype: file?.mimetype || null,
        key: file?.key || null,
      });

      if (oldBlueprintKey) {
        FileService.removeFileFromS3(oldBlueprintKey);
      }

      return res.send(blueprint);
    } catch (error) {
      loggerInstance.error('There was an error modifyng blueprint', error);
      return next(error);
    }
  }

  static async getReservationsUsers(
    req: Request<{ blueprintId: number }, unknown, unknown, { selectedDate: Date }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { blueprintId } = req.params;
      const { id } = req.user;
      const user = await UserService.getUserById(id);
      const company = await CompanyService.findCompanyByUserId(id, undefined, { rejectOnEmpty: true });
      const blueprint = await BlueprintService.getOneByUser(user.id, blueprintId, { rejectOnEmpty: true });
      const response = await BlueprintService.getReservationsUsers(
        blueprint.id,
        company.id,
        req.timezone,
        company.tz,
        req.query.selectedDate
      );
      return res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error getting the seat reservations', error);
      return next(error);
    }
  }

  static async setUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { blueprintId } = req.params;
      const response = await BlueprintService.setUsers(Number(blueprintId), req.body);
      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error creating the seat', error);
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { blueprintId } = req.params;
      const response = await BlueprintService.getUsers(Number(blueprintId));
      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error creating the seat', error);
      next(error);
    }
  }

  static async removeUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { blueprintId, userId } = req.params;
      await BlueprintService.removeUser(Number(blueprintId), Number(userId));
      res.send({});
    } catch (error) {
      loggerInstance.error('There was an error creating the seat', error);
      next(error);
    }
  }
}
