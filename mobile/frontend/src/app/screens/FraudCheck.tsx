import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { ArrowLeft, MapPin, Smartphone, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";

export function FraudCheck() {
  const navigate = useNavigate();
  const consistencyScore = 94;

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 flex items-center gap-4 border-b border-slate-700">
        <button
          onClick={() => navigate("/auto-claim")}
          className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Fraud Check</h1>
          <p className="text-xs text-slate-400">Transparency Report</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Verification Badge */}
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-500/20 rounded-3xl p-8 border-2 border-green-500/30 text-center">
          <div className="w-20 h-20 bg-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Your claim is verified
          </h2>
          <p className="text-sm text-green-300">
            All checks passed successfully
          </p>
        </div>

        {/* GPS Activity Heatmap */}
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-white">GPS Activity Heatmap</p>
              <p className="text-xs text-slate-400">Location verification</p>
            </div>
          </div>

          <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl overflow-hidden border border-slate-600">
            {/* Heatmap visualization */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 200 150">
                {/* Heat zones */}
                <circle
                  cx="70"
                  cy="60"
                  r="25"
                  fill="#22c55e"
                  opacity="0.2"
                  className="animate-pulse"
                />
                <circle cx="70" cy="60" r="15" fill="#22c55e" opacity="0.4" />
                <circle cx="70" cy="60" r="8" fill="#22c55e" opacity="0.6" />

                <circle
                  cx="130"
                  cy="90"
                  r="20"
                  fill="#fbbf24"
                  opacity="0.2"
                  className="animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                />
                <circle cx="130" cy="90" r="12" fill="#fbbf24" opacity="0.4" />

                <circle
                  cx="100"
                  cy="45"
                  r="18"
                  fill="#3b82f6"
                  opacity="0.2"
                  className="animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
                <circle cx="100" cy="45" r="10" fill="#3b82f6" opacity="0.4" />
              </svg>
            </div>

            {/* Location markers */}
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-slate-900/90 rounded-lg border border-slate-700">
              <p className="text-xs text-green-400 font-semibold flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Active Zone
              </p>
            </div>

            <div className="absolute bottom-4 left-4 flex gap-2">
              <div className="px-2 py-1 bg-slate-900/80 rounded text-xs text-slate-300 border border-slate-700">
                23 locations
              </div>
              <div className="px-2 py-1 bg-slate-900/80 rounded text-xs text-slate-300 border border-slate-700">
                4.2km radius
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-green-500 rounded-sm opacity-60" />
            <span className="text-slate-400">High activity</span>
            <div className="w-3 h-3 bg-amber-500 rounded-sm opacity-60 ml-2" />
            <span className="text-slate-400">Medium activity</span>
          </div>
        </div>

        {/* Platform Login Confirmation */}
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">Platform Login</p>
              <p className="text-xs text-slate-400">Activity confirmation</p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-400" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-red-400">Z</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Zomato</p>
                  <p className="text-xs text-slate-400">Active during event</p>
                </div>
              </div>
              <div className="px-2 py-1 bg-green-500/20 rounded text-xs text-green-400 font-semibold border border-green-500/30">
                Verified
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-400">S</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Swiggy</p>
                  <p className="text-xs text-slate-400">Logged out</p>
                </div>
              </div>
              <div className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-400 font-semibold">
                Inactive
              </div>
            </div>
          </div>
        </div>

        {/* Consistency Score */}
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">Claim Consistency Score</p>
              <p className="text-xs text-slate-400">Pattern analysis</p>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-end justify-between mb-2">
              <span className="text-sm text-slate-400">Score</span>
              <span className="text-3xl font-bold text-green-400">
                {consistencyScore}%
              </span>
            </div>
            <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600 to-emerald-400 rounded-full"
                style={{ width: `${consistencyScore}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-700">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <p className="text-xs text-slate-400">
              Excellent match with historical patterns
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => navigate("/auto-claim")}
          className="w-full h-14 bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-700 rounded-2xl"
        >
          Back to Claim Process
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
