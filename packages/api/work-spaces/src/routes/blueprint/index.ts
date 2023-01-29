import { upload } from '@wimet/api-shared';
import express from 'express';
import BlueprintController from '../../controllers/blueprint';
import seatRouter from './seat';

const blueprintRouter = express.Router({ mergeParams: true });

blueprintRouter.use('/:blueprintId/seats', seatRouter);

blueprintRouter.get('/:blueprintId/reservations-users', BlueprintController.getReservationsUsers);

/**
 * @swagger
 * /blueprints/{blueprintId}:
 *   post:
 *     tags:
 *       - Blueprints
 *       - Untested
 *     summary: Delete blueprint by id
 *     parameters:
 *       - in: path
 *         name: blueprintId
 *         required: true
 *     responses:
 *      204:
 *        description: Successfully deleted blueprint
 */
blueprintRouter.delete('/:blueprintId', BlueprintController.removeByUser);

/**
 * @swagger
 * /blueprints/{blueprintId}:
 *   patch:
 *     tags:
 *       - Blueprints
 *       - Blueprint
 *     summary: Update blueprint by id
 *     parameters:
 *       - in: path
 *         name: blueprintId
 *         required: true
 *     responses:
 *      200:
 *        description: Successfully blueprint update
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Blueprint'
 */
blueprintRouter.patch('/:blueprintId', upload.single('blueprint'), BlueprintController.updateByUser);

/**
 * @swagger
 * /blueprints/{blueprintId}/setusers:
 *   post:
 *     tags:
 *       - Blueprints
 *       - Blueprint
 *     summary: Associate blueprint to users
 *     parameters:
 *       - in: path
 *         name: blueprintId
 *         required: true
 *     responses:
 *      200:
 *        description: Successfully blueprint update
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Blueprint'
 */
blueprintRouter.post('/:blueprintId/setusers', BlueprintController.setUsers);

/**
 * @swagger
 * /blueprints/{blueprintId}/getusers:
 *   get:
 *     tags:
 *       - Blueprints
 *       - Blueprint
 *     summary: List users from blueprint
 *     parameters:
 *       - in: path
 *         name: blueprintId
 *         required: true
 *     responses:
 *      200:
 *        description: Successfully get list users from blueprint
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Blueprint'
 */
blueprintRouter.get('/:blueprintId/getusers', BlueprintController.getUsers);

/**
 * @swagger
 * /blueprints/{blueprintId}/removeusers/{userId}:
 *   patch:
 *     tags:
 *       - Blueprints
 *       - Blueprint
 *     summary: List users from blueprint
 *     parameters:
 *       - in: path
 *         name: blueprintId
 *         required: true
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *      200:
 *        description: Successfully remove user from blueprint
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Blueprint'
 */
blueprintRouter.delete('/:blueprintId/removeusers/:userId', BlueprintController.removeUser);

export default blueprintRouter;
