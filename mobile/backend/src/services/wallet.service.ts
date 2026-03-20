import { supabase } from '../utils/supabaseClient';

export interface Transaction {
  id: string;
  type: 'PAYOUT' | 'TOPUP' | 'WITHDRAW' | 'topup' | 'withdrawal';
  category: 'CLAIM' | 'TOPUP' | 'WITHDRAWAL';
  amount: number;
  timestamp: string;
  date: string; // Formatted for UI
  status: 'Completed' | 'Success' | 'Pending' | 'Failed';
  description: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  totalEarnings: number;
  pendingPayouts: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Initialize or get a wallet for a user.
 */
export const getOrCreateWallet = async (userId: string): Promise<Wallet> => {
  const { data: wallet, error } = await supabase
    .from('wallets')
    .select()
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Create new wallet
      const { data: newWallet, error: createError } = await supabase
        .from('wallets')
        .insert([{ user_id: userId, balance: 0, total_earnings: 0, pending_payouts: 0 }])
        .select()
        .single();
      
      if (createError) throw new Error(`Error creating wallet: ${createError.message}`);
      
      return {
        userId: newWallet.user_id,
        balance: newWallet.balance,
        totalEarnings: newWallet.total_earnings,
        pendingPayouts: newWallet.pending_payouts,
        createdAt: newWallet.created_at,
        updatedAt: newWallet.updated_at,
      };
    }
    throw new Error(`Error fetching wallet: ${error.message}`);
  }

  return {
    userId: wallet.user_id,
    balance: wallet.balance,
    totalEarnings: wallet.total_earnings,
    pendingPayouts: wallet.pending_payouts,
    createdAt: wallet.created_at,
    updatedAt: wallet.updated_at,
  };
};

/**
 * Get wallet by user ID.
 */
export const getWalletByUserId = async (userId: string): Promise<Wallet | null> => {
  const { data: wallet, error } = await supabase
    .from('wallets')
    .select()
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Error fetching wallet: ${error.message}`);
  }

  return {
    userId: wallet.user_id,
    balance: wallet.balance,
    totalEarnings: wallet.total_earnings,
    pendingPayouts: wallet.pending_payouts,
    createdAt: wallet.created_at,
    updatedAt: wallet.updated_at,
  };
};

/**
 * Get wallet balance.
 */
export const getBalance = async (userId: string): Promise<{ balance: number; totalEarnings: number; pendingPayouts: number } | null> => {
  const wallet = await getWalletByUserId(userId);
  if (!wallet) return null;

  return {
    balance: wallet.balance,
    totalEarnings: wallet.totalEarnings,
    pendingPayouts: wallet.pendingPayouts,
  };
};

/**
 * Get transaction history for a user.
 */
export const getTransactionHistory = async (userId: string, limit: number = 50): Promise<Transaction[] | null> => {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select()
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Error fetching transactions: ${error.message}`);
  }

  return (transactions || []).map(txn => ({
    id: txn.id,
    type: txn.type === 'topup' ? 'TOPUP' : 'WITHDRAW',
    category: txn.type === 'topup' ? 'TOPUP' : 'WITHDRAWAL',
    amount: txn.amount,
    timestamp: txn.timestamp,
    date: new Date(txn.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: txn.status === 'completed' ? 'Success' : txn.status.charAt(0).toUpperCase() + txn.status.slice(1) as any,
    description: txn.description,
  }));
};

/**
 * Process a top-up transaction.
 */
