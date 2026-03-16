import { AdminSidebar } from '../components/AdminSidebar';
import { KPICard } from '../components/KPICard';
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
import { MapPin, AlertTriangle } from 'lucide-react';

// Mock data
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

const cityRiskData = [
  { city: 'Mumbai', risk: 'high', disruption: 'Heavy Rain', claims: 45 },
  { city: 'Delhi', risk: 'high', disruption: 'AQI Critical', claims: 67 },
  { city: 'Bengaluru', risk: 'moderate', disruption: 'Traffic Strike', claims: 23 },
  { city: 'Chennai', risk: 'high', disruption: 'Flood Alert', claims: 34 },
  { city: 'Hyderabad', risk: 'low', disruption: 'Normal', claims: 8 },
  { city: 'Kolkata', risk: 'moderate', disruption: 'Heat Wave', claims: 19 },
  { city: 'Pune', risk: 'low', disruption: 'Normal', claims: 12 },
  { city: 'Ahmedabad', risk: 'moderate', disruption: 'Heat Wave', claims: 28 },
];

const fraudAlerts = [
  {
    id: 'WS-2024-8472',
    workerId: 'ZM8472K',
    anomalyType: 'GPS Spoof',
    riskScore: 87,
    platform: 'Zomato',
    zone: 'South Delhi',
  },
  {
    id: 'WS-2024-8473',
    workerId: 'SW9234L',
    anomalyType: 'Duplicate Claim',
    riskScore: 94,
    platform: 'Swiggy',
    zone: 'Koramangala',
  },
  {
    id: 'WS-2024-8474',
    workerId: 'BL1823M',
    anomalyType: 'Zone Mismatch',
    riskScore: 72,
    platform: 'Blinkit',
    zone: 'Andheri West',
  },
];

export function AdminOverview() {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <AdminSidebar />

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Admin Overview</h1>
          <p className="text-sm text-gray-500">Real-time monitoring of WorkSure platform</p>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Active Policies This Week"
            value="2,847"
            trend={{ value: '+12.5%', direction: 'up' }}
          />
          <KPICard
            title="Total Premiums Collected"
            value="₹24.8L"
            trend={{ value: '+8.2%', direction: 'up' }}
          />
          <KPICard
            title="Claims Triggered Today"
            value="156"
            trend={{ value: '+23.4%', direction: 'up' }}
          />
          <KPICard
            title="Current Loss Ratio"
            value="62.3"
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
                        city.risk === 'high'
                          ? 'bg-red-500'
                          : city.risk === 'moderate'
                          ? 'bg-amber-500'
                          : 'bg-green-500'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{city.city}</p>
                      <p className="text-xs text-gray-500">{city.disruption}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{city.claims} claims</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(
                        city.risk
                      )}`}
                    >
                      {city.risk}
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
              {fraudAlerts.length} Flagged
            </span>
          </div>
          <div className="space-y-3">
            {fraudAlerts.map((alert) => (
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
                      Worker: {alert.workerId} • {alert.platform} • {alert.zone}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getAnomalyColor(
                      alert.anomalyType
                    )}`}
                  >
                    {alert.anomalyType}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Risk Score</p>
                    <p
                      className={`text-lg font-semibold ${
                        alert.riskScore >= 85 ? 'text-red-600' : 'text-amber-600'
                      }`}
                    >
                      {alert.riskScore}%
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
          </div>
        </div>
      </main>
    </div>
  );
}
