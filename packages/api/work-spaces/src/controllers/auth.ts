/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import passport from 'passport';
import { INVALID_USER_CREDENTIALS, USER_NOT_FOUND } from '../config/errorCodes';
import Company from '../db/models/Company';
import User, { UserInput } from '../db/models/User';
import UserType from '../db/models/UserType';
import { SignUpDTO } from '../dto/auth';
import logger from '../helpers/logger';
import { decryptText, encryptText, parseEncryptedText, stringifyEncryptedText } from '../helpers/crypto';
import AuthService from '../services/auth';
import EmailServie from '../services/email';
import UserController from './user';
import UserService from '../services/user';
import GoogleAuthService from '../services/google';
import { encrypt } from '../utils/encryptor';

const loggerInstance = logger('auth-controller');

export default class AuthController {
  static async login(req: Request<unknown>, res: Response, next: NextFunction, user: User) {
    return req.logIn(user, e => {
      if (e) return next(e);
      loggerInstance.info(`Signin user with userId: ${user.id} successful`);
      return res.status(200).json(UserController.addProfileUrl(user));
    });
  }

  static async signUp(req: Request<unknown, unknown, SignUpDTO>, res: Response, next: NextFunction, id: number) {
    const user = await User.findByPk(id, { include: [Company, UserType] });
    return AuthController.login(req, res, next, user);
  }

  static async signUpPartner(req: Request<unknown, unknown, SignUpDTO>, res: Response, next: NextFunction) {
    try {
      loggerInstance.info(`Signing up partner with email: ${req.body.email}`);
      const newUser = await AuthService.signUpPartner(req.body);
      loggerInstance.info(`New partner created with id: ${newUser.id}`);
      return await AuthController.signUp(req, res, next, newUser.id);
    } catch (error) {
      loggerInstance.error('There was an error creating the partner and the company', error);

      next(error);
    }
  }

  static async signUpClient(req: Request<unknown, unknown, SignUpDTO>, res: Response, next: NextFunction) {
    loggerInstance.info(`Signing up client with email: ${req.body.email}`);
    try {
      const newUser = await AuthService.signUpClient(req.body);
      loggerInstance.info(`User created successfully with id: ${newUser.id}`);
      return await AuthController.signUp(req, res, next, newUser.id);
    } catch (error) {
      loggerInstance.error('There was an error creating the client and the company', error);
      next(error);
    }
  }

  static async signIn(req: Request<unknown, unknown, UserInput>, res: Response, next: NextFunction) {
    return passport.authenticate('local', (error, user) => {
      if (error) return next(error);
      if (!user) return next(createHttpError(401, INVALID_USER_CREDENTIALS));

      return AuthController.login(req, res, next, user);
    })(req, res, next);
  }

  static async signOut(req: Request<unknown, unknown>, res: Response) {
    req.logOut();
    loggerInstance.info('User logout completed');
    res.status(200).json({ message: 'Successfully signed out' });
  }

  static async passwordRecoveryRequest(req: Request<unknown>, res: Response, next: NextFunction) {
    try {
      const user = await User.findOne({ where: { email: req.body.email } });

      if (!user) {
        throw createHttpError(404, USER_NOT_FOUND);
      }

      const encrypteUserId = encryptText(user.id.toString());

      await EmailServie.send(
        'password_recovery',
        {
          username: user.firstName,
          frontUrl: process.env.REGISTER_BASE_URL,
          registerBaseUrl: process.env.REGISTER_BASE_URL,
          hashedId: stringifyEncryptedText(encrypteUserId),
        },
        [user.email]
      );

      res.status(200).send({});
    } catch (error) {
      loggerInstance.error('There was an error finding the user that requested the password recovery', error);
      next(error);
    }
  }

  static async updatePassword(req: Request<unknown>, res: Response, next: NextFunction) {
    try {
      const parsedUserId = parseEncryptedText(req.body.token);
      const decryptedUserId = decryptText(parsedUserId);

      const user = await User.findOne({ where: { id: decryptedUserId }, include: [Company, UserType] });

      await UserService.setUser(user.id, {
        ...user,
        password: req.body.password as User['password'],
      });

      await AuthController.login(req, res, next, user);
    } catch (error) {
      loggerInstance.error('There was an error updating the user password', error);
      next(error);
    }
  }

  static async tokenSignIn(req: Request<unknown>, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await UserService.getUserByEmail(email);

      const isPasswordValid = await user?.validatePassword(password.toString());

      if (!user || !isPasswordValid) {
        loggerInstance.error('There was an error sign in token, the credentials does not match');
        throw new Error('There was an error sign in token, the credentials does not match');
      }

      const hashedPassword = encrypt(user.id, user.email);

      loggerInstance.info(`Signin user with userId: ${user.id} successful with token`);
      return res.status(200).json({ token: hashedPassword });
    } catch (error) {
      console.log('error', error);
      loggerInstance.error('There was an error sign in token', error);
      next(error);
    }
  }

  static async socialSignIn(req: Request<unknown>, res: Response, next: NextFunction) {
    try {
      const { token, provider } = req.body;
      const providerId = await GoogleAuthService.getUserData(token);
      const user = await UserService.findByProviderId(provider, providerId);
      const hashedPassword = encrypt(user.id, user.email);

      loggerInstance.info(`Signin user with userId: ${user.id} successful with token social sign in`);
      return res.status(200).json({ token: hashedPassword });
    } catch (error) {
      loggerInstance.error('There was an error sign in social', error);
      next(error);
    }
  }
}
