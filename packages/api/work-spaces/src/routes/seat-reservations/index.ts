import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema } from 'express-validator';
import GoogleCalendarController from '../../controllers/google-calendar';
import WPMReservationController from '../../controllers/wpm-reservation';
import { authMiddleware } from '../../middlewares/authMiddleware';

const seatReservationsRouter = express.Router();

/**
 * @swagger
 * /seat-reservations:
 *   post:
 *     tags:
 *       - Seat
 *       - Reservation
 *       - Booking
 *     summary: Reserve seats
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                - blueprintId
 *                - reservations
 *             properties:
 *               blueprintId:
 *                 type: number
 *               reservations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     seatId:
 *                       type: number
 *                     typeId:
 *                       type: number
 *                     startAt:
 *                       type: string
 *                     endAt:
 *                       type: string
 *     responses:
 *      200:
 *        description: Successfully reserved seats
 */
seatReservationsRouter.post(
  '/',
  checkSchema({
    blueprintId: {
      isInt: true,
    },
    reservations: {
      isArray: true,
    },
    'reservations.*.seatId': {
      isInt: true,
    },
    'reservations.*.typeId': {
      isInt: true,
      optional: true,
    },
    'reservations.*.startAt': {
      isISO8601: true,
      toDate: true,
    },
    'reservations.*.endAt': {
      isISO8601: true,
      toDate: true,
      optional: true,
    },
    'reservations.*.userId': {
      isInt: true,
      optional: true,
    },
  }),
  validationMiddleware,
  WPMReservationController.reserveSeat
);

/**
 * @swagger
 * /seat-reservations/types:
 *   get:
 *     tags:
 *       - Reservation
 *       - Types
 *     summary: Reservation types
 *     responses:
 *      200:
 *        description: Successfully retrieved reservation types
 */
seatReservationsRouter.get('/types', WPMReservationController.getReservationTypes);

/**
 * @swagger
 * /seat-reservations/users:
 *   get:
 *     tags:
 *       - Reservation
 *       - User
 *     summary: Reservation users.
 *     parameters:
 *       - in: query
 *         name: selectedDate
 *         schema:
 *           type: date
 *     responses:
 *      200:
 *        description: Successfully retrieved seat reservations users
 */
seatReservationsRouter.get('/users', WPMReservationController.getReservationsUsers);

/**
 * @swagger
 * /seat-reservations/{seatId}:
 *   get:
 *     tags:
 *       - Seat
 *       - Reservation
 *       - Details
 *     summary: Seat reservation details
 *     parameters:
 *       - in: path
 *         name: seatId
 *     responses:
 *      200:
 *        description: Successfully retrieved seat reservation details
 */
seatReservationsRouter.get('/:seatId', WPMReservationController.getReservation);

/**
 * @swagger
 * /seat-reservations:
 *   get:
 *     tags:
 *       - Reservation
 *     summary: Get all reservations of a company
 *     parameters:
 *       - in: query
 *         name: selectedDate
 *         schema:
 *           type: date
 *     responses:
 *      200:
 *        description: Successfully retrieved reservations
 */
seatReservationsRouter.get('/', WPMReservationController.getAllReservations);

seatReservationsRouter.post('/integrate/google/resources', authMiddleware, GoogleCalendarController.migrateResources);
seatReservationsRouter.get('/integrate/google/resources', authMiddleware, GoogleCalendarController.getUserResources);

export default seatReservationsRouter;
