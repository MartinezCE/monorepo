import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema, Schema } from 'express-validator';
import { locationValidationSchema } from '../../common/validation/location';
import CompanyController from '../../controllers/company';

const companyLocationRouter = express.Router({ mergeParams: true });
/**
 * @swagger
 * /companies/{companyId}/locations:
 *   post:
 *     tags:
 *       - Companies
 *       - Untested
 *     summary: Create location
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
 *        description: Successfully created location
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 */
companyLocationRouter.post(
  '/',
  checkSchema({
    ...(locationValidationSchema as Schema),
    description: {
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
  CompanyController.createLocation
);
/**
 * @swagger
 * /companies/{companyId}/locations:
 *   get:
 *     tags:
 *       - Companies
 *       - Untested
 *     summary: Get list of locations by companyId
 *     parameters:
 *       - in: path
 *         name: companyId
 *     responses:
 *      200:
 *        description: Successfully getted locations by company
 */
companyLocationRouter.get('/', CompanyController.getAllLocations);

export default companyLocationRouter;
