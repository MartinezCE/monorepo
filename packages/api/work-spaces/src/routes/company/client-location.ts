import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema, Schema } from 'express-validator';
import { locationValidationSchema } from '../../common/validation/location';
import CompanyController from '../../controllers/company';

const companyClientLocationRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /companies/{companyId}/client-locations:
 *   post:
 *     tags:
 *       - Companies
 *       - Untested
 *     summary: Create client location
 *     parameters:
 *       - in: path
 *         name: companyId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationDto'
 *     responses:
 *      200:
 *        description: Successfully created seat by blueprint
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 */
companyClientLocationRouter.post(
  '/',
  checkSchema({
    ...(locationValidationSchema as Schema),
    description: {
      optional: true,
      isString: true,
      errorMessage: 'Invalid description',
    },
    address: {
      isString: true,
      errorMessage: 'Invalid address',
    },
    latitude: {
      isDecimal: true,
      errorMessage: 'Invalid latitude',
    },
    longitude: {
      isDecimal: true,
      errorMessage: 'Invalid longitude',
    },
  }),
  validationMiddleware,
  CompanyController.createClientLocation
);

export default companyClientLocationRouter;
