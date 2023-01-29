import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema } from 'express-validator';
import { clientsInviteValidationSchema } from '../../common/validation/client-invitation';
import ClientInvitationController from '../../controllers/client-invitation';

const clientsInviteRouter = express.Router();
/**
 * @swagger
 * /clients-invitation:
 *   post:
 *     tags:
 *       - Clients
 *     summary: Create client invitation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostClientInvitation'
 *           required:
 *             - companyId
 *             - emails
 *     responses:
 *      200:
 *        description: Successfully created client invitation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ClientInvitationResponse'
 */
clientsInviteRouter.post(
  '/',
  checkSchema(clientsInviteValidationSchema),
  validationMiddleware,
  ClientInvitationController.createClientInvitations
);

/**
 * @swagger
 * /clients-invitation/{invitationId}:
 *   delete:
 *     tags:
 *       - Client invitations
 *     parameters:
 *       - in: path
 *         name: invitationId
 *     summary: Remove client invitation by id
 *     responses:
 *      200:
 *        description: Successfully removed client invitation
 */
clientsInviteRouter.delete('/:invitationId', validationMiddleware, ClientInvitationController.removeClientInvitation);

export default clientsInviteRouter;
