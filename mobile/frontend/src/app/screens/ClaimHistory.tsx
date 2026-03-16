import { useState, useEffect } from "react";
import { BottomNav } from "../components/BottomNav";
import { FileText, Clock, CheckCircle2, AlertCircle, MapPin, Loader2, Search, TrendingDown } from "lucide-react";

export function ClaimHistory() {
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState<any[]>([]);

  useEffect(() => {
    async function fetchClaims() {
      const savedProfile = localStorage.getItem("userProfile");
      const profile = savedProfile ? JSON.parse(savedProfile) : { userId: "demo_user" };

      try {
        const response = await fetch(`http://localhost:3001/api/v1/claims/history?userId=${profile.userId}`);
        const data = await response.json();
        setClaims(data);
      } catch (error) {
        console.error("Claims fetch failed:", error);
        // Fallback for demo
        setClaims([
          {
            id: "CLM-8821",
            type: "Heavy Rainfall",
            amount: 1200,
            status: "COMPLETED",
            date: "15 Mar 2024",
            location: "South Delhi",
            disruptionId: "D-101"
          },
          {
            id: "CLM-8702",
            type: "Severe AQI",
            amount: 650,
            status: "COMPLETED",
            date: "12 Mar 2024",
            location: "Central Delhi",
            disruptionId: "D-102"
          },
          {
            id: "CLM-8650",
            type: "Road Blockage",
            amount: 0,
            status: "PENDING",
            date: "10 Mar 2024",
            location: "Okhla",
            disruptionId: "D-103"
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchClaims();
  }, []);

  return (
    <div className="h-full bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900/50 px-6 pt-10 pb-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black text-white tracking-tight">Claim History</h1>
          <Search className="w-5 h-5 text-slate-500" />
        </div>
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Parametric Auto-Settlements</p>
      </div>

      <div className="flex-1 px-6 pt-6 space-y-6 overflow-y-auto pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center pt-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Scanning Ledger...</p>
          </div>
        ) : claims.length > 0 ? (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim.id} className="bg-slate-900/50 rounded-3xl p-5 border border-white/5 relative overflow-hidden group active:scale-[0.98] transition-transform">
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${claim.status === 'COMPLETED' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                      }`}>
                      {claim.status === 'COMPLETED' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <Clock className="w-6 h-6 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-white text-[15px] leading-tight mb-1">{claim.type}</h4>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-600" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{claim.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-black tracking-tighter ${claim.status === 'COMPLETED' ? 'text-emerald-400' : 'text-slate-400'
                      }`}>
                      {claim.amount > 0 ? `₹${claim.amount}` : "--"}
                    </p>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${claim.status === 'COMPLETED' ? 'text-emerald-500/50' : 'text-amber-500/50'
                      }`}>
                      {claim.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10 text-[10px] font-black uppercase tracking-[0.1em]">
                  <div className="flex items-center gap-2 text-slate-500">
                    <FileText className="w-3.5 h-3.5" />
                    <span>ID: {claim.id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{claim.date}</span>
                  </div>
                </div>

                {/* Subtle highlight */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center border border-white/5">
              <AlertCircle className="w-10 h-10 text-slate-700" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-black text-white px-6">Your Shield is Active</p>
              <p className="text-xs text-slate-500 max-w-[240px] font-medium leading-relaxed mx-auto">Smart payouts trigger instantly when weather disruptions affect your zone.</p>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
