import express from 'express';
import { UserRoleEnum } from '../../common/enum/user';
import PlanController from '../../controllers/plan';
import roleValidationMiddleware from '../../middlewares/roleValidationMiddleware';

const usersRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /plans/{planId}/users:
 *   get:
 *     tags:
 *       - Plan
 *     summary: Get plan users
 *     parameters:
 *       - in: path
 *         name: planId
 *     responses:
 *      200:
 *        description: Successfully retrieved plan users
 */
usersRouter.get('/', PlanController.getUsers);
/**
 * @swagger
 * /plans/{planId}/users/{userId}:
 *   delete:
 *     tags:
 *       - Plan
 *     summary: Delete plan user
 *     parameters:
 *       - in: path
 *         name: planId
 *       - in: path
 *         name: userId
 *     responses:
 *      204:
 *        description: Successfully deleted plan user
 */
usersRouter.delete(
  '/:userId',
  roleValidationMiddleware([UserRoleEnum.ACCOUNT_MANAGER, UserRoleEnum.TEAM_MANAGER]),
  PlanController.deletePlanUser
);
/**
 * @swagger
 * /plans/{planId}/users:
 *   post:
 *     tags:
 *       - Plan
 *     summary: Asociates users to a plan
 *     parameters:
 *       - in: path
 *         name: planId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              object:
 *              properties:
 *                  users:
 *                      type: array
 *                      items:
 *                          type: number
 *     responses:
 *      200:
 *        description: Successfully created plan users
 */
usersRouter.post(
  '/',
  roleValidationMiddleware([UserRoleEnum.ACCOUNT_MANAGER, UserRoleEnum.TEAM_MANAGER]),
  PlanController.createPlanUser
);

export default usersRouter;
