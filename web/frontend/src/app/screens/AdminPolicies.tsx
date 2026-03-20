import { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { apiFetch } from '../utils/api';
import { Shield, Search, Filter, MoreVertical, CheckCircle2, XCircle, Clock, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';

export function AdminPolicies() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingPolicy, setProcessingPolicy] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock data for fallback
  const mockPolicies = [
    { id: 'POL-1001', userId: 'USR-882', userName: 'John Doe', plan: 'PRO', status: 'Active', pot: 15000, expiry: '2026-05-12', location: 'Delhi' },
    { id: 'POL-1002', userId: 'USR-883', userName: 'Jane Smith', plan: 'BASIC', status: 'Pending', pot: 5000, expiry: '2026-04-01', location: 'Mumbai' },
    { id: 'POL-1003', userId: 'USR-884', userName: 'Mike Ross', plan: 'STANDARD', status: 'Active', pot: 10000, expiry: '2026-06-20', location: 'Bangalore' },
    { id: 'POL-1004', userId: 'USR-885', userName: 'Rachel Zane', plan: 'PRO', status: 'Expired', pot: 15000, expiry: '2024-02-10', location: 'Chennai' },
    { id: 'POL-1005', userId: 'USR-886', userName: 'Harvey Specter', plan: 'PRO', status: 'Active', pot: 15000, expiry: '2026-08-15', location: 'Delhi' },
    { id: 'POL-1006', userId: 'USR-887', userName: 'Donna Paulsen', plan: 'STANDARD', status: 'Active', pot: 10000, expiry: '2026-07-22', location: 'Mumbai' },
    { id: 'POL-1007', userId: 'USR-888', userName: 'Louis Litt', plan: 'BASIC', status: 'Pending', pot: 5000, expiry: '2026-05-30', location: 'Kolkata' },
    { id: 'POL-1008', userId: 'USR-889', userName: 'Jessica Pearson', plan: 'PRO', status: 'Active', pot: 15000, expiry: '2026-09-10', location: 'Hyderabad' }
  ];

  useEffect(() => {
    fetchPolicies();

    // Auto-refresh every 20 seconds
    const interval = setInterval(() => {
      fetchPolicies(true);
    }, 20000);

    return () => clearInterval(interval);
  }, [filterStatus]);

  const fetchPolicies = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const endpoint = filterStatus === 'ALL' 
        ? '/api/v1/admin/policies' 
        : `/api/v1/admin/policies?status=${filterStatus}`;
      const data = await apiFetch(endpoint);
      setPolicies(data && data.length > 0 ? data : mockPolicies);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch policies:', error);
      // Use mock data as fallback
      setPolicies(mockPolicies);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updatePolicyStatus = async (id: string, status: string) => {
    setProcessingPolicy(id);
    try {
      await apiFetch(`/api/v1/admin/policies/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      await fetchPolicies();
    } catch (error) {
      console.error('Failed to update policy:', error);
      alert('Failed to update policy status. Please try again.');
    } finally {
      setProcessingPolicy(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'EXPIRED': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'TERMINATED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredPolicies = policies.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Policy Management</h1>
            <p className="text-sm text-gray-500">
              Monitor and manage all parametric protection policies
              {lastUpdated && (
                <span className="ml-2 text-xs text-gray-400">
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchPolicies(true)}
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
                placeholder="Search policies..." 
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
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>

        {/* Policies Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Policy ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Worker (User ID)</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Protection Pot</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading policies...</td>
                </tr>
              ) : filteredPolicies.length > 0 ? (
                filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{policy.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{policy.userName}</span>
                        <span className="text-xs text-gray-400">{policy.userId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        policy.plan === 'PRO' ? 'bg-purple-100 text-purple-700' :
                        policy.plan === 'STANDARD' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {policy.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(policy.status)}`}>
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 text-sm">₹{policy.pot.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{policy.expiry}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {policy.status === 'Active' ? (
                          <button 
                            onClick={() => updatePolicyStatus(policy.id, 'Terminated')}
                            disabled={processingPolicy === policy.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Terminate Policy"
                          >
                            {processingPolicy === policy.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                          </button>
                        ) : policy.status === 'Pending' ? (
                          <button 
                            onClick={() => updatePolicyStatus(policy.id, 'Active')}
                            disabled={processingPolicy === policy.id}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Approve Policy"
                          >
                            {processingPolicy === policy.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                          </button>
                        ) : null}
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">No policies found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
