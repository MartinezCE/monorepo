import express from 'express';
import CompanyController from '../../controllers/company';

const companyCollaboratorRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /companies/{companyId}/collaborators:
 *   get:
 *     tags:
 *       - Companies
 *       - Untested
 *     summary: Get list of collaborators by companyId
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: query
 *         name: limit
 *       - in: query
 *         name: offset
 *     responses:
 *      200:
 *        description: Successfully created seat by blueprint
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CollaboratorsByCompany'
 */
companyCollaboratorRouter.get('/', CompanyController.getCompanyCollaborators);

/**
 * @swagger
 * /companies/{companyId}/collaborators/{collaboratorId}:
 *   get:
 *     tags:
 *       - Companies
 *       - Collaborator
 *       - Untested
 *     summary: Get de detail of a Collaborator
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: path
 *         name: collaboratorId
 *     responses:
 *      200:
 *        description: Successfully get collaborator by companyId and collaboratorId
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CollaboratorByCompany'
 */
companyCollaboratorRouter.get('/:collaboratorId', CompanyController.getCompanyCollaborator);

/**
 * @swagger
 * /companies/{companyId}/collaborators/{collaboratorId}:
 *   delete:
 *     tags:
 *       - Companies
 *       - Collaborator
 *       - Untested
 *     summary: Delete a collaborator
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: path
 *         name: collaboratorId
 *     responses:
 *      200:
 *        description: Successfully collaborator delete
 */
companyCollaboratorRouter.delete('/:collaboratorId', CompanyController.deleteCompanyCollaborator);

export default companyCollaboratorRouter;
