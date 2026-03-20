import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';
import * as monitoringController from '../controllers/monitoring.controller';

const router = Router();

// GET /api/v1/weather/monitoring?city=Delhi
const monitoringQuerySchema = z.object({
  city: z.string().min(1).optional(),
});

router.get('/monitoring', validate(monitoringQuerySchema, 'query'), monitoringController.getMonitoring);

export default router;

