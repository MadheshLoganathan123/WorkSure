import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { User, MapPin, Briefcase, Star, Settings, ChevronRight, LogOut, ShieldCheck } from "lucide-react";

export function ProfileView() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{
    displayName: string;
    city: string;
    category: string;
    persona: string;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="h-full bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-950 px-6 pt-12 pb-10 border-b border-white/5 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-28 h-28 bg-white/10 rounded-[2.5rem] flex items-center justify-center border-4 border-white/20 shadow-2xl overflow-hidden backdrop-blur-md">
              <User className="w-14 h-14 text-white/50" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-10 h-10 rounded-2xl border-4 border-slate-950 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mb-1">{profile?.displayName || "Arjun Kumar"}</h2>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">WorkSure ID: #PK-2291</p>
        </div>
        {/* Decor */}
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 px-6 pt-8 space-y-8 overflow-y-auto pb-32">
        {/* Work Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/40 p-5 rounded-3xl border border-white/5 flex flex-col items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" fill="currentColor" />
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Trust Score</p>
              <p className="text-lg font-black text-white text-center tracking-tighter">4.9 / 5.0</p>
            </div>
          </div>
          <div className="bg-slate-900/40 p-5 rounded-3xl border border-white/5 flex flex-col items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Incidents</p>
              <p className="text-lg font-black text-white text-center tracking-tighter">0 Claims</p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-widest px-2">Professional Identity</h3>
          <div className="bg-slate-900/60 rounded-[2rem] border border-white/5 overflow-hidden divide-y divide-white/5">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Active City</p>
                  <p className="text-sm font-bold text-white tracking-tight">{profile?.city || "Delhi NCR"}</p>
                </div>
              </div>
            </div>
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Gig Category</p>
                  <p className="text-sm font-bold text-white tracking-tight">{profile?.category || "Delivery Expert"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
          <button className="w-full h-16 bg-slate-900/40 p-5 rounded-2xl border border-white/5 flex items-center justify-between group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <Settings className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
              <span className="text-xs font-black text-slate-400 group-hover:text-white uppercase tracking-widest">Account Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
          <button onClick={() => navigate("/")} className="w-full h-16 bg-rose-500/5 p-5 rounded-2xl border border-rose-500/10 flex items-center justify-between group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <LogOut className="w-5 h-5 text-rose-500" />
              <span className="text-xs font-black text-rose-500 uppercase tracking-widest">Log Out</span>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-500/40" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
