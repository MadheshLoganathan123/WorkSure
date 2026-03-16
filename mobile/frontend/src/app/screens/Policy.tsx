import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { Shield, CheckCircle2, Calendar, FileText, ExternalLink, ShieldAlert, Zap } from "lucide-react";

export function Policy() {
  const navigate = useNavigate();
  const [activePolicy, setActivePolicy] = useState<{
    planId: string;
    premium: number;
    status: string;
    expiresAt?: string;
    coverageAmount?: number;
    policyNumber?: string;
  } | null>(null);

  useEffect(() => {
    const policy = localStorage.getItem("activePolicy");
    if (policy) {
      const parsed = JSON.parse(policy);
      // Add fake policy number if missing
      setActivePolicy({
        ...parsed,
        policyNumber: parsed.policyNumber || "WS-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        expiresAt: parsed.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }
  }, []);

  return (
    <div className="h-full bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900/50 px-6 pt-10 pb-6 border-b border-white/5">
        <h1 className="text-2xl font-black text-white tracking-tight">Your Coverage</h1>
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">Parametric Protection Live</p>
      </div>

      <div className="flex-1 px-6 pt-8 space-y-6 overflow-y-auto pb-32">
        {activePolicy ? (
          <>
            {/* Policy Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500 rounded-[2.5rem] blur-2xl opacity-10 -z-10" />
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                      <Shield className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-emerald-500/20">
                      Active
                    </div>
                  </div>

                  <div className="space-y-1 mb-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Type</p>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                      {activePolicy.planId.toUpperCase()}
                      <Zap className="w-5 h-5 text-amber-400" fill="currentColor" />
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Policy No.</p>
                      <p className="text-sm font-bold text-white tracking-widest">{activePolicy.policyNumber}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protection Pot</p>
                      <p className="text-lg font-black text-emerald-400 tracking-tighter">₹{activePolicy.coverageAmount?.toLocaleString() || "10,000"}</p>
                    </div>
                  </div>
                </div>
                {/* Decorative lines */}
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Shield className="w-40 h-40 transform translate-x-12 -translate-y-12" />
                </div>
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-widest px-2">Coverage Summary</h3>

              <div className="bg-slate-900/40 rounded-3xl border border-white/5 divide-y divide-white/5">
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <p className="text-sm font-bold text-slate-300">Valid Until</p>
                  </div>
                  <p className="text-sm font-black text-white">{activePolicy.expiresAt}</p>
                </div>

                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <p className="text-sm font-bold text-slate-300">Rainfall Disruption</p>
                  </div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md">Live</p>
                </div>

                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <p className="text-sm font-bold text-slate-300">AQI Health Impact</p>
                  </div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md">Live</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              <button className="w-full h-15 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-800 transition-colors">
                <FileText className="w-4 h-4" />
                Download Document
              </button>
              <button className="w-full h-15 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-800 transition-colors">
                <ExternalLink className="w-4 h-4" />
                Policy Terms
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 pt-20">
            <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center border border-white/5">
              <ShieldAlert className="w-10 h-10 text-slate-700" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">No Active Policy</h3>
              <p className="text-sm text-slate-500 max-w-[200px] font-medium leading-relaxed">Secure your gig income today by selecting a plan.</p>
            </div>
            <button onClick={() => navigate("/plans")} className="px-8 h-12 bg-emerald-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
              View Plans
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
