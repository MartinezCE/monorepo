import express from 'express';
import { UserRoleEnum } from '../../common/enum/user';
import GoogleAuthController from '../../controllers/google';
import roleValidationMiddleware from '../../middlewares/roleValidationMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';

const googleAuthRouter = express.Router();

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags:
 *       - Auth
 *       - Untested
 *     summary: Authenticate with Google
 *     parameters:
 *       - in: query
 *         name: state
 *         required: true
 *     responses:
 *      200:
 *        description: Successfully authenticated with Google
 */
googleAuthRouter.get('/google', GoogleAuthController.authenticate);

/**
 * @swagger
 * /auth/google/resources:
 *   get:
 *     tags:
 *       - Auth
 *       - Untested
 *     summary: Authenticate with Google GSuite
 *     parameters:
 *       - in: query
 *         name: state
 *         required: true
 *     responses:
 *      200:
 *        description: Successfully authenticated with Google
 */
googleAuthRouter.get(
  '/google/resources',
  authMiddleware,
  roleValidationMiddleware([UserRoleEnum.ACCOUNT_MANAGER]),
  GoogleAuthController.authenticateGSuite
);

/**
 * @swagger
 * /auth/callback:
 *   get:
 *     tags:
 *       - Auth
 *       - Untested
 *     summary: Callback to authenticate with Google
 *     responses:
 *      200:
 *        description: Successfully redirected
 */
googleAuthRouter.get('/callback', GoogleAuthController.redirect);

/**
 * @swagger
 * /auth/callback-gsuite:
 *   get:
 *     tags:
 *       - Auth
 *       - Untested
 *     summary: Callback to authenticate with Google GSuite
 *     responses:
 *      200:
 *        description: Successfully redirected
 */
googleAuthRouter.get(
  '/callback-gsuite',
  authMiddleware,
  roleValidationMiddleware([UserRoleEnum.ACCOUNT_MANAGER]),
  GoogleAuthController.redirectGSuite
);

export default googleAuthRouter;
