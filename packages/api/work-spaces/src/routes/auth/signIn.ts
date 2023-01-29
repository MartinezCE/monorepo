import express from 'express';
import { checkSchema } from 'express-validator';
import { validationMiddleware } from '@wimet/api-shared';
import AuthController from '../../controllers/auth';

const signInRouter = express.Router();

/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Signin with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInBody'
 *     responses:
 *      200:
 *        description: Successfully signin
 */
signInRouter.post(
  '/',
  checkSchema({
    email: {
      isEmail: true,
      errorMessage: 'Invalid email',
      isLength: {
        errorMessage: 'Email must be between 8 and 100 characters',
        options: { min: 8, max: 100 },
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
  }),
  validationMiddleware,
  AuthController.signIn
);

/**
 * @swagger
 * /auth/sign-in/token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Signin with email and passowrd
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/tokenSignIn'
 *     responses:
 *      200:
 *        description: Successfully token token
 */
signInRouter.post(
  '/token',
  checkSchema({
    email: {
      isString: true,
      errorMessage: 'Email requerido',
    },
    password: {
      isString: true,
      errorMessage: 'Passowrd requerido',
    },
  }),
  validationMiddleware,
  AuthController.tokenSignIn
);

/**
 * @swagger
 * /auth/sign-in/social:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Signin with email and providerId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInBody'
 *     responses:
 *      200:
 *        description: Successfully social signin
 */
signInRouter.post(
  '/social',
  checkSchema({
    token: {
      isString: true,
      errorMessage: 'Token requerido',
    },
    provider: {
      isString: true,
      errorMessage: 'Provider requerido',
    },
  }),
  validationMiddleware,
  AuthController.socialSignIn
);

export default signInRouter;
