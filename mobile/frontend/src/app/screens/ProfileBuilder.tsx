import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { ProgressBar } from "../components/ProgressBar";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";

const CITY_ZONES: Record<string, string[]> = {
  "Delhi": ["South Delhi", "North Delhi", "East Delhi", "West Delhi"],
  "Mumbai": ["Bandra", "Andheri", "Powai", "South Mumbai"],
  "Bangalore": ["Koramangala", "Indiranagar", "Whitefield", "HSR Layout"],
  "Hyderabad": ["Gachibowli", "Jubilee Hills", "Banjara Hills", "Madhapur"],
  "Chennai": ["Adyar", "Velachery", "Anna Nagar", "T. Nagar"],
  "Pune": ["Kothrud", "Viman Nagar", "Baner", "Hinjewadi"],
  "Kolkata": ["Salt Lake", "Ballygunge", "Park Street", "New Town"],
};

export function ProfileBuilder() {
  const navigate = useNavigate();
  const locationState = useLocation().state as { personaId?: string } | null;
  const personaId = locationState?.personaId || "food";

  const [city, setCity] = useState("Delhi");
  const [zone, setZone] = useState("South Delhi");
  const [dailyHours, setDailyHours] = useState([8]);
  const [weeklyEarnings, setWeeklyEarnings] = useState("12000");
  const [isLoading, setIsLoading] = useState(false);

  // Update zone when city changes
  useEffect(() => {
    if (city && CITY_ZONES[city]) {
      setZone(CITY_ZONES[city][0]);
    }
  }, [city]);

  const calculateCoverage = () => {
    const earnings = parseInt(weeklyEarnings) || 0;
    return Math.floor(earnings * 0.6); // 60% of weekly earnings
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/v1/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user_" + Math.random().toString(36).slice(2, 9),
          persona: personaId,
          location: `${zone}, ${city}`,
          avgEarnings: parseInt(weeklyEarnings),
          workingHours: [`${dailyHours[0]} hours/day`]
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Store profile in localStorage for subsequent screens
        localStorage.setItem("userProfile", JSON.stringify(data.profile));
        navigate("/risk-profile");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      // Fallback for demo if backend is not running
      const mockProfile = {
        userId: "demo_user_" + Math.random().toString(36).slice(2, 9),
        persona: personaId,
        location: `${zone}, ${city}`,
        avgEarnings: parseInt(weeklyEarnings),
        workingHours: [`${dailyHours[0]} hours/day`]
      };
      localStorage.setItem("userProfile", JSON.stringify(mockProfile));
      navigate("/risk-profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col pb-6">
      {/* Header with Progress */}
      <div className="px-6 pt-8 pb-2">
        <ProgressBar currentStep={2} totalSteps={4} />
        <h1 className="text-2xl font-black text-slate-800 mt-8 mb-1 leading-tight">
          Tell us about your work
        </h1>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {personaId.replace("-", " ")}
          </span>
          <p className="text-gray-500 text-sm">Gig Profile</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 space-y-7 overflow-y-auto">
        {/* City Selection */}
        <div className="space-y-2.5">
          <label className="text-[13px] text-slate-500 font-bold uppercase tracking-wide px-1">Work City</label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-full h-15 rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 text-base font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm">
              <SelectValue placeholder="Select your city" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-2xl">
              {Object.keys(CITY_ZONES).map((c) => (
                <SelectItem key={c} value={c} className="h-12 text-base font-medium focus:bg-emerald-50 focus:text-emerald-700">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Delivery Zone */}
        <div className="space-y-2.5">
          <label className="text-[13px] text-slate-500 font-bold uppercase tracking-wide px-1">Active Delivery Zone</label>
          <div className="bg-white rounded-2xl p-5 border-2 border-slate-100 shadow-sm transition-all hover:border-emerald-200">
            {/* Mini Map Thumbnail */}
            <div className="relative h-28 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl mb-4 overflow-hidden border border-emerald-50/50 shadow-inner">
              <div className="absolute inset-0 opacity-40">
                <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                  <path d="M0,50 Q40,20 80,50 T160,50 T240,50" stroke="#059669" strokeWidth="2" fill="none" />
                  <path d="M0,70 Q60,40 120,70 T240,70" stroke="#059669" strokeWidth="1" fill="none" opacity="0.3" />
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce-slow">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-lg leading-tight">{zone}</p>
                <p className="text-xs text-slate-400 mt-1 font-medium italic">Validated operating territory</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-xl bg-slate-50 border border-slate-200 shadow-none hover:bg-slate-100 px-4 text-xs font-bold text-slate-600 h-9"
                onClick={() => {
                  const zones = CITY_ZONES[city] || [];
                  const currentIndex = zones.indexOf(zone);
                  setZone(zones[(currentIndex + 1) % zones.length]);
                }}
              >
                Change
              </Button>
            </div>
          </div>
        </div>

        {/* Daily Hours Slider */}
        <div className="space-y-5 bg-slate-50/50 p-5 rounded-2xl border-2 border-slate-50">
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-slate-500 font-bold uppercase tracking-wide">Daily Shift</label>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-600">{dailyHours[0]}</span>
              <span className="text-xs font-bold text-emerald-600/60 uppercase">hours</span>
            </div>
          </div>
          <Slider value={dailyHours} onValueChange={setDailyHours} min={4} max={14} step={1} className="w-full" />
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
            <span>Part-time</span>
            <span>Full-time++</span>
          </div>
        </div>

        {/* Weekly Earnings */}
        <div className="space-y-2.5">
          <label className="text-[13px] text-slate-500 font-bold uppercase tracking-wide px-1">Estimated Weekly Earnings</label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg pointer-events-none group-focus-within:text-emerald-500 transition-colors">
              ₹
            </div>
            <Input
              type="number"
              value={weeklyEarnings}
              onChange={(e) => setWeeklyEarnings(e.target.value)}
              className="w-full h-15 pl-10 pr-6 rounded-2xl border-2 border-slate-100 bg-white text-xl font-bold text-slate-800 placeholder:text-slate-200 focus:border-emerald-500/50 transition-all outline-none shadow-sm"
              placeholder="10000"
            />
          </div>
        </div>

        {/* Live Coverage Estimate */}
        <div className="relative mt-2">
          <div className="absolute inset-0 bg-emerald-600 rounded-[2rem] blur-xl opacity-20 -z-10 transform scale-95" />
          <div className="bg-emerald-600 rounded-[2rem] p-7 text-white relative overflow-hidden shadow-2xl shadow-emerald-200/50">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-emerald-50/80 text-xs font-bold uppercase tracking-widest">Max Payout Pot</p>
                <div className="bg-white/10 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter border border-white/10 flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-300 rounded-full animate-pulse" />
                  Live Sync
                </div>
              </div>
              <p className="text-5xl font-black tracking-tighter">
                ₹{calculateCoverage().toLocaleString()}
              </p>
              <div className="mt-4 flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 font-black text-[10px]">!</div>
                <p className="text-[11px] text-emerald-50/90 leading-relaxed font-semibold">
                  Income protection active for rainfall {'>'} 20mm and extreme AQI disruptions.
                </p>
              </div>
            </div>
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-8 mt-auto bg-white/80 backdrop-blur-md border-t border-slate-50">
        <Button
          onClick={handleContinue}
          disabled={!city || !weeklyEarnings || isLoading}
          className="w-full h-16 text-lg bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.5rem] shadow-xl shadow-emerald-100 disabled:opacity-50 font-black tracking-wide transition-all transform active:scale-[0.97] flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              CONTINUE
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
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
