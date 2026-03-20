import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { ArrowLeft, AlertTriangle, Shield, CheckCircle2, Timer } from "lucide-react";
import { Button } from "../components/ui/button";

export function AutoClaim() {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const [countdown, setCountdown] = useState(180); // 3 minutes in seconds
  const [claimId, setClaimId] = useState("WS-2024-1642");

  const stages = [
    {
      id: 1,
      label: "Disruption Detected",
      icon: AlertTriangle,
      status: "complete",
      color: "text-green-400 bg-green-500/20",
    },
    {
      id: 2,
      label: "Fraud Check Passed",
      icon: Shield,
      status: currentStage >= 1 ? "complete" : "pending",
      color: "text-blue-400 bg-blue-500/20",
    },
    {
      id: 3,
      label: "Payout Approved",
      icon: CheckCircle2,
      status: currentStage >= 2 ? "complete" : "pending",
      color: "text-amber-400 bg-amber-500/20",
    },
  ];

  useEffect(() => {
    async function triggerClaim() {
      const savedProfile = localStorage.getItem("userProfile");
      const profile = savedProfile ? JSON.parse(savedProfile) : { userId: "demo_user", location: "Delhi" };

      try {
        const res = await fetch('http://192.168.0.5:3001/api/v1/claims/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: profile.userId,
            location: { lat: 28.6139, lon: 77.2090 }, // Default Delhi
            triggerType: 'rainfall',
            timestamp: new Date().toISOString()
          })
        });
        const data = await res.json();
        if (data.success) {
          setClaimId(data.claim.id);
        }
      } catch (error) {
        console.error("Failed to trigger auto-claim:", error);
      }
    }

    triggerClaim();

    // Simulate stage progression
    const stageTimer = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < 2) return prev + 1;
        clearInterval(stageTimer);
        return prev;
      });
    }, 3000);

    // Countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(countdownTimer);
        return 0;
      });
    }, 1000);

    return () => {
      clearInterval(stageTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
          <h1 className="text-lg font-bold text-white">Auto Claim Processing</h1>
          <p className="text-xs text-slate-400">Claim #WS-2024-1642</p>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Claim Reference */}
        <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 text-center">
          <p className="text-sm text-slate-400 mb-2">Claim Reference ID</p>
          <p className="text-2xl font-bold text-white tracking-wider">
            WS-2024-1642
          </p>
        </div>

        {/* Processing Pipeline */}
        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isComplete = stage.status === "complete";
            const isActive = currentStage === idx;

            return (
              <div key={stage.id} className="relative">
                {idx < stages.length - 1 && (
                  <div
                    className={`absolute left-6 top-16 w-0.5 h-12 transition-all duration-500 ${
                      isComplete ? "bg-green-500" : "bg-slate-700"
                    }`}
                  />
                )}
                <div
                  className={`bg-slate-800 rounded-2xl p-5 border-2 transition-all duration-500 ${
                    isActive
                      ? "border-green-500 shadow-lg shadow-green-500/20"
                      : isComplete
                      ? "border-green-600/50"
                      : "border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        isComplete ? stage.color : "bg-slate-700 text-slate-500"
                      } ${isActive ? "animate-pulse" : ""}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-semibold transition-all ${
                          isComplete ? "text-white" : "text-slate-500"
                        }`}
                      >
                        {stage.label}
                      </p>
                      <p className="text-xs text-slate-400">
                        {isComplete
                          ? "Completed"
                          : isActive
                          ? "In progress..."
                          : "Pending"}
                      </p>
                    </div>
                    {isComplete && (
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payout Timer */}
        <div className="bg-gradient-to-br from-amber-600/20 to-orange-500/20 rounded-2xl p-6 border border-amber-500/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-500/30 rounded-xl flex items-center justify-center">
              <Timer className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-amber-300">Est. Payout Time</p>
              <p className="text-xs text-amber-400/70">Live countdown</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold text-white mb-2">
              {formatTime(countdown)}
            </p>
            <p className="text-sm text-amber-300">minutes remaining</p>
          </div>
        </div>

        {/* Payout Amount */}
        {currentStage >= 2 && (
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-sm text-green-300 mb-2">Approved Payout</p>
            <p className="text-5xl font-bold text-white mb-2">₹1,200</p>
            <p className="text-xs text-green-400">
              Will be credited to your WorkSure Wallet
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {currentStage >= 2 ? (
            <Button
              onClick={() => navigate("/claims")}
              className="w-full h-14 bg-green-600 hover:bg-green-500 text-white rounded-2xl shadow-lg"
            >
              View in Claim History
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/fraud-check")}
              variant="outline"
              className="w-full h-14 bg-slate-800 border-2 border-slate-700 text-white rounded-2xl hover:border-green-500/50"
            >
              View Fraud Check Details
            </Button>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
