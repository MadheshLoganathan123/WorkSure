import { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { apiFetch } from '../utils/api';
import { 
  TrendingUp, 
  MapPin, 
  AlertTriangle,
  Cloud,
  Droplets,
  Sun,
  Wind
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];

export function AdminRisk() {
  const [riskHeatmap, setRiskHeatmap] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for fallback
  const mockRiskHeatmap = [
    { city: 'Delhi', riskLevel: 'High', activePolicies: 245, totalClaims: 89, avgPayout: 3200 },
    { city: 'Mumbai', riskLevel: 'Moderate', activePolicies: 312, totalClaims: 67, avgPayout: 2800 },
    { city: 'Bangalore', riskLevel: 'Low', activePolicies: 198, totalClaims: 34, avgPayout: 2100 },
    { city: 'Chennai', riskLevel: 'High', activePolicies: 156, totalClaims: 78, avgPayout: 3500 },
    { city: 'Kolkata', riskLevel: 'Moderate', activePolicies: 134, totalClaims: 45, avgPayout: 2600 },
    { city: 'Hyderabad', riskLevel: 'Low', activePolicies: 189, totalClaims: 29, avgPayout: 1900 },
    { city: 'Pune', riskLevel: 'Moderate', activePolicies: 167, totalClaims: 52, avgPayout: 2400 },
    { city: 'Ahmedabad', riskLevel: 'High', activePolicies: 143, totalClaims: 71, avgPayout: 3100 }
  ];

  useEffect(() => {
    fetchRiskData();
  }, []);

  const fetchRiskData = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/v1/admin/risk-heatmap');
      setRiskHeatmap(data && data.length > 0 ? data : mockRiskHeatmap);
    } catch (error) {
      console.error('Failed to fetch risk data:', error);
      // Use mock data as fallback
      setRiskHeatmap(mockRiskHeatmap);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'moderate': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRiskDotColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'moderate': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const stats = {
    totalCities: riskHeatmap.length,
    highRisk: riskHeatmap.filter(c => c.riskLevel.toLowerCase() === 'high').length,
    moderateRisk: riskHeatmap.filter(c => c.riskLevel.toLowerCase() === 'moderate').length,
    lowRisk: riskHeatmap.filter(c => c.riskLevel.toLowerCase() === 'low').length,
    totalPolicies: riskHeatmap.reduce((sum, c) => sum + c.activePolicies, 0),
    totalClaims: riskHeatmap.reduce((sum, c) => sum + c.totalClaims, 0),
  };

  const riskDistribution = [
    { name: 'High Risk', value: stats.highRisk, color: '#ef4444' },
    { name: 'Moderate Risk', value: stats.moderateRisk, color: '#f59e0b' },
    { name: 'Low Risk', value: stats.lowRisk, color: '#10b981' },
  ];

  // Mock weather disruption data
  const weatherDisruptions = [
    { type: 'Heavy Rain', count: 145, icon: Droplets, color: 'text-blue-600' },
    { type: 'Heat Wave', count: 89, icon: Sun, color: 'text-orange-600' },
    { type: 'Storms', count: 67, icon: Cloud, color: 'text-gray-600' },
    { type: 'High Winds', count: 34, icon: Wind, color: 'text-cyan-600' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Risk Engine</h1>
          <p className="text-sm text-gray-500">Geographic risk assessment and weather monitoring</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Cities Monitored</p>
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-semibold text-gray-900">{stats.totalCities}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-red-700">High Risk Zones</p>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-semibold text-red-700">{stats.highRisk}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-700">Active Policies</p>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-semibold text-blue-700">{stats.totalPolicies}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-amber-700">Total Claims</p>
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-semibold text-amber-700">{stats.totalClaims}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Risk Distribution Pie Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Risk Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Claims by City Bar Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Claims by City</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskHeatmap.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="city" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="totalClaims" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weather Disruptions */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Weather Disruption Types</h2>
          <div className="grid grid-cols-4 gap-4">
            {weatherDisruptions.map((disruption) => {
              const Icon = disruption.icon;
              return (
                <div key={disruption.type} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className={`p-3 rounded-full bg-gray-100 ${disruption.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{disruption.type}</p>
                    <p className="text-2xl font-semibold text-gray-900">{disruption.count}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* City Risk Heatmap */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">City-Level Risk Heatmap</h2>
          </div>
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading risk data...</div>
          ) : (
            <div className="space-y-3">
              {riskHeatmap.map((city) => (
                <div
                  key={city.city}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${getRiskDotColor(city.riskLevel)}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{city.city}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {city.activePolicies} active policies • {city.totalClaims} claims
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Avg Payout</p>
                      <p className="text-sm font-semibold text-gray-900">₹{city.avgPayout.toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(city.riskLevel)}`}>
                      {city.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
