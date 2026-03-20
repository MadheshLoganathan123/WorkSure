import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ApiResponse } from '../utils/ApiResponse';

/**
 * Global error handler middleware.
 * Catches all errors thrown in controllers or middleware and returns a standardized JSON response.
 */
export const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`Error: ${message}`, { statusCode, stack: err.stack });

  if (err.details) {
    res.status(statusCode).json({
      success: false,
      message,
      code: statusCode,
      details: err.details,
    });
    return;
  }

  const response = ApiResponse.error(message, statusCode);
  res.status(response.code).json(response);
};
