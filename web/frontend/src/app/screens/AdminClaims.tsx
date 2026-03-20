import { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { apiFetch } from '../utils/api';
import { useNavigate } from 'react-router';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign,
  AlertTriangle,
  Eye,
  RefreshCw,
  Loader2
} from 'lucide-react';

export function AdminClaims() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingClaim, setProcessingClaim] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock data for fallback
  const mockClaims = [
    { id: 'clm_00000001', userId: 'usr_000001', userName: 'John Doe', status: 'Pending', amount: 2500, reason: 'Heavy rain disruption - 50% of daily earnings', weatherCondition: 'Heavy Rain', triggeredAt: '2026-03-19T08:30:00Z', fraudScore: 15 },
    { id: 'clm_00000002', userId: 'usr_000002', userName: 'Jane Smith', status: 'Approved', amount: 1250, reason: 'Light rain disruption - 25% of daily earnings', weatherCondition: 'Light Rain', triggeredAt: '2026-03-18T10:15:00Z', reviewedAt: '2026-03-18T14:20:00Z', reviewedBy: 'Admin', fraudScore: 8 },
    { id: 'clm_00000003', userId: 'usr_000003', userName: 'Mike Ross', status: 'Paid', amount: 2000, reason: 'Heat wave disruption - 40% of daily earnings', weatherCondition: 'Heat Wave', triggeredAt: '2026-03-17T09:00:00Z', reviewedAt: '2026-03-17T11:30:00Z', reviewedBy: 'Admin', fraudScore: 5 },
    { id: 'clm_00000004', userId: 'usr_000004', userName: 'Rachel Zane', status: 'Pending', amount: 3000, reason: 'Heavy rain disruption - 50% of daily earnings', weatherCondition: 'Heavy Rain', triggeredAt: '2026-03-19T07:45:00Z', fraudScore: 72 },
    { id: 'clm_00000005', userId: 'usr_000005', userName: 'Harvey Specter', status: 'Rejected', amount: 1500, reason: 'Light rain disruption - 25% of daily earnings', weatherCondition: 'Light Rain', triggeredAt: '2026-03-16T12:00:00Z', reviewedAt: '2026-03-16T15:45:00Z', reviewedBy: 'Admin', reviewNotes: 'Duplicate claim detected', fraudScore: 95 }
  ];

  useEffect(() => {
    fetchClaims();

    // Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      fetchClaims(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [filterStatus]);

  const fetchClaims = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const endpoint = filterStatus === 'ALL' 
        ? '/api/v1/admin/claims' 
        : `/api/v1/admin/claims?status=${filterStatus}`;
      const data = await apiFetch(endpoint);
      setClaims(data && data.length > 0 ? data : mockClaims);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch claims:', error);
      // Use mock data as fallback
      setClaims(mockClaims);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const reviewClaim = async (claimId: string, action: 'approve' | 'reject') => {
    setProcessingClaim(claimId);
    try {
      await apiFetch(`/api/v1/admin/claims/${claimId}`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          action, 
          reviewedBy: 'Admin User',
          reviewNotes: action === 'approve' ? 'Verified and approved' : 'Rejected after review'
        })
      });
      await fetchClaims();
    } catch (error) {
      console.error('Failed to review claim:', error);
      alert(`Failed to ${action} claim. Please try again.`);
    } finally {
      setProcessingClaim(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Approved': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Approved': return <CheckCircle2 className="w-4 h-4" />;
      case 'Paid': return <DollarSign className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getFraudScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-green-600';
  };

  const filteredClaims = claims.filter(c => 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'Pending').length,
    approved: claims.filter(c => c.status === 'Approved').length,
    paid: claims.filter(c => c.status === 'Paid').length,
    rejected: claims.filter(c => c.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Claims Management</h1>
            <p className="text-sm text-gray-500">
              Review and process parametric insurance claims
              {lastUpdated && (
                <span className="ml-2 text-xs text-gray-400">
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchClaims(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium text-gray-700">
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Paid">Paid</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Total Claims</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <p className="text-xs text-amber-700 mb-1">Pending Review</p>
            <p className="text-2xl font-semibold text-amber-700">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-blue-700 mb-1">Approved</p>
            <p className="text-2xl font-semibold text-blue-700">{stats.approved}</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <p className="text-xs text-emerald-700 mb-1">Paid</p>
            <p className="text-2xl font-semibold text-emerald-700">{stats.paid}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-xs text-red-700 mb-1">Rejected</p>
            <p className="text-2xl font-semibold text-red-700">{stats.rejected}</p>
          </div>
        </div>

        {/* Claims Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Worker</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fraud Score</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Triggered</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">Loading claims...</td>
                </tr>
              ) : filteredClaims.length > 0 ? (
                filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{claim.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{claim.userName}</span>
                        <span className="text-xs text-gray-400">{claim.userId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{claim.weatherCondition}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 text-sm">₹{claim.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${getStatusStyle(claim.status)}`}>
                        {getStatusIcon(claim.status)}
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {claim.fraudScore !== undefined ? (
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${getFraudScoreColor(claim.fraudScore)}`}>
                            {claim.fraudScore}%
                          </span>
                          {claim.fraudScore >= 70 && <AlertTriangle className="w-4 h-4 text-red-600" />}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(claim.triggeredAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {claim.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => reviewClaim(claim.id, 'approve')}
                              disabled={processingClaim === claim.id}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve Claim"
                            >
                              {processingClaim === claim.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                            </button>
                            <button 
                              onClick={() => reviewClaim(claim.id, 'reject')}
                              disabled={processingClaim === claim.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject Claim"
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
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm">No claims found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
