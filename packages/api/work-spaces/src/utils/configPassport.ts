import { INTERNAL_ERROR } from '@wimet/api-shared';
import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy, StrategyOptionsWithRequest } from 'passport-google-oauth20';
import createHttpError from 'http-errors';
import UserService from '../services/user';
import { GOOGLE_AUTH_USER_ERROR, INVALID_USER } from '../config/errorCodes';
import GoogleAuthService from '../services/google';
import logger from '../helpers/logger';
import CompanyService from '../services/company';

export const configPassport = (passport: PassportStatic) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        const user = await UserService.getUserByAuth(username, password);

        if (!user) {
          logger('passport-local').error('Error authenticating user: invalid user');
          return done(createHttpError(404, INVALID_USER), false);
        }

        return done(null, user.get({ plain: true }));
      } catch (e) {
        logger('passport-local').error('Error authenticating user', e.message);
        return done(createHttpError.isHttpError(e) ? e : createHttpError(500, INTERNAL_ERROR), false);
      }
    })
  );

  const defaultGoogleConfig: StrategyOptionsWithRequest = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    passReqToCallback: true,
  };

  passport.use(
    'google',
    new GoogleStrategy(
      {
        ...defaultGoogleConfig,
        callbackURL: `${process.env.API_BASE_URL}/auth/callback`,
        scope: ['profile', 'email', 'https://www.googleapis.com/auth/user.phonenumbers.read'],
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const state = req.query.state?.toString();
          const payload = state ? JSON.parse(Buffer.from(state, 'base64').toString('ascii')) : null;
          const user = await GoogleAuthService.auth(payload, accessToken, refreshToken, profile);

          if (!user) {
            return done(createHttpError(404, GOOGLE_AUTH_USER_ERROR), null);
          }

          return done(null, user.get({ plain: true }));
        } catch (e) {
          logger('google-local').error('Error authenticating user with Google', e);
          return done(createHttpError.isHttpError(e) ? e : INTERNAL_ERROR, null);
        }
      }
    )
  );

  passport.use(
    'google-gsuite',
    new GoogleStrategy(
      {
        ...defaultGoogleConfig,
        callbackURL: `${process.env.API_BASE_URL}/auth/callback-gsuite`,
        scope: [
          'profile',
          'email',
          'https://www.googleapis.com/auth/user.phonenumbers.read',
          'https://www.googleapis.com/auth/admin.directory.resource.calendar',
          'https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly',
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events',
        ],
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const user = await UserService.getUserById(req.user.id);
          const company = await CompanyService.findCompanyByUserId(user.id);
          await CompanyService.addAdminAuthProvider(
            company.id,
            company.adminProviders,
            'google',
            profile.id,
            refreshToken
          );

          if (!user || !company) {
            return done(createHttpError(404, GOOGLE_AUTH_USER_ERROR), null);
          }

          return done(null, user.get({ plain: true }));
        } catch (e) {
          logger('google-local').error('Error authenticating user with Google GSuite', e);
          return done(createHttpError.isHttpError(e) ? e : INTERNAL_ERROR, null);
        }
      }
    )
  );

  passport.serializeUser(({ id }, done) => done(null, { id }));
};
