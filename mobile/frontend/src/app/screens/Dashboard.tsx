import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import {
  Shield,
  Sun,
  CloudRain,
  CloudDrizzle,
  Wind,
  Droplets,
  MapPin,
  TrendingDown,
  AlertTriangle,
  Zap,
  Loader2,
} from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [activePolicy, setActivePolicy] = useState<{
    planId: string;
    premium: number;
    status: string;
    expiresAt?: string;
    coverageAmount?: number;
  } | null>(null);

  const [weatherData, setWeatherData] = useState<{
    current: any;
    forecast: any[];
    aqi: any;
  } | null>(null);

  useEffect(() => {
    async function initDashboard() {
      const savedProfile = localStorage.getItem("userProfile");
      const savedPolicy = localStorage.getItem("activePolicy");

      const parsedProfile = savedProfile ? JSON.parse(savedProfile) : { displayName: "Partner", location: "Delhi" };
      setProfile(parsedProfile);

      if (savedPolicy) {
        setActivePolicy(JSON.parse(savedPolicy));
      }

      try {
        // Fetch weather monitoring data based on city
        const city = parsedProfile.location.split(',')[1]?.trim() || "Delhi";
        const response = await fetch(`http://localhost:3001/api/v1/weather/monitoring?city=${city}`);
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }

    initDashboard();
  }, []);

  const getIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear': return Sun;
      case 'heat wave': return Sun;
      case 'light rain': return CloudDrizzle;
      case 'heavy rain': return CloudRain;
      case 'cloudy': return Sun; // Fallback
      default: return Sun;
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-slate-950 flex flex-col items-center justify-center p-6 pb-24 text-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Updating Live Pulse...</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-950 flex flex-col relative overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Greeting Bar */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-6 rounded-b-[2.5rem] shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Welcome Back</p>
              <h1 className="text-2xl font-black text-white">{profile?.displayName?.split(' ')[0] || "Partner"} ☁️</h1>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* WorkSure Shield Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-6 shadow-2xl border border-slate-700/50 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                  <Shield className="w-7 h-7 text-emerald-400" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Coverage</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-white font-bold">{activePolicy?.planId?.toUpperCase() || "NO"} PLAN</p>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${activePolicy ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-700/30">
                  <p className="text-2xl font-black text-white leading-none mb-1">
                    ₹{activePolicy?.coverageAmount?.toLocaleString() || "0"}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Per Incident Pot</p>
                </div>
                <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-700/30">
                  <p className="text-2xl font-black text-white leading-none mb-1">
                    ₹{activePolicy ? ((activePolicy.coverageAmount || 10000) * 0.08).toLocaleString() : "0"}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Est. Payout</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-slate-400 font-black uppercase">Auto-Renewing</p>
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${activePolicy ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {activePolicy ? 'Secured' : 'Inactive'}
                </p>
              </div>
            </div>
            {/* Subtle decor */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
          </div>

          {/* Risk Forecast Strip */}
          <div className="bg-slate-900 rounded-[1.5rem] p-5 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                Risk Pulse (Next 5 Days)
              </h3>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-slate-600" />
                <span className="text-[9px] font-black text-slate-500 uppercase">{profile?.location?.split(',')[0]}</span>
              </div>
            </div>
            <div className="flex justify-between overflow-x-auto gap-4 scrollbar-hide pb-2">
              {weatherData?.forecast.map((day, idx) => {
                const Icon = getIcon(day.condition);
                return (
                  <div key={idx} className="flex flex-col items-center gap-3 min-w-[50px]">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{day.day}</p>
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${day.risk === 'High'
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                        : day.risk === 'Moderate'
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <p className="text-xs text-white font-black tracking-tighter">
                      {day.temp}°
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Parametric Alerts */}
          <div className="pb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Parametric Alerts</h3>
              <div className={`px-3 py-1 rounded-full border ${weatherData?.current?.alerts?.length > 0 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                <p className={`text-[11px] font-black uppercase tracking-tighter ${weatherData?.current?.alerts?.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {weatherData?.current?.alerts?.length || 0} In-Zone
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {weatherData?.current?.alerts?.length > 0 ? (
                weatherData.current?.alerts.map((alert: any, idx: number) => {
                  const Icon = getIcon(alert.type);
                  return (
                    <button
                      key={idx}
                      onClick={() => navigate("/disruption-detail")}
                      className="w-full bg-slate-900 rounded-3xl p-5 border border-slate-800 hover:border-emerald-500/30 transition-all text-left shadow-lg relative overflow-hidden group active:scale-[0.98]"
                    >
                      <div className="flex items-start gap-5 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-transform group-hover:scale-110 bg-slate-800 border-white/5`}>
                          <Icon className="w-7 h-7 text-rose-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-black text-white text-lg tracking-tight leading-none pt-1">{alert.type}</h4>
                            <div className="px-2 py-0.5 rounded-full border border-rose-500/30 bg-rose-500/20 text-rose-400 text-[9px] font-black uppercase tracking-widest">
                              Critical
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 mb-4">
                            <MapPin className="w-3 h-3 text-slate-600" />
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">{profile?.location?.split(',')[0]}</p>
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-800/50">
                            <div className="flex items-center gap-2">
                              <TrendingDown className="w-4 h-4 text-amber-400/70" />
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Impact Shield</p>
                            </div>
                            <p className="text-base font-black text-emerald-400 tracking-tighter">
                              Automated
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="bg-slate-900/30 rounded-3xl p-10 border border-white/5 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-emerald-500/50" />
                  </div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Sky is Clear</p>
                  <p className="text-[10px] text-slate-600 font-bold max-w-[180px] mt-2 tracking-tight">Enjoy your shift. Parametric engine is monitoring for sudden disruptions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
