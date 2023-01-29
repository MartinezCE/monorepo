import express from 'express';
import './extensions';
import passport from 'passport';
import { errorMiddleware, configSession, configPolyglots } from '@wimet/api-shared';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSdoc from 'swagger-jsdoc';
import { queryParser } from 'express-query-parser';
import routes from './routes';
import database from './db';
import './db/models';
import { messages } from './config/messages';
import { umzug } from './db/database';
import logger from './helpers/logger';
import './services/cron';
import { configPassport } from './utils/configPassport';

dotenv.config();

const app = express();
const loggerInstance = logger('start-app');
app.use(
  cors({
    origin: [
      'http://localhost:2999',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3003',
      'wimet.co',
      'https://wimet.co',
      'https://wimet-mkt-site.vercel.app',
      /\.wimet\.co$/,
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-timezone'],
    exposedHeaders: ['x-timezone'],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(queryParser({ parseNull: true, parseUndefined: true, parseBoolean: true, parseNumber: true }));

app.use((req, _, next) => {
  req.timezone = req.get('x-timezone') as string;
  next();
});

app.use((req, _, next) => {
  const sessionId = `connect.sid.${process.env.NODE_ENV}`;
  const cookies = ((req.headers.cookie || '') as string).split(';');
  const lastSid = cookies.map(c => c.includes(sessionId)).lastIndexOf(true);
  const cleanCookies = cookies.filter(c => !c.includes(sessionId));

  if (cookies[lastSid]) {
    cleanCookies.push(cookies[lastSid]);
  }

  req.headers.cookie = cleanCookies.join(';');

  next();
});

configPassport(passport);
configSession(app, passport);
configPolyglots(app, messages);

const { version } = require('../package.json');

const swaggerSpec = swaggerJSdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Workspaces API',
      version,
      description: 'Workspaces API that works as the monolithic MVP application for Wimet',
    },
  },
  apis: ['**/*.ts', './swagger-docs.yaml'],
});

if (process.env.NODE_ENV === 'development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api-docs.json', (_, res) => res.json(swaggerSpec));
}

app.use(routes);

app.use(errorMiddleware);

umzug
  .up()
  .then(() => {
    database
      .sync()
      .then(() => {
        app.listen(process.env.PORT || 3000, () => {
          database
            .query(`SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))`, { raw: true })
            .then(() => {
              loggerInstance.info(`Application started on port ${process.env.PORT || 3000}!`);
            });
          // eslint-disable-next-line no-console
        });
      })
      .catch(error => {
        loggerInstance.error('There was an error connecting with database', error);
      });
  })
  .catch(error => {
    loggerInstance.error('There was an error running migrations', error);
  });

process.once('SIGUSR2', () => {
  process.kill(process.pid, 'SIGUSR2');
});
