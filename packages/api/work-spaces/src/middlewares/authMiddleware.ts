import { dencrypt } from '../utils/encryptor';

export const authMiddleware = (req, _, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  if (req.get('Authorization')) {
    req.user = dencrypt(req.get('Authorization'));
    return next();
  }
  throw { status: 401 };
};
