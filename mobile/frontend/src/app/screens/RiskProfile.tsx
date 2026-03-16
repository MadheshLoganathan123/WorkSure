import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ProgressBar } from "../components/ProgressBar";
import { Activity, CloudRain, Wind, TrendingUp, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";

export function RiskProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<{
    riskScore: number;
    level: string;
    location: string;
    persona: string;
  } | null>(null);

  useEffect(() => {
    async function fetchRiskAssessment() {
      const savedProfile = localStorage.getItem("userProfile");
      if (!savedProfile) {
        navigate("/profile");
        return;
      }

      const profile = JSON.parse(savedProfile);

      try {
        const response = await fetch("http://localhost:3001/api/v1/risk-assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: profile.userId,
            persona: profile.persona,
            location: profile.location
          }),
        });

        const data = await response.json();
        setAssessment(data);
      } catch (error) {
        console.error("Risk assessment failed:", error);
        // Fallback for demo
        setAssessment({
          riskScore: 68,
          level: "Moderate",
          location: profile.location,
          persona: profile.persona
        });
      } finally {
        setTimeout(() => setLoading(false), 1500); // Small delay for premium feel
      }
    }

    fetchRiskAssessment();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl animate-pulse" />
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin relative z-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Analyzing Risk DNA</h2>
        <p className="text-slate-500 font-medium leading-relaxed max-w-[280px]">
          Scanning weather patterns & historical disruption data for {assessment?.location || "your area"}...
        </p>
      </div>
    );
  }

  const riskIndex = assessment?.riskScore || 0;
  const riskLevel = assessment?.level || "Moderate";

  const riskStyles = {
    Low: {
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      stroke: "#10b981",
      icon: ShieldCheck,
      message: "You are in a relatively safe operating zone. Coverage protects against extreme volatility."
    },
    Moderate: {
      color: "text-amber-600 bg-amber-50 border-amber-100",
      stroke: "#f59e0b",
      icon: Activity,
      message: "Standard risk levels detected. Parametric coverage is highly recommended for stability."
    },
    High: {
      color: "text-rose-600 bg-rose-50 border-rose-100",
      stroke: "#f43f5e",
      icon: AlertTriangle,
      message: "High disruption probability in this zone. Immediate parametric protection is advised."
    }
  }[riskLevel as 'Low' | 'Moderate' | 'High'] || { color: "text-slate-600 bg-slate-50 border-slate-100", stroke: "#64748b", icon: Activity, message: "" };

  const riskFactors = [
    {
      icon: CloudRain,
      label: "Weather Volatility",
      description: "Based on local monsoon trends",
      severity: riskIndex > 70 ? "high" : "moderate",
    },
    {
      icon: Wind,
      label: "Health Risk (AQI)",
      description: "Air quality related health impact",
      severity: riskIndex > 50 ? "high" : "moderate",
    },
    {
      icon: TrendingUp,
      label: "Income Stability",
      description: `Disruption profile for ${assessment?.persona || "gig"} work`,
      severity: "moderate",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "moderate":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  return (
    <div className="h-full bg-white flex flex-col pb-6">
      {/* Header with Progress */}
      <div className="px-6 pt-8 pb-4">
        <ProgressBar currentStep={3} totalSteps={4} />
        <h1 className="text-2xl font-black text-slate-800 mt-8 mb-1 leading-tight">
          Your Risk Profile
        </h1>
        <p className="text-slate-500 font-medium">AI-powered parametric engine</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 space-y-8 overflow-y-auto">
        {/* Risk Index Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-50 shadow-2xl shadow-slate-100 relative overflow-hidden">
          <div className="flex items-center justify-center mb-8 relative">
            <div className="relative">
              {/* Circular Progress */}
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="85"
                  stroke="#f1f5f9"
                  strokeWidth="14"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="85"
                  stroke={riskStyles.stroke}
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray={`${(riskIndex / 100) * 534} 534`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <riskStyles.icon className={`w-8 h-8 mb-2`} style={{ color: riskStyles.stroke }} />
                <p className="text-5xl font-black text-slate-800 tracking-tighter">{riskIndex}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Global Risk Score</p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 ${riskStyles.color} text-[11px] font-black uppercase tracking-widest shadow-sm`}
            >
              <div className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: riskStyles.stroke }} />
              {riskLevel} Risk Level
            </div>
            <p className="text-sm text-slate-400 font-medium leading-relaxed px-4">
              {riskStyles.message}
            </p>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="space-y-4">
          <h3 className="text-[13px] text-slate-500 font-black uppercase tracking-widest px-1">Critical Stressors</h3>
          <div className="grid gap-3">
            {riskFactors.map((factor) => {
              const Icon = factor.icon;
              return (
                <div
                  key={factor.label}
                  className={`flex items-center gap-5 p-5 rounded-2xl border-2 ${getSeverityColor(
                    factor.severity
                  )} transition-transform active:scale-[0.98] shadow-sm`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 text-base">{factor.label}</p>
                    <p className="text-xs font-medium opacity-60 leading-tight">{factor.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Plan Badge */}
        <div className="relative group">
          <div className="absolute inset-0 bg-emerald-600 rounded-3xl blur-xl opacity-20 -z-10 transform scale-95" />
          <div className="bg-emerald-600 rounded-3xl p-7 text-white shadow-2xl shadow-emerald-200/50 overflow-hidden relative">
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border border-white/10">AI Recommendation</div>
                </div>
                <h3 className="text-2xl font-black tracking-tight">{riskIndex > 60 ? "Pro" : "Standard"} Coverage</h3>
                <p className="text-xs text-emerald-100/80 font-semibold italic">Optimized specifically for your profile.</p>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center backdrop-blur-md">
                <ShieldCheck className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-8 mt-auto bg-white/80 backdrop-blur-md border-t border-slate-50">
        <Button
          onClick={() => navigate("/plans")}
          className="w-full h-16 text-lg bg-slate-800 hover:bg-slate-900 text-white rounded-[1.5rem] shadow-2xl shadow-slate-200 font-black tracking-wide transition-all transform active:scale-[0.97] flex items-center justify-center gap-2"
        >
          SECURE MY PROTECTION →
        </Button>
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
