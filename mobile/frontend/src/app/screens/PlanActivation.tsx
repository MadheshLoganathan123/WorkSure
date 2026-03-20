import { useState } from "react";
import { useNavigate } from "react-router";
import { ProgressBar } from "../components/ProgressBar";
import { Check, Star, Zap, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";

export function PlanActivation() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [autoRenew, setAutoRenew] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 29,
      icon: Check,
      color: "from-slate-400 to-slate-500",
      features: [
        { text: "₹5,000 coverage per incident", included: true },
        { text: "24/7 customer support", included: true },
        { text: "3-day claim processing", included: true },
        { text: "Weather protection", included: false },
        { text: "Vehicle maintenance cover", included: false },
        { text: "Health checkup credits", included: false },
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 49,
      icon: Star,
      color: "from-emerald-400 to-green-500",
      recommended: true,
      features: [
        { text: "₹10,000 coverage per incident", included: true },
        { text: "24/7 priority support", included: true },
        { text: "Same-day claim processing", included: true },
        { text: "Weather protection", included: true },
        { text: "Vehicle maintenance cover", included: true },
        { text: "Health checkup credits", included: false },
      ],
    },
    {
      id: "max",
      name: "Max",
      price: 79,
      icon: Zap,
      color: "from-purple-400 to-indigo-500",
      features: [
        { text: "₹20,000 coverage per incident", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Instant claim approval", included: true },
        { text: "Weather protection", included: true },
        { text: "Vehicle maintenance cover", included: true },
        { text: "Health checkup credits", included: true },
      ],
    },
  ];

  const handleActivation = async () => {
    setIsLoading(true);
    const savedProfile = localStorage.getItem("userProfile");
    const profile = savedProfile ? JSON.parse(savedProfile) : { userId: "demo_user", displayName: "Partner" };
    const plan = plans.find(p => p.id === selectedPlan);

    const policyData = {
      planId: selectedPlan,
      plan: selectedPlan,
      premium: plan?.price || 49,
      status: "Active",
      expiresAt: "25/4/2026",
      expiry: "25/4/2026",
      coverageAmount: selectedPlan === 'starter' ? 5000 : selectedPlan === 'pro' ? 10000 : 20000,
      pot: selectedPlan === 'starter' ? 5000 : selectedPlan === 'pro' ? 10000 : 20000,
      policyNumber: 'POL-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      id: 'POL-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: profile.userId,
      userName: profile.displayName
    };

    try {
      // Try to save to backend
      const response = await fetch("http://localhost:3001/api/v1/policy/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile.userId,
          planId: selectedPlan,
          coverageAmount: policyData.coverageAmount,
          premium: plan?.price || 49
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.policy) {
          localStorage.setItem("activePolicy", JSON.stringify(data.policy));
          navigate("/dashboard");
          return;
        }
      }
    } catch (error) {
      console.error("Backend policy activation failed:", error);
    }

    // Fallback: Save to local storage and navigate
    localStorage.setItem("activePolicy", JSON.stringify(policyData));
    setIsLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      {/* Header with Progress */}
      <div className="px-6 pt-8 pb-4">
        <ProgressBar currentStep={4} totalSteps={4} />
        <h1 className="text-2xl font-black text-slate-800 mt-8 mb-1 leading-tight">
          Choose Your Plan
        </h1>
        <p className="text-slate-500 font-medium">Parametric protection starts here</p>
      </div>

      {/* Plans */}
      <div className="flex-1 px-6 space-y-4 overflow-y-auto pb-64 pt-2">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;

          return (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full bg-white rounded-[2rem] p-6 text-left transition-all border-2 relative overflow-hidden group ${isSelected
                  ? "border-emerald-500 shadow-xl shadow-emerald-50/50"
                  : "border-slate-100 hover:border-slate-200"
                }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 p-2 text-emerald-500">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 leading-none mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">per week</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-0.5 justify-end">
                    <span className="text-sm font-black text-slate-800">₹</span>
                    <span className="text-3xl font-black text-slate-800 tracking-tighter">{plan.price}</span>
                  </div>
                  {plan.recommended && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100 uppercase tracking-tight">
                      AI MATCH
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 gap-y-2.5">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" strokeWidth={4} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      </div>
                    )}
                    <span className={`text-[13px] font-medium leading-none ${feature.included ? "text-slate-700" : "text-slate-300"}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Absolute Bottom CTA Container */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 px-6 pt-6 pb-2 z-50">
        <div className="flex items-center justify-between mb-6 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-inner">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-800 text-sm">Weekly Auto-renewal</p>
            <p className="text-[11px] text-slate-500 font-medium italic leading-none">Continuous parametric security</p>
          </div>
          <Switch checked={autoRenew} onCheckedChange={setAutoRenew} className="data-[state=checked]:bg-emerald-500" />
        </div>

        <Button
          onClick={handleActivation}
          disabled={isLoading}
          className="w-full h-16 text-lg bg-slate-800 hover:bg-slate-900 text-white rounded-[1.5rem] shadow-xl shadow-slate-200 font-black tracking-wide transition-all transform active:scale-[0.97] flex items-center justify-center gap-2 mb-2"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-emerald-400" /> : "ACTIVATE WORKSURE →"}
        </Button>

        <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest pb-2">
          {autoRenew ? "Auto-billing enabled" : "Manual renewal required"}
        </p>
      </div>
    </div>
  );
}