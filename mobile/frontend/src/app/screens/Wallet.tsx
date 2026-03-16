import { useState, useEffect } from "react";
import { BottomNav } from "../components/BottomNav";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus, History, Loader2, IndianRupee } from "lucide-react";
import { Button } from "../components/ui/button";

export function Wallet() {
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<{
    balance: number;
    transactions: Array<{
      id: string;
      type: 'PAYOUT' | 'TOPUP';
      amount: number;
      status: string;
      date: string;
      description: string;
    }>;
  } | null>(null);

  useEffect(() => {
    async function fetchWallet() {
      const savedProfile = localStorage.getItem("userProfile");
      const profile = savedProfile ? JSON.parse(savedProfile) : { userId: "demo_user" };

      try {
        const [balRes, txRes] = await Promise.all([
          fetch(`http://localhost:3001/api/v1/wallet/balance?userId=${profile.userId}`),
          fetch(`http://localhost:3001/api/v1/wallet/transactions?userId=${profile.userId}`)
        ]);

        const balData = await balRes.json();
        const transactions = await txRes.json();

        setWalletData({
          balance: balData.balance,
          transactions: transactions
        });
      } catch (error) {
        console.error("Wallet fetch failed:", error);
        // Fallback for demo
        setWalletData({
          balance: 2450,
          transactions: [
            { id: "1", type: "PAYOUT", amount: 1200, status: "Completed", date: "2024-03-15", description: "Rainfall Disruption Payout" },
            { id: "2", type: "PAYOUT", amount: 650, status: "Completed", date: "2024-03-12", description: "AQI Health Payout" },
            { id: "3", type: "TOPUP", amount: 500, status: "Completed", date: "2024-03-10", description: "Manual Add-on" },
          ] as any
        });
      } finally {
        setLoading(false);
      }
    }

    fetchWallet();
  }, []);

  if (loading) {
    return (
      <div className="h-full bg-slate-950 flex flex-col items-center justify-center p-6 pb-24 text-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Ledger...</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Wallet Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 px-6 pt-8 pb-10 rounded-b-[3rem] border-b border-white/5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-black text-white tracking-tight">WorkSure Wallet</h1>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
              <Plus className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Total Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-black text-emerald-500">₹</span>
              <h2 className="text-5xl font-black text-white tracking-tighter">
                {walletData?.balance.toLocaleString()}
              </h2>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button className="flex-1 h-12 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-wider shadow-xl shadow-white/5 active:scale-95 transition-all">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
            <Button className="flex-1 h-12 rounded-2xl bg-slate-800 border border-slate-700 text-white font-black text-xs uppercase tracking-wider active:scale-95 transition-all">
              Details
            </Button>
          </div>
        </div>
        {/* Decorative orb */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Transactions List */}
      <div className="flex-1 px-6 pt-8 space-y-6 overflow-y-auto pb-32">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <History className="w-4 h-4" />
            Recent Activity
          </h3>
          <button className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">See All</button>
        </div>

        <div className="space-y-3">
          {walletData?.transactions.map((tx) => (
            <div key={tx.id} className="bg-slate-900/50 rounded-3xl p-5 border border-white/5 flex items-center gap-4 group hover:bg-slate-900 transition-colors">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${tx.type === 'PAYOUT' ? 'bg-emerald-500/10' : 'bg-blue-500/10'
                }`}>
                {tx.type === 'PAYOUT' ? (
                  <ArrowDownLeft className={`w-6 h-6 ${tx.type === 'PAYOUT' ? 'text-emerald-400' : 'text-blue-400'}`} />
                ) : (
                  <IndianRupee className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-0.5">
                  <h4 className="font-bold text-white text-[15px]">{tx.description}</h4>
                  <p className={`font-black tracking-tighter text-lg ${tx.type === 'PAYOUT' ? 'text-emerald-400' : 'text-blue-400'
                    }`}>
                    {tx.type === 'PAYOUT' ? '+' : '+'}₹{tx.amount}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  <span>{tx.date}</span>
                  <span className="text-slate-600">{tx.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
