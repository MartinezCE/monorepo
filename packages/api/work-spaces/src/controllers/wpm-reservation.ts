import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { parseISO } from 'date-fns';
import { WPMReservationDTO } from '../dto/wpm-reservation';
import WPMReservationService from '../services/wpm-reservation';
import WPMReservationTypeService from '../services/wpm-reservation-type';
import BlueprintService from '../services/blueprint';
import { UNAUTHORIZED_BLUEPRINT } from '../config/errorCodes';
import UserService from '../services/user';
import CompanyService from '../services/company';
import logger from '../helpers/logger';
import SeatService from '../services/seat';
import GoogleCalendarService from '../services/google-calendar';
import database from '../db/database';

const loggerInstance = logger('wpm-reservation-controller');

export default class WPMReservationController {
  static async reserveSeat(req: Request<unknown, unknown, WPMReservationDTO>, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const { blueprintId, reservations } = req.body;

      try {
        await BlueprintService.getOneAssociatedToUser(id, blueprintId);
      } catch (_) {
        throw createHttpError(403, UNAUTHORIZED_BLUEPRINT);
      }

      const company = await CompanyService.getCompanyByBlueprintId(blueprintId);
      const reservation = await WPMReservationService.createReservations(
        blueprintId,
        reservations,
        req.timezone,
        company.tz
      );

      return res.send(reservation);
    } catch (e) {
      loggerInstance.error('There was an error reserving the seat', e);
      return next(e);
    }
  }

  static async getReservationTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const reservationTypes = await WPMReservationTypeService.getReservationTypes();
      return res.send(reservationTypes);
    } catch (e) {
      loggerInstance.error('There was an error getting the reservation types', e);
      return next(e);
    }
  }

  static async getReservation(
    req: Request<{ seatId: number }, unknown, unknown, { selectedDate: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: userId } = req.user;
      const { seatId } = req.params;
      const selectedDate = parseISO(req.query.selectedDate);

      const user = await UserService.getUserById(userId);
      const company = await CompanyService.findCompanyByUserId(user.id, undefined, { rejectOnEmpty: true });
      const reservations = await WPMReservationService.getSeatReservationsByUser(
        user.id,
        seatId,
        selectedDate,
        req.timezone,
        company.tz
      );

      return res.send(reservations);
    } catch (e) {
      loggerInstance.error('There was an error getting the reservation', e);
      return next(e);
    }
  }

  static async getAllReservations(
    req: Request<unknown, unknown, unknown, { selectedDate: Date }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user;
      const { selectedDate } = req.query;
      const user = await UserService.getUserById(id);
      const company = await CompanyService.findCompanyByUserId(user.id);

      const reservationTypes = await WPMReservationService.getAllReservationsByCompany(
        company.id,
        req.timezone,
        company.tz,
        selectedDate
      );
      return res.send(reservationTypes);
    } catch (e) {
      loggerInstance.error('There was an error getting the reservation types', e);
      return next(e);
    }
  }

  static async getReservationsUsers(
    req: Request<unknown, unknown, unknown, { selectedDate: Date }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user;
      const user = await UserService.getUserById(id);
      const company = await CompanyService.findCompanyByUserId(user.id, undefined, { rejectOnEmpty: true });
      const reservationUsers = await WPMReservationService.getReservationsUsers(
        company.id,
        req.timezone,
        company.tz,
        req.query.selectedDate
      );
      return res.send(reservationUsers);
    } catch (e) {
      loggerInstance.error('There was an error getting the reservation users', e);
      return next(e);
    }
  }

  static async getReservationsUsersByLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { locationId } = req.params;
      const selectedDate = new Date();

      const reservationUsers = await WPMReservationService.getReservationsUsersByLocation(
        locationId,
        selectedDate,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        Intl.DateTimeFormat().resolvedOptions().timeZone
      );
      return res.send(reservationUsers);
    } catch (e) {
      loggerInstance.error('There was an error getting the reservation users', e);
      return next(e);
    }
  }

  static async checkIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { reservationId } = req.params;
      await WPMReservationService.setCheckIn(Number(reservationId));
      return res.sendStatus(204);
    } catch (error) {
      loggerInstance.error('There was an error updating reservation data', error);
      return next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { reservationId } = req.params;
      await WPMReservationService.setCancel(Number(reservationId));
      return res.sendStatus(204);
    } catch (error) {
      loggerInstance.error('There was an error updating reservation data', error);
      return next(error);
    }
  }

  static async reserveSeatFromGoogle(req: Request, res: Response, next: NextFunction) {
    if (req.header('x-goog-resource-state') === 'sync') return res.sendStatus(200);
    const seatWebhookId = req.header('x-goog-channel-id');
    const channelToken = req.header('x-goog-channel-token');
    const [key, value] = channelToken?.split('=') || [];

    if (key !== 'baseURL' || value !== process.env.API_BASE_URL) return res.sendStatus(404);

    try {
      await database.transaction(async transaction => {
        const seat = await SeatService.findOneByWebhookId('google', seatWebhookId, transaction);
        const blueprint = await BlueprintService.getBlueprintBySeatId(seat.id, transaction);
        const company = await CompanyService.getCompanyByBlueprintId(blueprint.id, transaction);

        const { refreshToken, profileId } = CompanyService.extractToken(company.adminProviders, 'google');
        const { calendarId, calendarSyncToken } = seat.provider || {};

        const user = await UserService.findByProviderId('google', profileId, transaction);
        await GoogleCalendarService.createAllMissingWPMReservations(
          refreshToken,
          user,
          seat,
          company,
          calendarId,
          calendarSyncToken,
          transaction
        );
      });

      return res.sendStatus(200);
    } catch (error) {
      loggerInstance.error(
        `There was an error creating/canceling a wpm seat reservation from Google Webhook with ID: ${seatWebhookId}`,
        error
      );
      return next(error);
    }
  }
}
