import express from 'express';
import CompanyController from '../../controllers/company';

const companyReservationRevenueRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /companies/{companyId}/reservations-revenue:
 *   get:
 *     tags:
 *       - Companies
 *       - Reservations
 *       - Revenue
 *       - Untested
 *     summary: Get reservations revenue for a company
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: query
 *         name: from
 *         schema:
 *           type: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: date
 *     responses:
 *      200:
 *        description: Successfully retrieved reservations revenue
 */
companyReservationRevenueRouter.get('/', CompanyController.getAllReservationsRevenue);

/**
 * @swagger
 * /companies/{companyId}/reservations-revenue/clients:
 *   get:
 *     tags:
 *       - Companies
 *       - Reservations
 *       - Revenue
 *       - Untested
 *     summary: Get reservations for a company
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: query
 *         name: from
 *         schema:
 *           type: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: date
 *     responses:
 *      200:
 *        description: Successfully reservations from company
 */
companyReservationRevenueRouter.get('/clients', CompanyController.getAllReservationsClients);

export default companyReservationRevenueRouter;
