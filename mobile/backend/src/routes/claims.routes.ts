import { Router } from 'express';
import * as claimsController from '../controllers/claims.controller';

const router = Router();

/**
 * GET /api/v1/claims/history
 * Retrieve all claims for a user.
 * Query params: userId (required)
 */
router.get('/history', claimsController.getClaimHistory);

/**
 * POST /api/v1/claims/trigger
 * Manually trigger a claim check for a user based on current weather.
 * Body: { userId }
 */
router.post('/trigger', claimsController.triggerClaim);

/**
 * POST /api/v1/claims/approve
 * Approve a pending claim (internal endpoint).
 * Body: { claimId, userId }
 */
router.post('/approve', claimsController.approveClaim);

/**
 * POST /api/v1/claims/pay
 * Pay an approved claim and credit user's wallet.
 * Body: { claimId, userId }
 */
router.post('/pay', claimsController.payClaim);

export default router;
