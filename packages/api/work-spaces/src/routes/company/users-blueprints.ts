import express from 'express';
import CompanyController from '../../controllers/company';

const companyUsersBlueprintsRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /companies/{companyId}/users-blueprints/batch:
 *   post:
 *     tags:
 *       - Company
 *       - Blueprints
 *       - Untested
 *     summary: Set blueprints to users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                - blueprintIds
 *             properties:
 *               blueprintIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: query
 *         name: teamId
 *         schema:
 *           type: integer
 *           description: The team id to assign the blueprints to
 *     responses:
 *      200:
 *        description: Successfully set blueprints to users
 */
companyUsersBlueprintsRouter.post('/batch', CompanyController.setCompanyUsersBlueprints);

/**
 * @swagger
 * /companies/{companyId}/users-blueprints/{userId}:
 *   post:
 *     tags:
 *       - Companies
 *       - Blueprints
 *       - Untested
 *     summary: Set blueprints to users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                - blueprintIds
 *             properties:
 *               blueprintIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: query
 *         name: teamId
 *         schema:
 *           type: integer
 *           description: The team id to assign the blueprints to
 *     responses:
 *      200:
 *        description: Successfully set blueprints to user id
 */
companyUsersBlueprintsRouter.post('/:userId', CompanyController.setCompanyUserBlueprints);

export default companyUsersBlueprintsRouter;
