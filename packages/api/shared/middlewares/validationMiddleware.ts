import { NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validationMiddleware = (req, res, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return next();
};
