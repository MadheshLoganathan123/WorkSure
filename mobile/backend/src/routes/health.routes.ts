import { Router, Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

/**
 * GET /health
 * Returns system status with standard response format.
 */
router.get('/', (_req: Request, res: Response) => {
  const response = ApiResponse.success(
    {
      status: 'operational',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    'System is healthy'
  );

  res.status(response.code).json(response);
});

export default router;
