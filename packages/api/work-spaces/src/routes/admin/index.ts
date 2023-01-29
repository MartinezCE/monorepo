import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema } from 'express-validator';
import AdminController from '../../controllers/admin';

const adminRouter = express.Router();

/**
 * @swagger
 * /admin/assign-locations:
 *   post:
 *     tags:
 *       - Admin
 *       - Untested
 *     summary: Assign locations to a users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                - userId
 *                - locationIds
 *             properties:
 *               userId:
 *                 type: integer
 *               locationIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *      204:
 *        description: Successfully assigned locations
 */
adminRouter.post(
  '/assign-locations',
  checkSchema({
    locationIds: {
      in: 'body',
      isArray: {
        options: {
          min: 1,
        },
      },
    },
    userId: {
      in: 'body',
      isInt: true,
    },
  }),
  validationMiddleware,
  AdminController.assignLocationsToUser
);

export default adminRouter;
