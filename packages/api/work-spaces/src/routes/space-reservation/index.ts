import express from 'express';
import { UserRoleEnum } from '../../common/enum/user';
import SpaceReservationController from '../../controllers/space-reservation';
import roleValidationMiddleware from '../../middlewares/roleValidationMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';
import spaceReservationTypesRouter from './space-reservation-type';

const spaceReservationsRouter = express.Router();

spaceReservationsRouter.use('/types', spaceReservationTypesRouter);

spaceReservationsRouter.post('/', authMiddleware, SpaceReservationController.createReservation);

/**
 * @swagger
 * /space-reservations:
 *   get:
 *     tags:
 *       - Companies
 *       - Reservations
 *       - Untested
 *     summary: Get all space reservations
 *     parameters:
 *       - in: query
 *         name: limit
 *       - in: query
 *         name: offset
 *     responses:
 *      200:
 *        description: Successfully retrieved space reservations
 */
spaceReservationsRouter.get(
  '/',
  authMiddleware,
  roleValidationMiddleware([UserRoleEnum.ACCOUNT_MANAGER, UserRoleEnum.TEAM_MANAGER]),
  SpaceReservationController.getSpaceReservations
);

export default spaceReservationsRouter;
