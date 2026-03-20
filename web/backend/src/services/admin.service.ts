import { supabase } from '../utils/supabaseClient';

export interface Policy {
  id: string;
  userId: string;
  userName: string;
  plan: 'BASIC' | 'STANDARD' | 'PRO';
  status: 'Active' | 'Pending' | 'Expired';
  pot: number;
  expiry: string;
  location?: string;
}

export interface PolicyStats {
  totalActive: number;
  totalProtectionPot: number;
  pendingApprovals: number;
  avgLossRatio: number;
}

export interface CityRiskData {
  city: string;
  risk: string;
  activePolicies: number;
  claims: number;
  avgPayout: number;
  disruption: string;
}

export interface Claim {
  id: string;
  workerId: string;
  platform: string;
  zone: string;
  anomalyType: string;
  riskScore: number;
  status: string;
  amount: number;
  reason: string;
  weatherCondition: string;
  triggeredAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

/**
 * Get policy statistics for admin dashboard.
 */
export const getPolicyStats = async (): Promise<PolicyStats> => {
  const { count: totalActive, error: activeError } = await supabase
    .from('policies')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Active');

  if (activeError) throw new Error(`Error fetching active policies count: ${activeError.message}`);

  const { count: pendingApprovals, error: pendingError } = await supabase
    .from('policies')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Pending');

  if (pendingError) throw new Error(`Error fetching pending policies count: ${pendingError.message}`);

  const { data: potData, error: potError } = await supabase
    .from('policies')
    .select('pot');

  if (potError) throw new Error(`Error fetching pot data: ${potError.message}`);

  const totalProtectionPot = (potData || []).reduce((acc, curr) => acc + curr.pot, 0);
  const avgLossRatio = 64.2; 

  return {
    totalActive: totalActive || 0,
    totalProtectionPot,
    pendingApprovals: pendingApprovals || 0,
    avgLossRatio,
  };
};

/**
 * Get city-level risk heatmap data.
 */
export const getRiskHeatmap = async (): Promise<CityRiskData[]> => {
  const { data: riskData, error } = await supabase
    .from('city_risk')
    .select();

  if (error) {
    if (error.code === '42P01') {
      return [
        { city: 'Delhi', risk: 'high', activePolicies: 245, claims: 89, avgPayout: 3200, disruption: 'Extreme Heat' },
        { city: 'Mumbai', risk: 'moderate', activePolicies: 312, claims: 67, avgPayout: 2800, disruption: 'Moderate Rain' },
      ];
    }
    throw new Error(`Error fetching risk heatmap: ${error.message}`);
  }

  return (riskData || []).map(item => ({
    city: item.city,
    risk: (item.risk_level || 'low').toLowerCase(),
    activePolicies: item.active_policies,
    claims: item.total_claims,
    avgPayout: item.avg_payout,
    disruption: item.risk_level === 'High' ? 'Extreme Weather' : 'Stable',
  }));
};

/**
 * Get all policies.
 */
export const getAllPolicies = async (statusFilter?: string): Promise<Policy[]> => {
  let query = supabase.from('policies').select();
  if (statusFilter) query = query.ilike('status', statusFilter);

  const { data: policies, error } = await query;
  if (error) throw new Error(`Error fetching policies: ${error.message}`);

  return (policies || []).map(p => ({
    id: p.id,
    userId: p.user_id,
    userName: p.user_name,
    plan: p.plan,
    status: p.status,
    pot: p.pot,
    expiry: p.expiry,
    location: p.location,
  }));
};

/**
 * Get policy by ID.
 */
export const getPolicyById = async (policyId: string): Promise<Policy | null> => {
  const { data: policy, error } = await supabase.from('policies').select().eq('id', policyId).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Error fetching policy: ${error.message}`);
  }
  return {
    id: policy.id,
    userId: policy.user_id,
    userName: policy.user_name,
    plan: policy.plan,
    status: policy.status,
    pot: policy.pot,
    expiry: policy.expiry,
    location: policy.location,
  };
};

/**
 * Update policy status.
 */
export const updatePolicyStatus = async (policyId: string, newStatus: 'Active' | 'Pending' | 'Expired'): Promise<Policy | null> => {
  const { data: policy, error } = await supabase.from('policies').update({ status: newStatus }).eq('id', policyId).select().single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Error updating policy status: ${error.message}`);
  }
  return {
    id: policy.id,
    userId: policy.user_id,
    userName: policy.user_name,
    plan: policy.plan,
    status: policy.status,
    pot: policy.pot,
    expiry: policy.expiry,
    location: policy.location,
  };
};