export const processTopup = async (userId: string, amount: number, description: string = 'Top-up'): Promise<Transaction | null> => {
  if (amount <= 0) throw new Error('Top-up amount must be positive');

  // 1. Log transaction
  const { data: transaction, error: txnError } = await supabase
    .from('transactions')
    .insert([{
      user_id: userId,
      type: 'topup',
      amount,
      status: 'completed',
      description,
      timestamp: new Date().toISOString()
    }])
    .select()
    .single();

  if (txnError) throw new Error(`Error recording transaction: ${txnError.message}`);

  // 2. Update wallet balance
  const wallet = await getOrCreateWallet(userId);
  const { error: walletError } = await supabase
    .from('wallets')
    .update({
      balance: wallet.balance + amount,
      total_earnings: wallet.totalEarnings + amount,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (walletError) throw new Error(`Error updating balance: ${walletError.message}`);

  return {
    id: transaction.id,
    type: 'TOPUP',
    category: 'TOPUP',
    amount: transaction.amount,
    timestamp: transaction.timestamp,
    date: new Date(transaction.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    status: 'Success',
    description: transaction.description,
  };
};

/**
 * Process a withdrawal transaction.
 */
export const processWithdrawal = async (userId: string, amount: number, description: string = 'Withdrawal'): Promise<Transaction | null> => {
  if (amount <= 0) throw new Error('Withdrawal amount must be positive');

  const wallet = await getWalletByUserId(userId);
  if (!wallet || wallet.balance < amount) {
    throw new Error('Insufficient balance for withdrawal');
  }

  // 1. Log transaction
  const { data: transaction, error: txnError } = await supabase
    .from('transactions')
    .insert([{
      user_id: userId,
      type: 'withdrawal',
      amount,
      status: 'completed',
      description,
      timestamp: new Date().toISOString()
    }])
    .select()
    .single();

  if (txnError) throw new Error(`Error recording transaction: ${txnError.message}`);

  // 2. Update wallet balance
  const { error: walletError } = await supabase
    .from('wallets')
    .update({
      balance: wallet.balance - amount,
      pending_payouts: wallet.pendingPayouts + amount,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (walletError) throw new Error(`Error updating balance: ${walletError.message}`);

  return {
    id: transaction.id,
    type: 'WITHDRAW',
    category: 'WITHDRAWAL',
    amount: transaction.amount,
    timestamp: transaction.timestamp,
    date: new Date(transaction.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    status: 'Success',
    description: transaction.description,
  };
};

/**
 * Add earnings to a user's wallet (simulated work completion).
 */
export const addEarnings = async (userId: string, amount: number, description: string = 'Work completed'): Promise<Wallet> => {
  if (amount <= 0) throw new Error('Earnings amount must be positive');

  // 1. Log transaction
  const { error: txnError } = await supabase
    .from('transactions')
    .insert([{
      user_id: userId,
      type: 'topup',
      amount,
      status: 'completed',
      description,
      timestamp: new Date().toISOString()
    }]);

  if (txnError) throw new Error(`Error recording transaction: ${txnError.message}`);

  // 2. Update wallet balance
  const wallet = await getOrCreateWallet(userId);
  const { data: updatedWallet, error: walletError } = await supabase
    .from('wallets')
    .update({
      balance: wallet.balance + amount,
      total_earnings: wallet.totalEarnings + amount,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (walletError) throw new Error(`Error updating balance: ${walletError.message}`);

  return {
    userId: updatedWallet.user_id,
    balance: updatedWallet.balance,
    totalEarnings: updatedWallet.total_earnings,
    pendingPayouts: updatedWallet.pending_payouts,
    createdAt: updatedWallet.created_at,
    updatedAt: updatedWallet.updated_at,
  };
};

/**
 * Get all wallets (for development / debugging).
 */
export const getAllWallets = async (): Promise<Wallet[]> => {
  const { data: wallets, error } = await supabase
    .from('wallets')
    .select();

  if (error) throw new Error(`Error fetching wallets: ${error.message}`);

  return (wallets || []).map(wallet => ({
    userId: wallet.user_id,
    balance: wallet.balance,
    totalEarnings: wallet.total_earnings,
    pendingPayouts: wallet.pending_payouts,
    createdAt: wallet.created_at,
    updatedAt: wallet.updated_at,
  }));
};
