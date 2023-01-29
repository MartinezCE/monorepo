import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema } from 'express-validator';
import CompanyController from '../../controllers/company';

const companyPlanRouter = express.Router({ mergeParams: true });
/**
 * @swagger
 * /companies/{companyId}/plans:
 *   post:
 *     tags:
 *       - Companies
 *       - Untested
 *     summary: Create plan
 *     parameters:
 *       - in: path
 *         name: companyId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlanDto'
 *     responses:
 *      200:
 *        description: Successfully created plan
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 */
companyPlanRouter.post(
  '/',
  checkSchema({
    name: {
      isString: true,
    },
    maxPersonalCredits: {
      isInt: true,
    },
    maxReservationCredits: {
      isInt: true,
    },
    startDate: {
      isISO8601: true,
      toDate: true,
    },
    users: {
      isArray: {
        options: {
          min: 1,
        },
      },
    },
    'users.*': {
      isInt: true,
    },
    credits: {
      isInt: true,
      optional: true,
    },
  }),
  validationMiddleware,
  CompanyController.createPlan
);
/**
 * @swagger
 * /companies/{companyId}/plans:
 *   get:
 *     tags:
 *       - Companies
 *       - Untested
 *     summary: Get list of plans by companyId
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: query
 *         name: limit
 *       - in: query
 *         name: offset
 *     responses:
 *      200:
 *        description: Successfully getted plans by company
 */
companyPlanRouter.get('/', CompanyController.getAllPlans);

export default companyPlanRouter;
