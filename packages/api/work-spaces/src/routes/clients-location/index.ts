import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import ClientLocationController from '../../controllers/client-location';
import accountManagerMiddleware from '../../middlewares/accountManagerMiddleware';
import floorRouter from './floor';

const locationRouter = express.Router();
/**
 * @swagger
 * /clients-location:
 *   tags:
 *    - Clients
 *    - Untested
 *   get:
 *     summary: Get clients locations
 *     responses:
 *      200:
 *        description: Successfully created client invitation
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationArray'
 */
locationRouter.get('/', accountManagerMiddleware, ClientLocationController.findAllByUser);
/**
 * @swagger
 * /clients-location/{locationId}:
 *   tags:
 *    - Clients
 *    - Untested
 *   get:
 *     summary: Get client location by id
 *     parameters:
 *       - in: path
 *         name: locationId
 *     responses:
 *      200:
 *        description: Successfully created client invitation
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 */
locationRouter.get('/:locationId', ClientLocationController.getLocation);
/**
 * @swagger
 * /clients-location/{locationId}:
 *   patch:
 *     tags:
 *       - Clients
 *       - Untested
 *     summary: Update client location
 *     parameters:
 *       - in: path
 *         name: locationId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientLocationDTO'
 *     responses:
 *      200:
 *        description: Successfully updated clients location
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 */
locationRouter.patch(
  '/:locationId',
  // checkSchema(clientLocationValidationSchema),
  validationMiddleware,
  ClientLocationController.updateClientLocation
);
locationRouter.use('/:locationId/floors', floorRouter);

export default locationRouter;
