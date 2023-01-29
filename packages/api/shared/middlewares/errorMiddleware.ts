import createHttpError from 'http-errors';
import { BaseError, EmptyResultError } from 'sequelize';
import { INTERNAL_ERROR, UNAUTHORIZED } from '../config';

export const errorMiddleware = (error: createHttpError.HttpError, req, res, _) => {
  let errorCode = error.message;
  let { status } = error;
  const messageCode = errorCode || (status === 401 ? UNAUTHORIZED : INTERNAL_ERROR);
  let message = req.polyglots[req.lang].t(messageCode);
  const { stack } = error;

  if (error instanceof BaseError) {
    errorCode = error.name;
    status = 500;
    message = error.message || message;
  }

  if (error instanceof EmptyResultError) {
    status = 404;
    message = error.message || 'Entity not found';
  }

  res.status(status || 500).json({ status, errors: [{ errorCode, message }], stack });
};
