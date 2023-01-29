import Polyglot from 'node-polyglot';
import UserModel from '../db/models/User';

declare global {
  namespace Express {
    interface Request {
      polyglots: { [key: string]: Polyglot };
      lang: string;
      timezone: string;
    }

    interface User extends Partial<Omit<UserModel, 'validatePassword'>> {
      id: number;
      fromMiddleware?: boolean;
    }
  }
}
