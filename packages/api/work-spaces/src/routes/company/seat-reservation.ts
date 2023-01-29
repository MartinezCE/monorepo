import express from 'express';
import CompanyController from '../../controllers/company';

const companySeatReservationRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /companies/{companyId}/seat-reservations:
 *   get:
 *     tags:
 *       - Companies
 *       - Seat
 *       - Reservations
 *       - Untested
 *     summary: Get all Seat reservations for a company
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: query
 *         name: offset
 *       - in: query
 *         name: limit
 *     responses:
 *      200:
 *        description: Successfully retrieved seat reservations
 */
companySeatReservationRouter.get('/', CompanyController.getAllReservations);

export default companySeatReservationRouter;
