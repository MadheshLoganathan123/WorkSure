import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import * as walletService from '../services/wallet.service';

/**
 * GET /api/v1/wallet/balance
 * Retrieve wallet balance, total earnings, and pending payouts.
 */
export const getBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      const response = ApiResponse.error('User ID is required', 400);
      res.status(response.code).json(response);
      return;
    }

    const balance = await walletService.getBalance(userId);

    if (!balance) {
      const response = ApiResponse.error('Wallet not found', 404);
      res.status(response.code).json(response);
      return;
    }

    const response = ApiResponse.success(balance, 'Balance retrieved successfully');
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/wallet/transactions
 * Retrieve transaction history for a user.
 */
export const getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, limit } = req.query;

    if (!userId || typeof userId !== 'string') {
      const response = ApiResponse.error('User ID is required', 400);
      res.status(response.code).json(response);
      return;
    }

    const limitNum = limit ? Math.min(parseInt(limit as string, 10), 100) : 50;

    const transactions = await walletService.getTransactionHistory(userId, limitNum);

    if (!transactions) {
      const response = ApiResponse.error('Wallet not found', 404);
      res.status(response.code).json(response);
      return;
    }

    const response = ApiResponse.success(transactions, 'Transactions retrieved successfully');
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/wallet/topup
 * Process a top-up transaction.
 */
export const topup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, amount, description } = req.body;

    if (!userId || typeof userId !== 'string') {
      const response = ApiResponse.error('User ID is required', 400);
      res.status(response.code).json(response);
      return;
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      const response = ApiResponse.error('Valid positive amount is required', 400);
      res.status(response.code).json(response);
      return;
    }

    const transaction = await walletService.processTopup(userId, amount, description || 'Top-up');
    const response = ApiResponse.success(transaction, 'Top-up processed successfully', 201);
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/wallet/withdraw
 * Process a withdrawal transaction.
 */
export const withdraw = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, amount, description } = req.body;

    if (!userId || typeof userId !== 'string') {
      const response = ApiResponse.error('User ID is required', 400);
      res.status(response.code).json(response);
      return;
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      const response = ApiResponse.error('Valid positive amount is required', 400);
      res.status(response.code).json(response);
      return;
    }

    const transaction = await walletService.processWithdrawal(userId, amount, description || 'Withdrawal');
    const response = ApiResponse.success(transaction, 'Withdrawal processed successfully', 201);
    res.status(response.code).json(response);
  } catch (error) {
    next(error);
  }
};
