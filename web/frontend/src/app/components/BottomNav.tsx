import { useNavigate, useLocation } from "react-router";
import { Home, FileText, Wallet, Shield, User } from "lucide-react";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "home", label: "Home", icon: Home, path: "/dashboard" },
    { id: "claims", label: "Claims", icon: FileText, path: "/claims" },
    { id: "wallet", label: "Wallet", icon: Wallet, path: "/wallet" },
    { id: "policy", label: "Policy", icon: Shield, path: "/policy" },
    { id: "profile", label: "Profile", icon: User, path: "/profile-view" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 px-2 py-3 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 px-3 py-1 min-w-[60px] transition-all"
            >
              <div
                className={`p-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-green-500/20 text-green-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <span
                className={`text-xs transition-all ${
                  isActive ? "text-green-400 font-semibold" : "text-slate-400"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
