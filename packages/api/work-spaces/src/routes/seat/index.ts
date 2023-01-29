import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema } from 'express-validator';
import SeatController from '../../controllers/seat';

const seatRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /seats/{seatId}:
 *   get:
 *     tags:
 *       - Seat
 *       - Details
 *     summary: Seat details
 *     parameters:
 *       - in: path
 *         name: seatId
 *     responses:
 *      200:
 *        description: Successfully retrieved seat details
 */
seatRouter.get('/:seatId', SeatController.getSeat);

/**
 * @swagger
 * /seats/{seatId}:
 *   patch:
 *     tags:
 *       - Seat
 *     summary: Update seat
 *     parameters:
 *       - in: path
 *         name: seatId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seat'
 *     responses:
 *      200:
 *        description: Successfully updated seat
 */
seatRouter.patch(
  '/:seatId',
  checkSchema({
    geometry: {
      isObject: true,
      optional: true,
    },
    'geometry.type': {
      equals: {
        options: 'Point',
      },
      optional: true,
    },
    'geometry.coordinates': {
      isArray: {
        options: { min: 2, max: 2 },
      },
      optional: true,
    },
    name: {
      isString: true,
      optional: true,
    },
    isAvailable: {
      isBoolean: true,
      optional: true,
    },
    amenities: {
      isArray: true,
      optional: true,
    },
    // spaceTypeId: {
    //   isInt: true,
    //   optional: true,
    //   isLength: {
    //     options: { min: 1 },
    //   },
    // },
  }),
  validationMiddleware,
  SeatController.updateSeat
);

/**
 * @swagger
 * /seats/{seatId}:
 *   delete:
 *     tags:
 *       - Seat
 *     summary: Delete seat
 *     parameters:
 *       - in: path
 *         name: seatId
 *     responses:
 *      200:
 *        description: Successfully updated seat
 */

seatRouter.delete('/:seatId', SeatController.deleteSeat);

export default seatRouter;
