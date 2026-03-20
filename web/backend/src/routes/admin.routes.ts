import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';

const router = Router();

/**
 * GET /api/v1/admin/policy-stats
 * Retrieve system-wide policy statistics for admin dashboard.
 * Returns: totalActive, totalProtectionPot, pendingApprovals, avgLossRatio
 */
router.get('/policy-stats', adminController.getPolicyStats);

/**
 * GET /api/v1/admin/risk-heatmap
 * Retrieve city-level risk heatmap data.
 * Returns: Array of city risk data with risk levels, active policies, claims, and payouts
 */
router.get('/risk-heatmap', adminController.getRiskHeatmap);

/**
 * GET /api/v1/admin/city-risk (legacy endpoint)
 * Retrieve city-level risk heatmap data.
 */
router.get('/city-risk', adminController.getRiskHeatmap);

/**
 * GET /api/v1/admin/policies
 * Retrieve all policies with optional status filter.
 * Query params: status (optional) - 'Active', 'Pending', or 'Expired'
 */
router.get('/policies', adminController.getPolicies);

/**
 * GET /api/v1/admin/policies/:id
 * Retrieve a specific policy by ID.
 */
router.get('/policies/:id', adminController.getPolicyById);

/**
 * PATCH /api/v1/admin/policies/:id
 * Update policy status.
 * Body: { status: 'Active' | 'Pending' | 'Expired' }
 */
router.patch('/policies/:id', adminController.updatePolicyStatus);

/**
 * GET /api/v1/admin/fraud-alerts
 * Retrieve claims flagged as fraudulent or requiring review.
 */
router.get('/fraud-alerts', adminController.getClaims);

router.get('/claims', adminController.getClaims);

/**
 * GET /api/v1/admin/claims/:id
 * Retrieve a specific claim by ID.
 */
router.get('/claims/:id', adminController.getClaimById);

/**
 * PATCH /api/v1/admin/claims/:id
 * Review a claim (approve or reject).
 * Body: { action: 'approve' | 'reject', reviewedBy: string, reviewNotes?: string }
 */
router.patch('/claims/:id', adminController.reviewClaim);

export default router;
