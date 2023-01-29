import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema } from 'express-validator';
import BlueprintController from '../../controllers/blueprint';

const seatRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /blueprints/{blueprintId}/seats:
 *   put:
 *     tags:
 *       - Blueprints
 *       - Untested
 *     summary: Update seats by blueprintId
 *     parameters:
 *       - in: path
 *         name: blueprintId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PutBlueprintSeats'
 *     responses:
 *      200:
 *        description: Successfully updated seats by blueprint
 */
seatRouter.put(
  '/',
  checkSchema({
    '.*.id': {
      isInt: true,
      optional: true,
    },
    '.*.geometry': {
      isObject: true,
    },
    '.*.geometry.type': {
      equals: {
        options: 'Point',
      },
    },
    '.*.geometry.coordinates': {
      isArray: {
        options: { min: 2, max: 2 },
      },
    },
  }),
  validationMiddleware,
  BlueprintController.setSeats
);

/**
 * @swagger
 * /blueprints/{blueprintId}/seats:
 *   get:
 *     tags:
 *       - Blueprints
 *     summary: Get seats by blueprint
 *     parameters:
 *       - in: path
 *         name: blueprintId
 *     responses:
 *       200:
 *         description: Successfully returned seats by blueprint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeatArray'
 */
seatRouter.get('/', BlueprintController.getSeatsByBlueprint);

/**
 * @swagger
 * /blueprints/{blueprintId}/seats:
 *   post:
 *     tags:
 *       - Blueprints
 *     summary: Create seat by blueprint
 *     parameters:
 *       - in: path
 *         name: blueprintId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seat'
 *             required:
 *                - name
 *                - geometry
 *     responses:
 *      200:
 *        description: Successfully created seat by blueprint
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Seat'
 */
seatRouter.post(
  '/',
  checkSchema({
    geometry: {
      isObject: true,
    },
    'geometry.type': {
      equals: {
        options: 'Point',
      },
    },
    'geometry.coordinates': {
      isArray: {
        options: { min: 2, max: 2 },
      },
    },
    name: {
      isString: true,
    },
    isAvailable: {
      isBoolean: true,
    },
    amenities: {
      isArray: true,
      optional: true,
    },
  }),
  validationMiddleware,
  BlueprintController.createSeat
);

export default seatRouter;
