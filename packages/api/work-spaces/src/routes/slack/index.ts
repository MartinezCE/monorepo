import express from 'express';
import SlackController from '../../controllers/slack';

const slackRouter = express.Router();
/**
 * @swagger
 * /slack/aproved/:userId:
 *   tags:
 *    - Slack
 *   get:
 *     summary: Aproved de user
 *     responses:
 *      200:
 *        description: Aproved de user
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/aproved'
 */
slackRouter.get('/aproved/:userId', SlackController.aprovedClient);
/**
 * @swagger
 * /slack/aproved-wpm/:userId:
 *   tags:
 *    - Slack
 *   get:
 *     summary: Aproved de user
 *     responses:
 *      200:
 *        description: Aproved de user
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/aproved'
 */
slackRouter.get('/aproved-wpm/:userId', SlackController.aprovedClientWPM);
slackRouter.post('/ping', SlackController.ping);

export default slackRouter;
