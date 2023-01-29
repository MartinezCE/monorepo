import express from 'express';
import CompanyController from '../../controllers/company';
import accountManagerMiddleware from '../../middlewares/accountManagerMiddleware';

const companyBlueprintRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /companies/{companyId}/blueprints:
 *   get:
 *     tags:
 *       - Companies
 *       - Blueprints
 *       - Untested
 *     summary: Get all blueprints for a company
 *     parameters:
 *       - in: path
 *         name: companyId
 *     responses:
 *      200:
 *        description: Successfully retrieved users
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlueprintArray'
 */
companyBlueprintRouter.get('/', accountManagerMiddleware, CompanyController.getCompanyBlueprints);

export default companyBlueprintRouter;
