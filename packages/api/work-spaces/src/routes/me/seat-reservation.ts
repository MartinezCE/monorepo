import express from 'express';
import UserController from '../../controllers/user';
import { authMiddleware } from '../../middlewares/authMiddleware';

const meSeatReservationRouter = express.Router();

/**
 * @swagger
 * /user/me/seat-reservations/{locationId}:
 *   get:
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: locationId
 *       - in: query
 *         name: date
 *     summary: Get User reservation data by locationId
 *     responses:
 *      200:
 *        description: Successfully getted user reservation data
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/User'
 */

meSeatReservationRouter.get('/', authMiddleware, UserController.getUserReservation);

export default meSeatReservationRouter;
