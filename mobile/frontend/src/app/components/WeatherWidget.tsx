import React, { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, CloudLightning, Loader2, Thermometer, MapPin } from "lucide-react";
import { fetchWeatherData } from "../utils/weather";

const getWeatherIcon = (code: number) => {
  if (code === 0) return <Sun className="w-8 h-8 text-amber-400" />;
  if (code <= 3) return <Cloud className="w-8 h-8 text-slate-400" />;
  if (code <= 67) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (code <= 99) return <CloudLightning className="w-8 h-8 text-purple-400" />;
  return <Sun className="w-8 h-8 text-amber-400" />;
};

export function WeatherWidget({ lat, lon, cityName }: { lat?: number; lon?: number; cityName?: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      try {
        const weather = await fetchWeatherData(lat, lon);
        setData(weather);
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const currentTemp = Math.round(data.current.temperature);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-6 shadow-2xl border border-slate-700/50 relative overflow-hidden group">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-colors" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Pulse • {cityName || "Delhi"}</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-4xl font-black text-white">{currentTemp}°</span>
            <span className="text-xl font-bold text-slate-500 mb-1">C</span>
          </div>
          <p className="text-xs font-bold text-emerald-400/80 uppercase tracking-tight">
            Atmospheric Stability Secured
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
            {getWeatherIcon(data.current.weatherCode)}
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter">Real-time</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-950/40 rounded-xl border border-slate-700/30">
            <Thermometer className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase">Hourly Trend</p>
            <p className="text-[11px] text-white font-bold">Stable (+2° expected)</p>
          </div>
        </div>
        <button className="text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors">
          Details
        </button>
      </div>
    </div>
  );
}
