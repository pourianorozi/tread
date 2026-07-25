import React from 'react';
import { useTrading } from '../context/TradingContext';
import {
  ShieldCheck,
  Zap,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Lock,
  Radio,
  Sliders,
  Wallet
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { isDemo, setIsDemo, balance, dailyPnl, pairs, positions, closeAllPositions, securityConfig } = useTrading();

  const usdtPair = pairs.find((p) => p.symbol === 'USDT/IRT');
  const usdtToIrt = usdtPair ? usdtPair.price : 61250;
  const balanceIrt = balance * usdtToIrt;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl">
      {/* Top Banner / System Bar */}
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold text-sm">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Crypto Trader Pro <span className="text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">v3.0 Web</span></span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-slate-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>متصل به صرافی نوبیتکس</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 2FA & Security Badge */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/50 text-slate-300">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>امنیت: {securityConfig.twoFactorEnabled ? '2FA فعال' : 'رمزنگاری AES-256'}</span>
          </div>

          {/* Mode Switcher */}
          <button
            onClick={() => setIsDemo(!isDemo)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              isDemo
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isDemo ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span>{isDemo ? 'حالت معامله کاغذی (Demo)' : 'حالت معامله واقعی (Live)'}</span>
          </button>
        </div>
      </div>

      {/* Main Stats Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4 bg-slate-900/90">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {[
            { id: 'home', label: 'خانه', icon: '🏠' },
            { id: 'market', label: 'بازار', icon: '📊' },
            { id: 'trading', label: 'معامله', icon: '💳' },
            { id: 'positions', label: `پوزیشن‌ها (${positions.length})`, icon: '⚡' },
            { id: 'bots', label: 'ربات‌ها', icon: '🤖' },
            { id: 'history', label: 'تاریخچه', icon: '📈' },
            { id: 'settings', label: 'تنظیمات', icon: '⚙️' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Balance & Daily Profit Card */}
        <div className="flex items-center gap-4 border-r border-slate-800 pr-4">
          <div className="text-left bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
              <Wallet className="w-3 h-3 text-blue-400" />
              <span>موجودی کیف پول</span>
            </div>
            <div className="text-base font-bold text-emerald-400 dir-ltr text-right">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-500 dir-rtl text-right">
              ≈ {Math.round(balanceIrt).toLocaleString('fa-IR')} تومان
            </div>
          </div>

          <div className="text-left bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
              <TrendingUp className="w-3 h-3 text-purple-400" />
              <span>سود/ضرر امروز</span>
            </div>
            <div
              className={`text-base font-bold dir-ltr text-right ${
                dailyPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {dailyPnl >= 0 ? '+' : ''}${dailyPnl.toFixed(2)}
            </div>
          </div>

          {positions.length > 0 && (
            <button
              onClick={closeAllPositions}
              className="flex items-center gap-1.5 bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
              title="بستن فوری تمام پوزیشن‌های باز"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>بستن اضطراری همه</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
