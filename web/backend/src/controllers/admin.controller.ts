import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import * as adminService from '../services/admin.service';

/**
 * GET /api/v1/admin/policy-stats
 * Retrieve system-wide policy statistics for admin dashboard.
 */
export const getPolicyStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await adminService.getPolicyStats();
    const response = ApiResponse.success(stats, 'Policy statistics retrieved successfully');
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/risk-heatmap
 * Retrieve city-level risk heatmap data.
 */
export const getRiskHeatmap = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const heatmap = await adminService.getRiskHeatmap();
    const response = ApiResponse.success(heatmap, 'Risk heatmap retrieved successfully');
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/policies
 * Retrieve all policies with optional status filter.
 */
export const getPolicies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.query;
    const policies = await adminService.getAllPolicies(status as string);
    const response = ApiResponse.success(policies, 'Policies retrieved successfully');
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/policies/:id
 * Retrieve a specific policy by ID.
 */
export const getPolicyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const policy = await adminService.getPolicyById(id);

    if (!policy) {
      const response = ApiResponse.error('Policy not found', 404);
      res.status(response.code).json(response);
      return;
    }

    const response = ApiResponse.success(policy, 'Policy retrieved successfully');
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/admin/policies/:id
 * Update policy status.
 */
export const updatePolicyStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Active', 'Pending', 'Expired'].includes(status)) {
      const response = ApiResponse.error('Valid status is required (Active, Pending, or Expired)', 400);
      res.status(response.code).json(response);
      return;
    }

    const policy = await adminService.updatePolicyStatus(id, status);

    if (!policy) {
      const response = ApiResponse.error('Policy not found', 404);
      res.status(response.code).json(response);
      return;
    }

    const response = ApiResponse.success(policy, 'Policy status updated successfully');
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/claims
 * Retrieve all claims with optional status filter.
 */
export const getClaims = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.query;
    const claims = await adminService.getAllClaims(status as string);
    const response = ApiResponse.success(claims, 'Claims retrieved successfully');
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/claims/:id
 * Retrieve a specific claim by ID.
 */
export const getClaimById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const claim = await adminService.getClaimById(id);

    if (!claim) {
      const response = ApiResponse.error('Claim not found', 404);
      res.status(response.code).json(response);
      return;
    }

    const response = ApiResponse.success(claim, 'Claim retrieved successfully');
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/admin/claims/:id
 * Review a claim (approve or reject).
 */
export const reviewClaim = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { action, reviewedBy, reviewNotes } = req.body;

    if (!action || !['approve', 'reject'].includes(action)) {
      const response = ApiResponse.error('Valid action is required (approve or reject)', 400);
      res.status(response.code).json(response);
      return;
    }

    if (!reviewedBy || typeof reviewedBy !== 'string') {
      const response = ApiResponse.error('Reviewer name is required', 400);
      res.status(response.code).json(response);
      return;
    }

    const claim = await adminService.reviewClaim(id, action, reviewedBy, reviewNotes);

    if (!claim) {
      const response = ApiResponse.error('Claim not found', 404);
      res.status(response.code).json(response);
      return;
    }

    const response = ApiResponse.success(claim, `Claim ${action}d successfully`);
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};
