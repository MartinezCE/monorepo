import express from 'express';
import UserController from '../../controllers/user';
import meSeatReservationRouter from './seat-reservation';
import { authMiddleware } from '../../middlewares/authMiddleware';

const meRouter = express.Router();

/**
 * @swagger
 * /user/me:
 *   get:
 *     tags:
 *       - User
 *     summary: Get User data
 *     responses:
 *      200:
 *        description: Successfully getted user data
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/User'
 */

meRouter.get('/', authMiddleware, UserController.getMe);

meRouter.use('/seat-reservations', meSeatReservationRouter);

/**
 * @swagger
 * /user/me/wpm-reservations:
 *   get:
 *     tags:
 *       - User
 *     summary: Get User WPM reservations
 *     responses:
 *      200:
 *        description: Successfully retrieved user WPM reservations
 */
meRouter.get('/wpm-reservations', UserController.getWPMReservations);

export default meRouter;
