import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /health
 * Simple health check endpoint.
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'WorkSure Web Admin API',
    timestamp: new Date().toISOString(),
  });
});

export default router;
