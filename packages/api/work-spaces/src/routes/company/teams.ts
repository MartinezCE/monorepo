import express from 'express';
import CompanyController from '../../controllers/company';

const companyUsersRouter = express.Router({ mergeParams: true });
/**
 * @swagger
 * /companies/{companyId}/teams:
 *   get:
 *     tags:
 *       - Company
 *     parameters:
 *       - in: path
 *         name: companyId
 *     summary: Retrieves all the teams asociated to a company
 *     responses:
 *      200:
 *        description: Successfully retrieved company teams
 */
companyUsersRouter.get('/', CompanyController.getTeams);

/**
 * @swagger
 * /companies/{companyId}/teams:
 *   post:
 *     tags:
 *       - Company
 *     summary: Creates a team asociated to a company
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Team'
 *             required:
 *                - name
 *     responses:
 *      200:
 *        description: Successfully created team by company
 */
companyUsersRouter.post('/', CompanyController.createTeam);

/**
 * @swagger
 * /companies/{companyId}/teams/{teamId}:
 *   get:
 *     tags:
 *       - Company
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *       - in: path
 *         name: teamId
 *         required: true
 *     summary: Retrieves one specific team
 *     responses:
 *      200:
 *        description: Successfully retrieved team
 */
companyUsersRouter.get('/:teamId', CompanyController.getTeam);

companyUsersRouter.patch('/:teamId', CompanyController.updateTeam);

/**
 * @swagger
 * /companies/{companyId}/teams/{teamId}/credits:
 *   post:
 *     tags:
 *       - Company
 *     summary: Creates a plan asociated to a team
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *       - in: path
 *         name: teamId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamCredits'
 *             required:
 *                - credits
 *     responses:
 *      200:
 *        description: Successfully created cretdits for your team
 */
companyUsersRouter.post('/:teamId/credits', CompanyController.createTeamPlanCredits);

export default companyUsersRouter;
