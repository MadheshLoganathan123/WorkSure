import { supabase } from '../utils/supabaseClient';
import * as walletService from './wallet.service';
import * as weatherUtil from './weather.service';

export type ClaimStatus = 'Pending' | 'Approved' | 'Paid' | 'Rejected';

export interface Claim {
  id: string;
  userId: string;
  status: 'Pending' | 'Approved' | 'Paid' | 'VERIFYING' | 'APPROVED';
  amount: number;
  reason: string;
  type: string; // UI friendly weather type
  location: string;
  weatherCondition: string;
  triggeredAt: string;
  date: string; // Formatted for UI
  approvedAt?: string;
  paidAt?: string;
}

/**
 * Trigger a claim check for a user based on current weather.
 */
export const triggerClaimCheck = async (userId: string): Promise<Claim | null> => {
  // 1. Get user profile for location
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('location, risk_score')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    throw new Error('User profile not found for claim trigger');
  }

  // 2. Get current weather for user location
  const result = await weatherUtil.getMonitoringByCity(profile.location);
  const weather = result.currentWeather;
  
  // 3. check risk parameters from Supabase
  const { data: riskParams, error: riskError } = await supabase
    .from('city_risk')
    .select()
    .eq('city', profile.location)
    .single();

  const thresholds = riskError || !riskParams ? {
    rainfall_threshold: 20,
    heat_threshold: 40,
    aqi_threshold: 150
  } : riskParams;

  let triggered = false;
  let reason = '';
  let amount = 0;

  if (weather.rainMm > thresholds.rainfall_threshold) {
    triggered = true;
    reason = `Extreme Rainfall: ${weather.rainMm}mm`;
    amount = 1200; // Base parametric payout
  } else if (weather.temperatureC > thresholds.heat_threshold) {
    triggered = true;
    reason = `Extreme Heat: ${weather.temperatureC}°C`;
    amount = 800;
  }

  if (!triggered) return null;

  // 4. Create claim in Supabase
  const { data: claim, error: claimError } = await supabase
    .from('claims')
    .insert([{
      user_id: userId,
      status: 'Pending',
      amount,
      reason,
      weather_condition: weather.condition,
      triggered_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (claimError) {
    throw new Error(`Error creating claim: ${claimError.message}`);
  }

  // 5. Fraud check (Stubbed)
  // await monitoringService.logFraudAlert(userId, claim.id, profile.risk_score > 70 ? 'HIGH' : 'LOW', `Automated claim triggered: ${reason}`);

  return {
    id: claim.id,
    userId: claim.user_id,
    status: 'VERIFYING',
    amount: claim.amount,
    reason: claim.reason,
    type: claim.weather_condition,
    location: profile.location,
    weatherCondition: claim.weather_condition,
    triggeredAt: claim.triggered_at,
    date: new Date(claim.triggered_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
  };
};

/**
 * Approve a claim.
 */
export const approveClaim = async (claimId: string, userId: string): Promise<Claim | null> => {
  const { data: claim, error: updateError } = await supabase
    .from('claims')
    .update({ 
      status: 'Approved',
      approved_at: new Date().toISOString()
    })
    .eq('id', claimId)
    .eq('user_id', userId)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Error approving claim: ${updateError.message}`);
  }

  return {
    id: claim.id,
    userId: claim.user_id,
    status: 'APPROVED',
    amount: claim.amount,
    reason: claim.reason,
    type: claim.weather_condition,
    location: 'Detected Zone',
    weatherCondition: claim.weather_condition,
    triggeredAt: claim.triggered_at,
    date: new Date(claim.triggered_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    approvedAt: claim.approved_at,
  };
};

/**
 * Pay a claim.
 */
export const payClaim = async (claimId: string, userId: string): Promise<Claim | null> => {
  const { data: claim, error: fetchError } = await supabase
    .from('claims')
    .select()
    .eq('id', claimId)
    .single();

  if (fetchError || !claim) throw new Error('Claim not found');

  // 1. Update claim status
  const { error: updateError } = await supabase
    .from('claims')
    .update({ 
      status: 'Paid',
      paid_at: new Date().toISOString()
    })
    .eq('id', claimId)
    .eq('user_id', userId)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Error paying claim: ${updateError.message}`);
  }

  // 3. Add funds to wallet
  await walletService.addEarnings(userId, claim.amount, `Claim payout: ${claim.reason}`);

  return {
    id: claim.id,
    userId: claim.user_id,
    status: 'APPROVED',
    amount: claim.amount,
    reason: claim.reason,
    type: claim.weather_condition,
    location: 'Detected Zone',
    weatherCondition: claim.weather_condition,
    triggeredAt: claim.triggered_at,
    date: new Date(claim.triggered_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    approvedAt: claim.approved_at,
    paidAt: claim.paid_at,
  };
};

/**
 * Get all claims for a user.
 */
export const getClaimsByUserId = async (userId: string): Promise<Claim[]> => {
  const { data: claims, error } = await supabase
    .from('claims')
    .select()
    .eq('user_id', userId)
    .order('triggered_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching user claims: ${error.message}`);
  }

  return (claims || []).map(claim => ({
    id: claim.id,
    userId: claim.user_id,
    status: claim.status === 'Pending' ? 'VERIFYING' : 'APPROVED',
    amount: claim.amount,
    reason: claim.reason,
    type: claim.weather_condition,
    location: 'Detected Zone',
    weatherCondition: claim.weather_condition,
    triggeredAt: claim.triggered_at,
    date: new Date(claim.triggered_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    approvedAt: claim.approved_at,
    paidAt: claim.paid_at,
  }));
};

/**
 * Get a specific claim by ID.
 */
export const getClaimById = async (claimId: string, userId: string): Promise<Claim | null> => {
  const { data: claim, error } = await supabase
    .from('claims')
    .select()
    .eq('id', claimId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Error fetching claim: ${error.message}`);
  }

  return {
    id: claim.id,
    userId: claim.user_id,
    status: claim.status === 'Pending' ? 'VERIFYING' : 'APPROVED',
    amount: claim.amount,
    reason: claim.reason,
    type: claim.weather_condition,
    location: 'Detected Zone',
    weatherCondition: claim.weather_condition,
    triggeredAt: claim.triggered_at,
    date: new Date(claim.triggered_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    approvedAt: claim.approved_at,
    paidAt: claim.paid_at,
  };
};
