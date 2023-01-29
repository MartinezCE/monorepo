import express from 'express';
import LocationController from '../../controllers/location';

const seatsRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /locations/{locationId}/seats/availability:
 *   get:
 *     tags:
 *       - Locations
 *     summary: Get seats by location
 *     parameters:
 *       - in: path
 *         name: locationId
 *     responses:
 *       200:
 *         description: Successfully returned seats by location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSeats:
 *                    type: integer
 *                    description: Count of total seats.
 *                    example: 0
 *                 seatsAvailable:
 *                    type: integer
 *                    description: Count of seats available.
 *                    example: 0
 */
seatsRouter.get('/availability', LocationController.getSeatsByLocation);

export default seatsRouter;
