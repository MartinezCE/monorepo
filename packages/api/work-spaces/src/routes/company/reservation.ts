import express from 'express';
import CompanyController from '../../controllers/company';

const companyReservationRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /companies/{companyId}/reservations:
 *   get:
 *     tags:
 *       - Companies
 *       - Reservations
 *       - Untested
 *     summary: Get all reservations for a company
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: query
 *         name: offset
 *       - in: query
 *         name: limit
 *     responses:
 *      200:
 *        description: Successfully retrieved reservations
 */
companyReservationRouter.get('/', CompanyController.getAllReservations);

export default companyReservationRouter;
