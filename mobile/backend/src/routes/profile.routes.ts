import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { createProfileSchema } from '../schemas/profile.schema';
import * as profileController from '../controllers/profile.controller';

const router = Router();

/**
 * POST /api/v1/profile
 * Creates a new worker profile after validating against the Zod schema.
 */
router.post('/', validate(createProfileSchema, 'body'), profileController.createProfile);

/**
 * GET /api/v1/profile/:userId
 * Retrieves a worker profile by user ID.
 */
router.get('/:userId', profileController.getProfile);

export default router;
