import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema } from 'express-validator';
import { UserRoleEnum } from '../../common/enum/user';
import PlanController from '../../controllers/plan';
import roleValidationMiddleware from '../../middlewares/roleValidationMiddleware';
import usersRouter from './users';

const planRouter = express.Router({ mergeParams: true });

planRouter.use('/:planId/users', usersRouter);

/**
 * @swagger
 * /plans/{planId}/used-credits:
 *   get:
 *     tags:
 *       - Plan
 *     summary: Get plan used credits
 *     parameters:
 *       - in: path
 *         name: planId
 *     responses:
 *      200:
 *        description: Successfully retrieved plan used credits
 */
planRouter.get(
  '/:planId/used-credits',
  roleValidationMiddleware([UserRoleEnum.ACCOUNT_MANAGER]),
  PlanController.getUsedCredits
);

/**
 * @swagger
 * /plans/{planId}/reservations:
 *   get:
 *     tags:
 *       - Plan
 *     summary: Get plan reservations
 *     parameters:
 *       - in: path
 *         name: planId
 *     responses:
 *      200:
 *        description: Successfully retrieved plan reservations
 */
planRouter.get(
  '/:planId/reservations',
  roleValidationMiddleware([UserRoleEnum.ACCOUNT_MANAGER]),
  PlanController.getReservations
);

/**
 * @swagger
 * /plans/{planId}/renovations:
 *   get:
 *     tags:
 *       - Plan
 *     summary: Get plan renovations
 *     parameters:
 *       - in: path
 *         name: planId
 *     responses:
 *      200:
 *        description: Successfully retrieved plan renovations
 */
planRouter.get(
  '/:planId/renovations',
  roleValidationMiddleware([UserRoleEnum.ACCOUNT_MANAGER]),
  PlanController.getRenovations
);

/**
 * @swagger
 * /plans/{planId}:
 *   get:
 *     tags:
 *       - Plan
 *     summary: Get plan
 *     parameters:
 *       - in: path
 *         name: planId
 *     responses:
 *      200:
 *        description: Successfully retrieved plan
 */

planRouter.get('/:planId', roleValidationMiddleware([UserRoleEnum.ACCOUNT_MANAGER]), PlanController.getPlan);

/**
 * @swagger
 * /plans/{planId}:
 *   delete:
 *     tags:
 *       - Plan
 *     summary: Delete plan
 *     parameters:
 *       - in: path
 *         name: planId
 *     responses:
 *      200:
 *        description: Successfully deleted plan
 */

planRouter.delete(
  '/:planId',
  roleValidationMiddleware([UserRoleEnum.ACCOUNT_MANAGER, UserRoleEnum.TEAM_MANAGER]),
  PlanController.deletePlan
);

/**
 * @swagger
 * /plans/{planId}:
 *   patch:
 *     tags:
 *       - Plan
 *     summary: Update plan
 *     parameters:
 *       - in: path
 *         name: planId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 *     responses:
 *      200:
 *        description: Successfully updated plan
 */
planRouter.patch(
  '/:planId',
  roleValidationMiddleware([UserRoleEnum.ACCOUNT_MANAGER]),
  checkSchema({
    name: {
      optional: true,
      isString: true,
    },
    maxPersonalCredits: {
      optional: true,
      isInt: true,
    },
    maxReservationCredits: {
      optional: true,
      isInt: true,
    },
    users: {
      optional: true,
      isArray: {
        options: {
          min: 1,
        },
      },
    },
    'users.*': {
      isInt: true,
    },
  }),
  validationMiddleware,
  PlanController.updatePlan
);

export default planRouter;
