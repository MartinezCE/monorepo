import express from 'express';
import CompanyController from '../../controllers/company';

const companyUsersWPMRouter = express.Router({ mergeParams: true });
/**
 * @swagger
 * /companies/{companyId}/users-wpm:
 *   get:
 *     tags:
 *       - Companies
 *       - Untested
 *     summary: Get all users with WPM enabled or with at least 1 blueprint assigned
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: query
 *         name: isWPMEnabled
 *     responses:
 *      200:
 *        description: Successfully retrieved users
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserArray'
 */
companyUsersWPMRouter.get('/', CompanyController.getWPMUsers);

/**
 * @swagger
 * /companies/{companyId}/users-wpm:
 *   post:
 *     tags:
 *       - Companies
 *       - User
 *       - Client
 *       - WPM
 *       - Untested
 *     summary: Switch WPM status for users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                - isWPMEnabled
 *                - users
 *             properties:
 *               isWPMEnabled:
 *                 type: boolean
 *               users:
 *                 type: array
 *                 items:
 *                   type: integer
 *     parameters:
 *       - in: path
 *         name: companyId
 *     responses:
 *      200:
 *        description: Successfully switched WPM status for users
 *        content:
 *         application/json:
 *           schema:
 *              type: array
 *              items:
 *                  anyOf:
 *                      - $ref: '#/components/schemas/Number'
 *                      - $ref: '#/components/schemas/UserArray'
 */
companyUsersWPMRouter.post('/', CompanyController.switchUsersWPM);

export default companyUsersWPMRouter;
