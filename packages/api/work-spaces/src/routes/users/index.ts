import express from 'express';
import UsersController from '../../controllers/users';

const usersRouter = express.Router();

/**
 * @swagger
 * /users/{userId}/reservations:
 *   get:
 *     tags:
 *       - User
 *     summary: Get User reservations
 *     responses:
 *      200:
 *        description: Successfully retrieved user reservations
 */
usersRouter.get('/:userId/reservations', UsersController.getReservations);

/**
 * @swagger
 * /users/{userId}/amenities:
 *   put:
 *     tags:
 *       - User
 *     summary: Put User amenities
 *     responses:
 *      200:
 *        description: Successfully set user amenities
 */
usersRouter.put('/:userId/amenities', UsersController.setAmenities);

/**
 * @swagger
 * /users/{userId}/wmp-permissions:
 *   delete:
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *     summary: Delete all WMP permissions from user
 *     responses:
 *      200:
 *        description: Successfully set user amenities
 */
usersRouter.delete('/:userId/wmp-permissions', UsersController.removeWmpPermissions);

export default usersRouter;
