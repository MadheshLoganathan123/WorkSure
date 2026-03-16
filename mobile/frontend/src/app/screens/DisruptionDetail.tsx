import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { CloudRain, MapPin, Clock, DollarSign, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";

export function DisruptionDetail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 flex items-center gap-4 border-b border-slate-700">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Disruption Alert</h1>
          <p className="text-xs text-slate-400">Auto-detected event</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Event Card */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 rounded-3xl p-6 border border-blue-500/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-500/30 rounded-2xl flex items-center justify-center">
              <CloudRain className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                Heavy Rainfall
              </h2>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <p className="text-sm text-slate-300">South Delhi</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Rainfall</p>
              <p className="text-2xl font-bold text-white">45mm</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Duration</p>
              <p className="text-2xl font-bold text-white">3hrs</p>
            </div>
          </div>
        </div>

        {/* Map Thumbnail */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <p className="text-sm font-semibold text-slate-300 mb-3">
            Affected Zone
          </p>
          <div className="relative h-40 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 200 100">
                <circle cx="100" cy="50" r="30" fill="#3b82f6" opacity="0.3" />
                <circle cx="100" cy="50" r="20" fill="#3b82f6" opacity="0.5" />
                <circle cx="100" cy="50" r="10" fill="#3b82f6" opacity="0.8" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse" />
            </div>
            <div className="absolute top-3 right-3 px-3 py-1.5 bg-slate-900/80 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-300 font-semibold">South Delhi</p>
            </div>
          </div>
        </div>

        {/* Impact Estimates */}
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Estimated Lost Hours</p>
                <p className="text-lg font-bold text-white">4.5 hours</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gradient-to-r from-green-600/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-green-300">Projected Payout</p>
                <p className="text-2xl font-bold text-white">₹1,200</p>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Status */}
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white mb-1">
                WorkSure is processing your claim
              </p>
              <p className="text-xs text-slate-400">
                Automated verification in progress
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-400 animate-pulse"
              style={{ width: "65%" }}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => navigate("/auto-claim")}
          className="w-full h-14 bg-green-600 hover:bg-green-500 text-white rounded-2xl shadow-lg shadow-green-600/20"
        >
          View Claim Process
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
