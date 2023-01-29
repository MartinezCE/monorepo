import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema, Schema } from 'express-validator';
import AuthController from '../../controllers/auth';

const signUpRouter = express.Router();

const commonSchema = {
  email: {
    isEmail: true,
    errorMessage: 'Invalid email',
    isLength: {
      errorMessage: 'Email must be between 2 and 100 characters',
      options: { min: 2, max: 100 },
    },
  },
  password: {
    isString: true,
    errorMessage: 'Invalid password',
    isLength: {
      errorMessage: 'Password must be between 8 and 100 characters',
      options: { min: 8, max: 100 },
    },
  },
  firstName: {
    isString: true,
    errorMessage: 'Invalid first name',
    isLength: {
      errorMessage: 'First name must be between 2 and 100 characters',
      options: { min: 2, max: 100 },
    },
  },
  lastName: {
    isString: true,
    errorMessage: 'Invalid last name',
    isLength: {
      errorMessage: 'Last name must be between 2 and 100 characters',
      options: { min: 2, max: 100 },
    },
  },
  phoneNumber: {
    isString: true,
    errorMessage: 'Invalid phone number',
    isLength: {
      errorMessage: 'Phone number must be between 6 and 100 characters',
      options: { min: 6, max: 100 },
    },
  },
  'company.name': {
    isString: true,
    errorMessage: 'Invalid company name',
    isLength: {
      errorMessage: 'Company name must be between 2 and 100 characters',
      options: { min: 2, max: 100 },
    },
  },
  'company.stateId': {
    isInt: true,
    errorMessage: 'Invalid state id',
  },
} as Schema;

/**
 * @swagger
 * /auth/partners:
 *   post:
 *     tags:
 *       - Auth
 *       - Untested
 *     summary: Signup for partners
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartnersSignUpBody'
 *     responses:
 *      200:
 *        description: Successfully signup for partners
 */
signUpRouter.post(
  '/partners',
  checkSchema({
    ...commonSchema,
    'company.companyTypeId': {
      isInt: true,
      errorMessage: 'Invalid company type id',
    },
  }),
  validationMiddleware,
  AuthController.signUpPartner
);
/**
 * @swagger
 * /auth/clients:
 *   post:
 *     tags:
 *       - Auth
 *       - Untested
 *     summary: Signup for clients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientsSignUpBody'
 *     responses:
 *      200:
 *        description: Successfully signup for clients
 */
signUpRouter.post(
  '/clients',
  checkSchema({
    ...commonSchema,
    token: {
      optional: true,
      isJWT: true,
    },
    companyRole: {
      isString: true,
      optional: true,
    },
    email: {
      ...commonSchema.email,
      optional: true,
    },
    phoneNumber: {
      ...commonSchema.phoneNumber,
      optional: true,
    },
    'company.name': {
      ...commonSchema['company.name'],
      optional: true,
    },
    'company.stateId': {
      ...commonSchema['company.stateId'],
      optional: true,
    },
    'company.address': {
      optional: true,
      isString: true,
    },
    'company.zipCode': {
      optional: true,
      isString: true,
    },
    'company.businessName': {
      optional: true,
      isString: true,
    },
    'company.taxNumber': {
      optional: true,
      isString: true,
    },
    'company.peopleAmount': {
      optional: true,
      isInt: true,
    },
    'company.websiteUrl': {
      optional: true,
      isString: true,
    },
  }),
  validationMiddleware,
  AuthController.signUpClient
);

export default signUpRouter;
