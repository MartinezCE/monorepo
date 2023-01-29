import { INTERNAL_ERROR } from '@wimet/api-shared';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { AuthenticateOptionsGoogle } from 'passport-google-oauth20';
import { GOOGLE_AUTH_USER_ERROR } from '../config/errorCodes';
import logger from '../helpers/logger';

const loggerInstance = logger('google-auth-service');
const opts: AuthenticateOptionsGoogle = { accessType: 'offline', prompt: 'consent' };

export default class GoogleAuthController {
  static async authenticate(
    req: Request<unknown, unknown, unknown, { state: string }>,
    res: Response,
    next: NextFunction
  ) {
    return passport.authenticate('google', { ...opts, state: req.query.state })(req, res, next);
  }

  static async authenticateGSuite(
    req: Request<unknown, unknown, unknown, { state: string }>,
    res: Response,
    next: NextFunction
  ) {
    return passport.authenticate('google-gsuite' as 'google', { ...opts, state: req.query.state })(req, res, next);
  }

  static sendResponseScript(res: Response, msg: { code: string; message?: string }) {
    return res.send(`
      <script>
        window.opener.postMessage(${JSON.stringify(msg)}, "*");
        window.close();
      </script>
    `);
  }

  static sendErrorResponseScript(req: Request<unknown>, res: Response, error: Error) {
    loggerInstance.error(`An error ocurred authenticating with Google`, error);
    return GoogleAuthController.sendResponseScript(res, {
      code: 'auth-fail',
      message: req.polyglots[req.lang].t(error?.message || GOOGLE_AUTH_USER_ERROR, {
        _: req.polyglots[req.lang].t(INTERNAL_ERROR),
      }),
    });
  }

  static commonRedirect(strategy: string, options?: AuthenticateOptionsGoogle, loginOpts?: unknown) {
    return async (req: Request<unknown, unknown>, res: Response, next: NextFunction) =>
      passport.authenticate(strategy as 'google', { ...opts, ...options }, (error, user) => {
        if (!user || error) return GoogleAuthController.sendErrorResponseScript(req, res, error);

        return req.logIn(user, loginOpts, err => {
          if (err) return GoogleAuthController.sendErrorResponseScript(req, res, error);
          return GoogleAuthController.sendResponseScript(res, { code: 'auth-success' });
        });
      })(req, res, next);
  }

  static async redirect(req: Request<unknown, unknown>, res: Response, next: NextFunction) {
    return GoogleAuthController.commonRedirect('google')(req, res, next);
  }

  static async redirectGSuite(req: Request<unknown, unknown>, res: Response, next: NextFunction) {
    return GoogleAuthController.commonRedirect('google-gsuite', { session: false }, { session: false })(req, res, next);
  }
}
