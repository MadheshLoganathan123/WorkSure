import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import * as claimsService from '../services/claims.service';

/**
 * GET /api/v1/claims/history
 * Retrieve all claims for a user.
 */
export const getClaimHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      const response = ApiResponse.error('User ID is required', 400);
      res.status(response.code).json(response);
      return;
    }

    const claims = await claimsService.getClaimsByUserId(userId);

    const response = ApiResponse.success(claims, 'Claims retrieved successfully');
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/claims/trigger
 * Manually trigger a claim check for a user based on current weather.
 */
export const triggerClaim = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId || typeof userId !== 'string') {
      const response = ApiResponse.error('User ID is required', 400);
      res.status(response.code).json(response);
      return;
    }

    const claim = await claimsService.triggerClaimCheck(userId);

    if (!claim) {
      const response = ApiResponse.success(null, 'No parametric conditions met for claim', 200);
      res.status(response.code).json(response);
      return;
    }

    const response = ApiResponse.success(claim, 'Claim triggered successfully', 201);
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/claims/approve
 * Approve a pending claim (internal endpoint).
 */
export const approveClaim = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { claimId, userId } = req.body;

    if (!claimId || typeof claimId !== 'string' || !userId || typeof userId !== 'string') {
      const response = ApiResponse.error('Claim ID and User ID are required', 400);
      res.status(response.code).json(response);
      return;
    }

    const claim = await claimsService.approveClaim(claimId, userId);

    if (!claim) {
      const response = ApiResponse.error('Claim not found', 404);
      res.status(response.code).json(response);
      return;
    }

    const response = ApiResponse.success(claim, 'Claim approved successfully');
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/claims/pay
 * Pay an approved claim and credit user's wallet (internal endpoint).
 */
export const payClaim = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { claimId, userId } = req.body;

    if (!claimId || typeof claimId !== 'string' || !userId || typeof userId !== 'string') {
      const response = ApiResponse.error('Claim ID and User ID are required', 400);
      res.status(response.code).json(response);
      return;
    }

    const claim = await claimsService.payClaim(claimId, userId);

    if (!claim) {
      const response = ApiResponse.error('Claim not found', 404);
      res.status(response.code).json(response);
      return;
    }

    const response = ApiResponse.success(claim, 'Claim paid successfully');
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};
