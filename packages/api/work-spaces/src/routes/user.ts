import { upload } from '@wimet/api-shared';
import express from 'express';
import UserController from '../controllers/user';
import meRouter from './me';

const userRouter = express.Router();

/**
 * @swagger
 * /user/reservations:
 *   get:
 *     tags:
 *       - User
 *     summary: Get User reservations
 *     responses:
 *      200:
 *        description: Successfully retrieved user reservations
 */
userRouter.get('/reservations', UserController.getReservations);

/**
 * @swagger
 * /user/me:
 *   get:
 *     tags:
 *       - User
 *     summary: Get User data
 *     responses:
 *      200:
 *        description: Successfully getted user data
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.use('/me', meRouter);

/**
 * @swagger
 * /user/plan:
 *   get:
 *     tags:
 *       - User
 *     summary: Get User plan
 *     responses:
 *      200:
 *        description: Successfully getted user plan data
 */
userRouter.get('/plan', UserController.getUserPlan);
/**
 * @swagger
 * /user:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update User data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *      204:
 *        description: Successfully updated user data
 */
userRouter.patch('/', UserController.updateUser);
/**
 * @swagger
 * /user/avatar:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update User Avatar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *              userAvatar:
 *                  type: object
 *     responses:
 *      204:
 *        description: Successfully updated user avatar
 */
userRouter.patch('/avatar', upload.single('userAvatar'), UserController.setUserAvatar);

userRouter.put('/role', UserController.updateUserRole);

/**
 * @swagger
 * /user/plan:
 *   put:
 *     tags:
 *       - User
 *     summary: Update User plan
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *              userPlanId:
 *                  type: number
 *              userId:
 *                  type: number
 *     responses:
 *      204:
 *        description: Successfully updated user avatar
 */
userRouter.put('/plan', UserController.updateUserPlan);

export default userRouter;
