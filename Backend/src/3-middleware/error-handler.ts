import { Request, Response, NextFunction } from 'express';
import { ErrorModel } from '../4-models/error-models';

export const errorHandler = (
  error: ErrorModel,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  res.status(status).json({ message });
};
