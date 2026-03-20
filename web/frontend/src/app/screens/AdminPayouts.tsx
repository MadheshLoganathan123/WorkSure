import { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { apiFetch } from '../utils/api';
import { 
  DollarSign, 
  Search, 
  TrendingUp,
  Download,
  CheckCircle2,
  Clock,
  Calendar
} from 'lucide-react';

export function AdminPayouts() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Mock data for fallback
  const mockClaims = [
    { id: 'clm_00000002', userId: 'usr_000002', userName: 'Jane Smith', amount: 1250, status: 'Approved', approvedAt: '2026-03-18T14:20:00Z', paidAt: null, reviewedBy: 'Admin' },
    { id: 'clm_00000003', userId: 'usr_000003', userName: 'Mike Ross', amount: 2000, status: 'Paid', approvedAt: '2026-03-17T11:30:00Z', paidAt: '2026-03-17T15:00:00Z', reviewedBy: 'Admin' }
  ];

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/v1/admin/claims');
      // Filter claims that are approved or paid
      const payoutClaims = data.filter((c: any) => 
        c.status === 'Approved' || c.status === 'Paid'
      );
      setClaims(payoutClaims && payoutClaims.length > 0 ? payoutClaims : mockClaims);
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
      // Use mock data as fallback
      setClaims(mockClaims);
    } finally {
      setLoading(false);
    }
  };

  const filteredClaims = claims.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && c.status === statusFilter;
  });

  const stats = {
    totalPaid: claims.filter(c => c.status === 'Paid').reduce((sum, c) => sum + c.amount, 0),
    pendingPayout: claims.filter(c => c.status === 'Approved').reduce((sum, c) => sum + c.amount, 0),
    paidCount: claims.filter(c => c.status === 'Paid').length,
    pendingCount: claims.filter(c => c.status === 'Approved').length,
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Payouts Management</h1>
            <p className="text-sm text-gray-500">Track and manage claim disbursements</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search payouts..." 
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="Approved">Pending Payout</option>
              <option value="Paid">Paid</option>
            </select>
            <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Paid Out</p>
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-semibold text-gray-900">₹{stats.totalPaid.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% from last month
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-amber-700">Pending Payout</p>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-semibold text-amber-700">₹{stats.pendingPayout.toLocaleString()}</p>
            <p className="text-xs text-amber-600 mt-2">{stats.pendingCount} claims awaiting</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-emerald-700">Completed</p>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-semibold text-emerald-700">{stats.paidCount}</p>
            <p className="text-xs text-emerald-600 mt-2">Successfully disbursed</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-700">Avg Payout</p>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-semibold text-blue-700">
              ₹{stats.paidCount > 0 ? Math.round(stats.totalPaid / stats.paidCount).toLocaleString() : 0}
            </p>
            <p className="text-xs text-blue-600 mt-2">Per claim</p>
          </div>
        </div>

        {/* Payouts Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Payout History</h2>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Worker</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reviewed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading payouts...</td>
                </tr>
              ) : filteredClaims.length > 0 ? (
                filteredClaims.map((claim) => (
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
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">₹{claim.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      {claim.status === 'Paid' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-700 border-emerald-200 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          Paid
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {claim.approvedAt ? new Date(claim.approvedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {claim.paidAt ? new Date(claim.paidAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {claim.reviewedBy || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">No payouts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
