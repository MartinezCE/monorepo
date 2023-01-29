import express from 'express';
import CompanyController from '../../controllers/company';

const companyUsersAmenitiesRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /companies/{companyId}/users-amenities/{userId}:
 *   post:
 *     tags:
 *       - Companies
 *       - Amenities
 *       - Untested
 *     summary: Set amenities to users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                - amenitiesIds
 *             properties:
 *               amenitiesIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: path
 *         name: userId
 *     responses:
 *      200:
 *        description: Successfully set amenities to user id
 */
companyUsersAmenitiesRouter.post('/:userId', CompanyController.setCompanyUserAmenities);

export default companyUsersAmenitiesRouter;
