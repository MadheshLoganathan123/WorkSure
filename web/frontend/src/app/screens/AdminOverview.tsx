import { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { KPICard } from '../components/KPICard';
import { apiFetch } from '../utils/api';
import { supabase } from '../../lib/supabaseClient';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router';
import { MapPin, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';

// Mock trend data stays as it's not yet in DB
const premiumsVsPayoutsData = [
  { week: 'Week 1', premiums: 2400, payouts: 1200 },
  { week: 'Week 2', premiums: 2800, payouts: 1500 },
  { week: 'Week 3', premiums: 3200, payouts: 1800 },
  { week: 'Week 4', premiums: 2900, payouts: 2100 },
  { week: 'Week 5', premiums: 3400, payouts: 1600 },
  { week: 'Week 6', premiums: 3100, payouts: 1900 },
  { week: 'Week 7', premiums: 3600, payouts: 2200 },
  { week: 'Week 8', premiums: 3300, payouts: 1700 },
];

const disruptionTypesData = [
  { type: 'Rain', claims: 145 },
  { type: 'Heat Wave', claims: 89 },
  { type: 'Flood', claims: 67 },
  { type: 'AQI', claims: 112 },
  { type: 'Curfew', claims: 34 },
];

export function AdminOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [cityRiskData, setCityRiskData] = useState<any[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock data for fallback
  const mockStats = {
    totalActive: 5,
    totalProtectionPot: 85000,
    pendingApprovals: 2,
    avgLossRatio: 64.2
  };

  const mockCityRisk = [
    { city: 'Delhi', riskLevel: 'High', activePolicies: 245, totalClaims: 89, avgPayout: 3200 },
    { city: 'Mumbai', riskLevel: 'Moderate', activePolicies: 312, totalClaims: 67, avgPayout: 2800 },
    { city: 'Bangalore', riskLevel: 'Low', activePolicies: 198, totalClaims: 34, avgPayout: 2100 },
    { city: 'Chennai', riskLevel: 'High', activePolicies: 156, totalClaims: 78, avgPayout: 3500 },
    { city: 'Kolkata', riskLevel: 'Moderate', activePolicies: 134, totalClaims: 45, avgPayout: 2600 },
    { city: 'Hyderabad', riskLevel: 'Low', activePolicies: 189, totalClaims: 29, avgPayout: 1900 }
  ];

  const mockFraudAlerts = [
    { id: 'clm_00000001', userName: 'John Doe', userId: 'usr_000001', weatherCondition: 'Heavy Rain', fraudScore: 72, amount: 2500, status: 'Pending' },
    { id: 'clm_00000004', userName: 'Rachel Zane', userId: 'usr_000004', weatherCondition: 'Heavy Rain', fraudScore: 87, amount: 3000, status: 'Pending' }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'moderate':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getAnomalyColor = (type: string) => {
    switch (type) {
      case 'GPS Spoof':
        return 'bg-red-100 text-red-700';
      case 'Duplicate Claim':
        return 'bg-orange-100 text-orange-700';
      case 'Zone Mismatch':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData(true);
    }, 30000);

    // Supabase Realtime Subscription for Admin Overview (Claims/Fraud Alerts)
    const channel = supabase
      .channel('admin_claims_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claims'
        },
        () => {
          console.log('Admin Realtime update received: refreshing data...');
          fetchData(true);
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [statsData, cityRisk, claims] = await Promise.all([
        apiFetch('/api/v1/admin/policy-stats'),
        apiFetch('/api/v1/admin/risk-heatmap'),
        apiFetch('/api/v1/admin/claims?status=pending')
      ]);
      setStats(statsData || mockStats);
      setCityRiskData(cityRisk && cityRisk.length > 0 ? cityRisk : mockCityRisk);
      setFraudAlerts(claims && claims.length > 0 ? claims : mockFraudAlerts);
      setLastUpdated(new Date());
    } catch (e: any) {
      console.error('Data fetch failed:', e);
      setError(e.message || 'Failed to fetch data');
      // Use mock data as fallback
      setStats(mockStats);
      setCityRiskData(mockCityRisk);
      setFraudAlerts(mockFraudAlerts);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <AdminSidebar />

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Admin Overview</h1>
            <p className="text-sm text-gray-500">
              Real-time monitoring of WorkSure platform
              {lastUpdated && (
                <span className="ml-2 text-xs text-gray-400">
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-gray-700">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Failed to load data</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
            <button
              onClick={() => fetchData()}
              className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* KPI Strip */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <KPICard
                title="Active Policies This Week"
                value={stats ? stats.totalActive.toLocaleString() : "0"}
                trend={{ value: '+12.5%', direction: 'up' }}
              />
              <KPICard
                title="Total Protection Pot"
                value={stats ? `₹${(stats.totalProtectionPot / 1000).toFixed(1)}K` : "₹0"}
                trend={{ value: '+8.2%', direction: 'up' }}
              />
              <KPICard
                title="Pending Approvals"
                value={stats ? stats.pendingApprovals.toLocaleString() : "0"}
                trend={{ value: '+23.4%', direction: 'up' }}
              />
              <KPICard
                title="Current Loss Ratio"
                value={stats ? stats.avgLossRatio.toFixed(1) : "0"}
                suffix="%"
                trend={{ value: '-3.1%', direction: 'down' }}
              />
            </div>

        {/* Risk Heatmap & Charts Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* City Risk Heatmap */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">India City-Level Risk</h2>
            </div>
            <div className="space-y-3">
              {cityRiskData.map((city) => (
                <div
                  key={city.city}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        city.riskLevel.toLowerCase() === 'high'
                          ? 'bg-red-500'
                          : city.riskLevel.toLowerCase() === 'moderate'
                          ? 'bg-amber-500'
                          : 'bg-green-500'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{city.city}</p>
                      <p className="text-xs text-gray-500">{city.activePolicies} policies</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{city.totalClaims} claims</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(
                        city.riskLevel.toLowerCase()
                      )}`}
                    >
                      {city.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disruption Types Bar Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Claim Volume by Disruption Type
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={disruptionTypesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="type" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="claims" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Premium vs Payout Trend */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            8-Week Trend: Premiums vs. Payouts
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={premiumsVsPayoutsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Line
                type="monotone"
                dataKey="premiums"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                name="Premiums Collected (₹)"
              />
              <Line
                type="monotone"
                dataKey="payouts"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                name="Payouts Disbursed (₹)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Fraud Alerts Panel */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Fraud Alerts</h2>
            <span className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              {fraudAlerts.filter((a: any) => a.fraudScore && a.fraudScore >= 70).length} Flagged
            </span>
          </div>
          <div className="space-y-3">
            {fraudAlerts.filter((a: any) => a.fraudScore && a.fraudScore >= 70).slice(0, 5).map((alert: any) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Claim ID: {alert.id}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Worker: {alert.userName} ({alert.userId}) • {alert.weatherCondition}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      alert.fraudScore >= 85 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    High Risk
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Risk Score</p>
                    <p
                      className={`text-lg font-semibold ${
                        alert.fraudScore >= 85 ? 'text-red-600' : 'text-amber-600'
                      }`}
                    >
                      {alert.fraudScore}%
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/claim/${alert.id}`)}
                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
            {fraudAlerts.filter((a: any) => a.fraudScore && a.fraudScore >= 70).length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No high-risk fraud alerts at this time
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