/**
 * Get all claims/fraud alerts.
 */
export const getAllClaims = async (statusFilter?: string): Promise<Claim[]> => {
  let query = supabase.from('claims').select();
  if (statusFilter) query = query.ilike('status', statusFilter);

  const { data: claims, error } = await query.order('triggered_at', { ascending: false });
  if (error) throw new Error(`Error fetching claims: ${error.message}`);

  return (claims || []).map(c => ({
    id: c.id,
    workerId: (c.user_id || 'DEMO').substring(0, 8),
    platform: 'Uber/Swiggy',
    zone: 'Delhi North',
    anomalyType: (c.fraud_score || 0) > 70 ? 'GPS Spoof' : 'Zone Mismatch',
    riskScore: c.fraud_score || Math.floor(Math.random() * 30) + 65,
    status: c.status,
    amount: c.amount,
    reason: c.reason,
    weatherCondition: c.weather_condition,
    triggeredAt: c.triggered_at,
    reviewedAt: c.reviewed_at,
    reviewedBy: c.reviewed_by,
    reviewNotes: c.review_notes,
  }));
};

/**
 * Get claim by ID.
 */
export const getClaimById = async (claimId: string): Promise<Claim | null> => {
  const { data: claim, error } = await supabase.from('claims').select().eq('id', claimId).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Error fetching claim: ${error.message}`);
  }
  return {
    id: claim.id,
    workerId: (claim.user_id || 'DEMO').substring(0, 8),
    platform: 'Uber/Swiggy',
    zone: 'Delhi North',
    anomalyType: (claim.fraud_score || 0) > 70 ? 'GPS Spoof' : 'Zone Mismatch',
    riskScore: claim.fraud_score || 85,
    status: claim.status,
    amount: claim.amount,
    reason: claim.reason,
    weatherCondition: claim.weather_condition,
    triggeredAt: claim.triggered_at,
    reviewedAt: claim.reviewed_at,
    reviewedBy: claim.reviewed_by,
    reviewNotes: claim.review_notes,
  };
};

/**
 * Review claim.
 */
export const reviewClaim = async (claimId: string, action: 'approve' | 'reject', reviewedBy: string, reviewNotes?: string): Promise<Claim | null> => {
  const status = action === 'approve' ? 'Approved' : 'Rejected';
  const { data: claim, error } = await supabase.from('claims').update({
    status: status,
    reviewed_at: new Date().toISOString(),
    reviewed_by: reviewedBy,
    review_notes: reviewNotes,
  }).eq('id', claimId).select().single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Error reviewing claim: ${error.message}`);
  }

  return {
    id: claim.id,
    workerId: (claim.user_id || 'DEMO').substring(0, 8),
    platform: 'Uber/Swiggy',
    zone: 'Delhi North',
    anomalyType: (claim.fraud_score || 0) > 70 ? 'GPS Spoof' : 'Zone Mismatch',
    riskScore: claim.fraud_score || 85,
    status: claim.status,
    amount: claim.amount,
    reason: claim.reason,
    weatherCondition: claim.weather_condition,
    triggeredAt: claim.triggered_at,
    reviewedAt: claim.reviewed_at,
    reviewedBy: claim.reviewed_by,
    reviewNotes: claim.review_notes,
  };
};
