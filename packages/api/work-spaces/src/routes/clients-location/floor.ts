import express from 'express';
import ClientLocationController from '../../controllers/client-location';

const floorRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /clients-location/{locationId}/floors:
 *   post:
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
floorRouter.post('/', ClientLocationController.createLocationFloor);

export default floorRouter;
