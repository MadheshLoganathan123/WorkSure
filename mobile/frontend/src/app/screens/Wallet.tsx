import { useState, useEffect } from "react";
import { BottomNav } from "../components/BottomNav";
import { apiFetch } from "../utils/api";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus, History, Loader2, IndianRupee, CloudRain, Wind, Sun, Shield } from "lucide-react";
import { Button } from "../components/ui/button";

export function Wallet() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [walletData, setWalletData] = useState<{
    balance: number;
    totalEarnings: number;
    pendingPayouts: number;
    lastCredit: number;
    transactions: any[];
  } | null>(null);
  const [topupAmount, setTopupAmount] = useState<string>("1000");

  const fetchWallet = async () => {
    const savedProfile = localStorage.getItem("userProfile");
    const profile = savedProfile ? JSON.parse(savedProfile) : { userId: "demo_user" };

    // Mock data for demo
    const mockTransactions = [
      {
        id: "txn_00000001",
        type: "TOPUP",
        category: "TOPUP",
        amount: 1000,
        description: "Initial balance",
        date: "Mar 18, 2026",
        status: "Completed"
      },
      {
        id: "txn_00000002",
        type: "PAYOUT",
        category: "CLAIM",
        amount: 250,
        description: "Heavy rain claim payout",
        date: "Mar 19, 2026",
        status: "Completed"
      },
      {
        id: "txn_00000003",
        type: "TOPUP",
        category: "TOPUP",
        amount: 500,
        description: "Work completed - Day 1",
        date: "Mar 19, 2026",
        status: "Completed"
      },
      {
        id: "txn_00000004",
        type: "WITHDRAW",
        category: "WITHDRAW",
        amount: 200,
        description: "Bank transfer",
        date: "Mar 20, 2026",
        status: "Completed"
      },
      {
        id: "txn_00000005",
        type: "TOPUP",
        category: "TOPUP",
        amount: 300,
        description: "Work completed - Day 2",
        date: "Mar 20, 2026",
        status: "Completed"
      }
    ];

    try {
      const [balData, transactions] = await Promise.all([
        apiFetch(`/api/v1/wallet/balance?userId=${profile.userId}`),
        apiFetch(`/api/v1/wallet/transactions?userId=${profile.userId}`)
      ]);

      console.log("Wallet data received:", { balData, transactions });

      setWalletData({
        balance: balData.balance || 1850,
        totalEarnings: balData.totalEarnings || 2050,
        pendingPayouts: balData.pendingPayouts || 0,
        lastCredit: 300,
        transactions: transactions && transactions.length > 0 ? transactions : mockTransactions
      });
    } catch (error) {
      console.error("Wallet fetch failed:", error);
      // Fallback with mock data if backend is unreachable
      setWalletData({ 
        balance: 1850, 
        totalEarnings: 2050, 
        pendingPayouts: 0, 
        lastCredit: 300, 
        transactions: mockTransactions 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleTransaction = async (type: 'withdraw' | 'topup') => {
    const savedProfile = localStorage.getItem("userProfile");
    const profile = savedProfile ? JSON.parse(savedProfile) : { userId: "demo_user" };
    const amount = type === 'withdraw' ? 500 : Number(topupAmount);

    if (type === 'topup') {
      // UPI Intent Flow for GPay
      const vpa = "worksure@okaxis"; // Replace with real merchant VPA
      const name = "WorkSure";
      const upiUrl = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=Wallet%20Topup`;
      
      console.log("Opening UPI Intent:", upiUrl);
      window.location.href = upiUrl;

      // In a real app, we'd wait for payment confirmation via webhook or manual check
      // For this demo, we'll simulate a successful transaction after a delay
      setProcessing(true);
      setTimeout(async () => {
        try {
          await apiFetch(`/api/v1/wallet/topup`, {
            method: 'POST',
            body: JSON.stringify({ userId: profile.userId, amount })
          });
          await fetchWallet();
        } catch (error) {
          console.error("Manual topup sync failed:", error);
        } finally {
          setProcessing(false);
        }
      }, 5000); // Simulate payment time
      return;
    }

    setProcessing(true);
    try {
      await apiFetch(`/api/v1/wallet/${type}`, {
        method: 'POST',
        body: JSON.stringify({ userId: profile.userId, amount })
      });
      await fetchWallet();
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setProcessing(false);
    }
  };

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
            <button 
              onClick={() => handleTransaction('topup')}
              disabled={processing}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <Plus className={`w-5 h-5 text-emerald-400 ${processing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Total Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-black text-emerald-500">₹</span>
              <h2 className="text-5xl font-black text-white tracking-tighter">
                {walletData?.balance.toLocaleString()}
              </h2>
            </div>
            
            {/* Amount Input for Top-up */}
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 px-4 focus-within:border-emerald-500/50 transition-colors">
                <span className="text-emerald-500 font-black text-xs">TOP-UP: ₹</span>
                <input 
                  type="number" 
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="bg-transparent border-none outline-none text-white font-black text-lg w-full"
                  placeholder="Enter Amount"
                />
              </div>
              <Button 
                onClick={() => handleTransaction('topup')}
                disabled={processing || !topupAmount || Number(topupAmount) <= 0}
                className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Redirecting to GPay...
                  </>
                ) : (
                  'PAY SECURELY VIA GPAY / UPI'
                )}
              </Button>
            </div>
          </div>

          {/* Detailed Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col gap-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Total Earnings</p>
              <p className="text-sm font-black text-emerald-400">₹{walletData?.totalEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col gap-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Pending</p>
              <p className="text-sm font-black text-amber-400">₹{walletData?.pendingPayouts.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col gap-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Last Credit</p>
              <p className="text-sm font-black text-blue-400">₹{walletData?.lastCredit.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button 
                onClick={() => handleTransaction('withdraw')}
                disabled={processing || (walletData?.balance || 0) < 500}
                className="flex-1 h-12 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-wider shadow-xl shadow-white/5 active:scale-95 transition-all disabled:opacity-50"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              {processing ? 'Processing...' : 'Withdraw ₹500'}
            </Button>
            <Button className="flex-1 h-12 rounded-2xl bg-slate-800 border border-slate-700 text-white font-black text-xs uppercase tracking-wider active:scale-95 transition-all">
              Details
            </Button>
          </div>
        </div>
        {/* Decorative orb */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Parametric Monitoring */}
      <div className="px-6 pt-8">
        <div className="bg-slate-900/40 rounded-3xl p-5 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              Active Monitoring
            </h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Live Sync</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Rainfall', value: '> 20mm', icon: CloudRain, color: 'text-blue-400' },
              { label: 'AQI Index', value: '> 250', icon: Wind, color: 'text-rose-400' },
              { label: 'Heat Max', value: '> 42°C', icon: Sun, color: 'text-amber-400' },
            ].map((param, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col items-center gap-1.5">
                <param.icon className={`w-5 h-5 ${param.color}`} />
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{param.label}</p>
                <p className="text-[11px] font-black text-white">{param.value}</p>
              </div>
            ))}
          </div>

          <p className="text-[9px] text-slate-500 font-bold italic leading-tight text-center px-4">
            Payouts trigger instantly when any parameter cross-over is validated by regional sensors.
          </p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 px-6 pt-8 space-y-6 overflow-y-auto pb-32 scrollbar-hide">
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
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                tx.category === 'CLAIM' ? 'bg-emerald-500/10' : 
                tx.category === 'TOPUP' ? 'bg-blue-500/10' : 'bg-rose-500/10'
                }`}>
                {tx.category === 'CLAIM' ? (
                  <CloudRain className="w-6 h-6 text-emerald-400" />
                ) : tx.category === 'TOPUP' ? (
                  <Plus className="w-6 h-6 text-blue-400" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-rose-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-0.5">
                  <h4 className="font-bold text-white text-[15px]">{tx.description}</h4>
                  <p className={`font-black tracking-tighter text-lg ${
                    tx.type === 'PAYOUT' || tx.type === 'TOPUP' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                    {tx.type === 'WITHDRAW' ? '-' : '+'}₹{tx.amount}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  <span>{tx.date}</span>
                  <span className={`font-black ${tx.status === 'Completed' || tx.status === 'Success' ? 'text-emerald-500/50' : 'text-amber-500/50'}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {walletData?.transactions.length === 0 && (
            <div className="text-center py-10">
              <p className="text-xs font-black text-slate-600 uppercase tracking-widest">No Recent Activity</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
