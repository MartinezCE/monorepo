import express from 'express';
import UsersController from '../../controllers/users';
import WPMReservationController from '../../controllers/wpm-reservation';

const checkinRouter = express.Router();

checkinRouter.get('/users/:locationId/checkin', WPMReservationController.getReservationsUsersByLocation);
/**
 * @swagger
 * /checkin/{userId}/confirm:
 *   post:
 *     tags:
 *       - Reservation
 *     summary: confirm reservation
 *     responses:
 *      200:
 *        description: Successfully confirm reservation
 */
checkinRouter.post('/:reservationId/confirm', WPMReservationController.checkIn);

/**
 * @swagger
 * /checkin/{userId}/cancel:
 *   put:
 *     tags:
 *       - Reservation
 *     summary: cancel reservation
 *     responses:
 *      200:
 *        description: Successfully cancel reservation
 */
checkinRouter.put('/:reservationId/cancel', WPMReservationController.cancel);

/**
 * @swagger
 * /checkin/{userId}/aprovedaccessuser:
 *   get:
 *     tags:
 *       - Reservation
 *     summary: aproved access to User
 *     responses:
 *      200:
 *        description: Successfully retrieved user
 */
checkinRouter.get('/:userId/aprovedaccessuser', UsersController.aprovedAccessUser);

export default checkinRouter;
