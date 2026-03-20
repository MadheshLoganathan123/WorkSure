import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import * as profileService from '../services/profile.service';

/**
 * POST /api/v1/profile
 * Create a new worker profile.
 */
export const createProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await profileService.createProfile(req.body);
    const response = ApiResponse.success(profile, 'Profile created successfully', 201);
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/profile/:userId
 * Retrieve a worker profile by user ID.
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const profile = await profileService.getProfileById(userId);

    if (!profile) {
      const response = ApiResponse.error('Profile not found', 404);
      res.status(response.code).json(response);
      return;
    }

    const response = ApiResponse.success(profile, 'Profile retrieved successfully');
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};
