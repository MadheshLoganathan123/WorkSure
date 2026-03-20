import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import logger from '../utils/logger';

/**
 * Global error-handling middleware.
 * Must be registered AFTER all routes so it catches unhandled errors.
 * Surfaces validation details when available (from validate.middleware).
 */
export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = (err as any).statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal Server Error'
      : err.message || 'Something went wrong';

  logger.error(`${statusCode} - ${err.message} - ${err.stack}`);

  const response: any = new ApiResponse(statusCode, message);

  // Attach validation error details when present
  if ((err as any).details) {
    response.data = { errors: (err as any).details };
  }

  res.status(response.code).json(response);
};
