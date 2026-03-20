import { Router } from 'express';
import * as walletController from '../controllers/wallet.controller';

const router = Router();

/**
 * GET /api/v1/wallet/balance
 * Retrieve wallet balance, total earnings, and pending payouts.
 * Query params: userId (required), optional limit
 */
router.get('/balance', walletController.getBalance);

/**
 * GET /api/v1/wallet/transactions
 * Retrieve transaction history for a user.
 * Query params: userId (required), limit (optional, default 50, max 100)
 */
router.get('/transactions', walletController.getTransactions);

/**
 * POST /api/v1/wallet/topup
 * Process a top-up transaction.
 * Body: { userId, amount, description? }
 */
router.post('/topup', walletController.topup);

/**
 * POST /api/v1/wallet/withdraw
 * Process a withdrawal transaction.
 * Body: { userId, amount, description? }
 */
router.post('/withdraw', walletController.withdraw);

export default router;
