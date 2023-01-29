import { NextFunction, Request, Response } from 'express';
import { SeatDTO } from '../dto/seat';
import logger from '../helpers/logger';
import CompanyService from '../services/company';
import SeatService from '../services/seat';

const loggerInstance = logger('seat-controller');

export default class SeatController {
  static async updateSeat(req: Request<{ seatId: number }, SeatDTO>, res: Response, next: NextFunction) {
    const { id } = req.user;
    try {
      loggerInstance.info(`Creating seat for user ${id} and seat ${req.params.seatId}`);

      const company = await CompanyService.findCompanyByUserId(id);

      const seat = await SeatService.updateSeatByUser(id, company.id, req.params.seatId, req.body);

      loggerInstance.info(`Seat for user ${id} and seat ${req.params.seatId} created successfully`);

      return res.send(seat);
    } catch (error) {
      loggerInstance.error(`There was an error creating the seats for user ${id} and seat ${req.params.seatId}`, error);
      return next(error);
    }
  }

  static async deleteSeat(req: Request<{ seatId: number }, SeatDTO>, res: Response, next: NextFunction) {
    const { id } = req.user;
    try {
      loggerInstance.info(`Deleting seat for user ${id} and seat ${req.params.seatId}`);
      const seat = await SeatService.deleteSeatByUser(id, req.params.seatId);
      loggerInstance.info(`Seat for user ${id} and seat ${req.params.seatId} deleted successfully`);

      return res.send(seat);
    } catch (error) {
      loggerInstance.error(`There was an error deleting the seats for user ${id} and seat ${req.params.seatId}`, error);
      return next(error);
    }
  }

  static async getSeat(req: Request<{ seatId: number }, SeatDTO>, res: Response, next: NextFunction) {
    const { seatId } = req.params;

    try {
      const seat = await SeatService.getOne(seatId);
      return res.send(seat);
    } catch (e) {
      loggerInstance.error(`There was an error getting the seat ${seatId}`, e);
      return next(e);
    }
  }
}
