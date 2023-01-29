import { upload } from '@wimet/api-shared';
import express from 'express';
import CompanyController from '../../controllers/company';
import companyLocationRouter from './location';
import companyClientLocationRouter from './client-location';
import companyCollaboratorRouter from './collaborator';
import companyUsersWPMRouter from './user-wpm';
import companyBlueprintRouter from './blueprint';
import companyUsersBlueprintsRouter from './users-blueprints';
import companySeatsAmenitiesRouter from './seats-amenities';
import companyPlansRouter from './plan';
import clientValidationMiddleware from '../../middlewares/clientValidationMiddleware';
import wpmValidationMiddleware from '../../middlewares/wpmValidationMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';
import companyReservationRouter from './reservation';
import companyUsersRouter from './users';
import companyUsersAmenitiesRouter from './users-amenities';
import companyReservationRevenueRouter from './reservation-revenue';
import companyAmenitiesRouter from './amenities';
import companyTeamsRouter from './teams';

const companyRouter = express.Router();

companyRouter.get('/types', CompanyController.getCompanyTypes);
companyRouter.use('/:companyId/locations', authMiddleware, companyLocationRouter);
companyRouter.use(
  '/:companyId/client-locations',
  authMiddleware,
  clientValidationMiddleware,
  wpmValidationMiddleware,
  companyClientLocationRouter
);
companyRouter.use('/:companyId/users', authMiddleware, clientValidationMiddleware, companyUsersRouter);
companyRouter.use('/:companyId/collaborators', authMiddleware, clientValidationMiddleware, companyCollaboratorRouter);
companyRouter.use(
  '/:companyId/users-wpm',
  authMiddleware,
  clientValidationMiddleware,
  wpmValidationMiddleware,
  companyUsersWPMRouter
);
companyRouter.use('/:companyId/blueprints', authMiddleware, clientValidationMiddleware, companyBlueprintRouter);
companyRouter.use(
  '/:companyId/users-blueprints',
  authMiddleware,
  clientValidationMiddleware,
  companyUsersBlueprintsRouter
);
companyRouter.use(
  '/:companyId/users-amenities',
  authMiddleware,
  clientValidationMiddleware,
  companyUsersAmenitiesRouter
);
companyRouter.use(
  '/:companyId/seats-amenities',
  authMiddleware,
  clientValidationMiddleware,
  companySeatsAmenitiesRouter
);
companyRouter.use('/:companyId/amenities', authMiddleware, clientValidationMiddleware, companyAmenitiesRouter);
companyRouter.use('/:companyId/plans', authMiddleware, clientValidationMiddleware, companyPlansRouter);

companyRouter.use('/:companyId/reservations', authMiddleware, companyReservationRouter);

companyRouter.use('/:companyId/reservations-revenue', authMiddleware, companyReservationRevenueRouter);

companyRouter.use('/:companyId/users', authMiddleware, clientValidationMiddleware, companyUsersRouter);

companyRouter.use('/:companyId/teams', authMiddleware, clientValidationMiddleware, companyTeamsRouter);

/**
 * @swagger
 * /companies/{companyId}:
 *   get:
 *     tags:
 *       - Companies
 *       - Untested
 *     summary: Get company by id
 *     parameters:
 *       - in: path
 *         name: companyId
 *     responses:
 *      200:
 *        description: Successfully created seat by blueprint
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 */
companyRouter.get('/:companyId', CompanyController.getCompany);
/**
 * @swagger
 * /companies/{companyId}:
 *   patch:
 *     tags:
 *       - Companies
 *       - Tested
 *     summary: Update Company data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *      204:
 *        description: Successfully updated user data
 */
companyRouter.patch('/:companyId', authMiddleware, CompanyController.updateCompany);
/**
 * @swagger
 * /companies/{companyId}/avatar:
 *   patch:
 *     tags:
 *       - Companies
 *       - Tested
 *     summary: Set Company Avatar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *              companyAvatar:
 *                  type: object
 *     responses:
 *      204:
 *        description: Successfully updated company avatar
 */
companyRouter.patch(
  '/:companyId/avatar',
  authMiddleware,
  upload.single('companyAvatar'),
  CompanyController.setCompanyAvatar
);

export default companyRouter;
