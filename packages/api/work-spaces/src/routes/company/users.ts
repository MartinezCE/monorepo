import express from 'express';
import CompanyController from '../../controllers/company';

const companyUsersRouter = express.Router({ mergeParams: true });
/**
 * @swagger
 * /companies/{companyId}/users/{userId}:
 *   delete:
 *     tags:
 *       - Companies
 *       - Users
 *       - Untested
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: path
 *         name: userId
 *     summary: Remove user from company by companyId and userId
 *     responses:
 *      200:
 *        description: Successfully removed user from company
 */
companyUsersRouter.delete('/:userId', CompanyController.removeUser);
/**
 * @swagger
 * /companies/{companyId}/users:
 *   get:
 *     tags:
 *       - Companies
 *       - Untested
 *     summary: Get list of users by companyId
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: query
 *         name: havePlans
 *     responses:
 *      200:
 *        description: Successfully getted users by company
 */
companyUsersRouter.get('/', CompanyController.getAllUsers);

export default companyUsersRouter;
