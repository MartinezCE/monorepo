import express from 'express';
import AmenityController from '../../controllers/amenity';

const amenitiesRouter = express.Router();

amenitiesRouter.get('/', AmenityController.getAmenitiesByType);
/**
 * @swagger
 * /amenities:
 *   post:
 *     tags:
 *       - Amenities
 *     summary: Find or create amenity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Name'
 *     responses:
 *      200:
 *        description: Successfully returned amenity
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Amenity'
 */
amenitiesRouter.post('/', AmenityController.createAmentiy);

export default amenitiesRouter;
