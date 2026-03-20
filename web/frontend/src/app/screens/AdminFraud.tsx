import { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { apiFetch } from '../utils/api';
import { useNavigate } from 'react-router';
import { 
  Shield, 
  AlertTriangle, 
  Search, 
  TrendingUp,
  Eye,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export function AdminFraud() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Mock data for fallback
  const mockClaims = [
    { id: 'clm_00000001', userName: 'John Doe', userId: 'usr_000001', amount: 2500, fraudScore: 15, status: 'Pending', reason: 'Heavy rain disruption - 50% of daily earnings' },
    { id: 'clm_00000002', userName: 'Jane Smith', userId: 'usr_000002', amount: 1250, fraudScore: 8, status: 'Approved', reason: 'Light rain disruption - 25% of daily earnings' },
    { id: 'clm_00000003', userName: 'Mike Ross', userId: 'usr_000003', amount: 2000, fraudScore: 5, status: 'Paid', reason: 'Heat wave disruption - 40% of daily earnings' },
    { id: 'clm_00000004', userName: 'Rachel Zane', userId: 'usr_000004', amount: 3000, fraudScore: 72, status: 'Pending', reason: 'Heavy rain disruption - 50% of daily earnings' },
    { id: 'clm_00000005', userName: 'Harvey Specter', userId: 'usr_000005', amount: 1500, fraudScore: 95, status: 'Rejected', reason: 'Light rain disruption - 25% of daily earnings' }
  ];

  useEffect(() => {
    fetchFraudAlerts();
  }, []);

  const fetchFraudAlerts = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/v1/admin/claims');
      // Filter claims with fraud scores
      const fraudClaims = data.filter((c: any) => c.fraudScore !== undefined);
      setClaims(fraudClaims && fraudClaims.length > 0 ? fraudClaims : mockClaims);
    } catch (error) {
      console.error('Failed to fetch fraud alerts:', error);
      // Use mock data as fallback
      setClaims(mockClaims);
    } finally {
      setLoading(false);
    }
  };

  const reviewClaim = async (claimId: string, action: 'approve' | 'reject') => {
    try {
      await apiFetch(`/api/v1/admin/claims/${claimId}`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          action, 
          reviewedBy: 'Fraud Team',
          reviewNotes: action === 'approve' ? 'Fraud check passed' : 'Flagged as fraudulent'
        })
      });
      fetchFraudAlerts();
    } catch (error) {
      console.error('Failed to review claim:', error);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'bg-red-100 text-red-700 border-red-300';
    if (score >= 40) return 'bg-amber-100 text-amber-700 border-amber-300';
    return 'bg-green-100 text-green-700 border-green-300';
  };

  const filteredClaims = claims.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (riskFilter === 'ALL') return matchesSearch;
    const riskLevel = getRiskLevel(c.fraudScore);
    return matchesSearch && riskLevel === riskFilter;
  });

  const stats = {
    total: claims.length,
    high: claims.filter(c => c.fraudScore >= 70).length,
    medium: claims.filter(c => c.fraudScore >= 40 && c.fraudScore < 70).length,
    low: claims.filter(c => c.fraudScore < 40).length,
    avgScore: claims.length > 0 
      ? Math.round(claims.reduce((sum, c) => sum + c.fraudScore, 0) / claims.length) 
      : 0,
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Fraud Monitor</h1>
            <p className="text-sm text-gray-500">AI-powered fraud detection and risk assessment</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search claims..." 
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="ALL">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Total Monitored</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-red-700">High Risk</p>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-2xl font-semibold text-red-700">{stats.high}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <p className="text-xs text-amber-700 mb-1">Medium Risk</p>
            <p className="text-2xl font-semibold text-amber-700">{stats.medium}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-xs text-green-700 mb-1">Low Risk</p>
            <p className="text-2xl font-semibold text-green-700">{stats.low}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-blue-700">Avg Score</p>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-semibold text-blue-700">{stats.avgScore}%</p>
          </div>
        </div>

        {/* Fraud Alerts Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Fraud Detection Alerts</h2>
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Worker</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fraud Score</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">Loading fraud alerts...</td>
                </tr>
              ) : filteredClaims.length > 0 ? (
                filteredClaims.map((claim) => {
                  const riskLevel = getRiskLevel(claim.fraudScore);
                  return (
                    <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{claim.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{claim.userName}</span>
                          <span className="text-xs text-gray-400">{claim.userId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 text-sm">₹{claim.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px]">
                            <div 
                              className={`h-2 rounded-full ${
                                claim.fraudScore >= 70 ? 'bg-red-600' :
                                claim.fraudScore >= 40 ? 'bg-amber-600' : 'bg-green-600'
                              }`}
                              style={{ width: `${claim.fraudScore}%` }}
                            />
                          </div>
                          <span className={`text-sm font-semibold ${
                            claim.fraudScore >= 70 ? 'text-red-600' :
                            claim.fraudScore >= 40 ? 'text-amber-600' : 'text-green-600'
                          }`}>
                            {claim.fraudScore}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRiskColor(claim.fraudScore)}`}>
                          {riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${
                          claim.status === 'Pending' ? 'text-amber-600' :
                          claim.status === 'Approved' ? 'text-blue-600' :
                          claim.status === 'Rejected' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 line-clamp-1">{claim.reason}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {claim.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => reviewClaim(claim.id, 'approve')}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => reviewClaim(claim.id, 'reject')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => navigate(`/admin/claim/${claim.id}`)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm">No fraud alerts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
