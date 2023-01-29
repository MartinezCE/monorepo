import express from 'express';
import CompanyController from '../../controllers/company';

const companySeatsAmenitiesRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /companies/{companyId}/seats-amenities:
 *   get:
 *     tags:
 *       - Company
 *       - Seat
 *       - Amenity
 *     summary: Get seats amenities by company
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: query
 *         name: blueprintId
 *         schema:
 *           type: integer
 *         description: Blueprint ID to filter by (optional)
 *     responses:
 *      200:
 *        description: Successfully get seats amenities by company
 */
companySeatsAmenitiesRouter.get('/', CompanyController.getSeatAmenities);

export default companySeatsAmenitiesRouter;
