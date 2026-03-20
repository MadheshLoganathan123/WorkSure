import { AdminSidebar } from '../components/AdminSidebar';
import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Cloud,
  Wind,
  Droplet,
} from 'lucide-react';

export function ClaimReviewDetail() {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [claim, setClaim] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for when backend doesn't return full details
  const mockClaimDetails = {
    workerName: 'John Doe',
    workerId: 'WKR-12345',
    platform: 'Uber',
    zone: 'South Delhi',
    policyTier: 'PRO',
    premiumPaid: '₹499/month',
    apiData: {
      source: 'Open-Meteo API',
      timestamp: new Date().toLocaleString(),
      rainfall: '45mm',
      aqiLevel: '285'
    },
    gpsTrace: {
      claimed: '28.5355° N, 77.3910° E',
      actual: '28.7041° N, 77.1025° E'
    },
    anomalyReason: 'GPS coordinates mismatch detected. Device location differs from claimed work zone by 15km.',
    fraudScore: 87,
    anomalyType: 'GPS Spoof',
    claimAmount: '₹2,500',
    triggeredAt: new Date().toLocaleString(),
    timeline: [
      { status: 'Claim Auto-Triggered', time: '2 hours ago', completed: true },
      { status: 'Weather Data Verified', time: '1 hour ago', completed: true },
      { status: 'Fraud Check Flagged', time: '45 mins ago', completed: true },
      { status: 'Manual Review Pending', time: 'Now', completed: false },
      { status: 'Payout Processing', time: 'Pending', completed: false }
    ]
  };

  useEffect(() => {
    async function fetchClaim() {
      try {
        const data = await apiFetch(`/api/v1/admin/claims/${claimId}`);
        // Merge fetched data with mock data to ensure all fields exist
        setClaim({
          ...mockClaimDetails,
          ...data,
          id: data.id || claimId,
          apiData: data.apiData || mockClaimDetails.apiData,
          gpsTrace: data.gpsTrace || mockClaimDetails.gpsTrace,
          timeline: data.timeline || mockClaimDetails.timeline
        });
      } catch (e) {
        console.error('Failed to fetch claim:', e);
        // Use mock data as fallback
        setClaim({
          ...mockClaimDetails,
          id: claimId
        });
      } finally {
        setLoading(false);
      }
    }
    fetchClaim();
  }, [claimId]);

  const handleApprove = async () => {
    try {
      await apiFetch(`/api/v1/admin/claims/${claimId}`, { 
        method: 'PATCH',
        body: JSON.stringify({
          action: 'approve',
          reviewedBy: 'Admin User',
          reviewNotes: 'Approved after manual review'
        })
      });
      alert('Claim approved and payout initiated');
      navigate('/admin/claims');
    } catch (e) {
      console.error('Approval failed:', e);
      alert('Failed to approve claim. Please try again.');
    }
  };

  const handleReject = async () => {
    try {
      await apiFetch(`/api/v1/admin/claims/${claimId}`, { 
        method: 'PATCH',
        body: JSON.stringify({
          action: 'reject',
          reviewedBy: 'Admin User',
          reviewNotes: 'Rejected due to fraud detection'
        })
      });
      alert('Claim rejected and worker notified');
      navigate('/admin/claims');
    } catch (e) {
      console.error('Rejection failed:', e);
      alert('Failed to reject claim. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center">
        <p className="text-gray-600">Loading claim details...</p>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center">
        <p className="text-red-600">Claim not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <AdminSidebar />

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Overview</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Claim Review: {claim.id}
              </h1>
              <p className="text-sm text-gray-500">Flagged for manual review</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Reject Claim
              </button>
              <button
                onClick={() => setShowApproveModal(true)}
                className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Approve Claim
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Worker & Evidence */}
          <div className="col-span-2 space-y-6">
            {/* Worker Profile Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Worker Profile</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Worker Name</p>
                  <p className="text-base font-medium text-gray-900">{claim?.workerName || claim?.userName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Worker ID</p>
                  <p className="text-base font-medium text-gray-900">{claim?.workerId || claim?.userId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Platform</p>
                  <p className="text-base font-medium text-gray-900">{claim?.platform || 'WorkSure'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Operating Zone</p>
                  <p className="text-base font-medium text-gray-900">{claim?.zone || 'Delhi'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Policy Tier</p>
                  <span className="inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    {claim?.policyTier || 'PRO'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Premium</p>
                  <p className="text-base font-medium text-gray-900">{claim?.premiumPaid || '₹499/month'}</p>
                </div>
              </div>
            </div>

            {/* Disruption Evidence */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Disruption Evidence
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Cloud className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Weather API Data
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Data Source</p>
                    <p className="text-sm font-medium text-gray-900">
                      {claim?.apiData?.source || 'Open-Meteo API'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Timestamp</p>
                    <p className="text-sm font-medium text-gray-900">
                      {claim?.apiData?.timestamp || new Date().toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500">Rainfall</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {claim?.apiData?.rainfall || '45mm'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-gray-500">AQI Level</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {claim?.apiData?.aqiLevel || '285'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-amber-900 mb-1">
                      Disruption Qualified
                    </h3>
                    <p className="text-sm text-amber-700">
                      Rainfall exceeds 40mm threshold for automatic claim trigger in the
                      specified zone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* GPS Comparison */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                GPS Location Verification
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Claimed Location
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700">{claim?.gpsTrace?.claimed || '28.5355° N, 77.3910° E'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Device GPS Data
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700">{claim?.gpsTrace?.actual || '28.7041° N, 77.1025° E'}</p>
                </div>
              </div>
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-900 mb-1">
                      Suspicious Pattern Detected
                    </h3>
                    <p className="text-sm text-red-700">{claim?.anomalyReason || 'GPS coordinates mismatch detected'}</p>
                  </div>
                </div>
              </div>
              {/* Mock GPS Map Placeholder */}
              <div className="mt-4 bg-gray-100 rounded-lg h-48 flex items-center justify-center border border-gray-300">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">GPS Trace Visualization</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Device movement pattern analysis
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Fraud Score & Timeline */}
          <div className="space-y-6">
            {/* AI Fraud Confidence Score */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                AI Fraud Analysis
              </h2>
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-40 h-40">
                  {/* Gauge background */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={claim.fraudScore >= 85 ? '#ef4444' : '#f59e0b'}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(claim.fraudScore / 100) * 440} 440`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p
                      className={`text-4xl font-bold ${
                        claim.fraudScore >= 85 ? 'text-red-600' : 'text-amber-600'
                      }`}
                    >
                      {claim.fraudScore}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Risk Score</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Anomaly Type</span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    {claim.anomalyType}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Claim Amount</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {claim.claimAmount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Triggered At</span>
                  <span className="text-sm text-gray-900">{claim.triggeredAt}</span>
                </div>
              </div>
            </div>

            {/* Claim Timeline */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Claim Timeline</h2>
              <div className="space-y-4">
                {claim.timeline.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      {step.completed ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          step.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {step.status}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Approve Claim?</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              This will approve claim {claim.id} and initiate payout of {claim.claimAmount}{' '}
              to worker {claim.workerId}. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Reject Claim?</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              This will reject claim {claim.id} due to suspected fraud. The worker will be
              notified and no payout will be processed. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
