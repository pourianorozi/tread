import React from 'react';
import { useTrading } from '../context/TradingContext';
import { TrendingUp, Award, Activity, DollarSign, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface HomeTabProps {
  setActiveTab: (tab: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ setActiveTab }) => {
  const { balance, history, positions, pairs, dailyPnl } = useTrading();

  const totalTrades = history.length;
  const winningTrades = history.filter((t) => t.pnl > 0).length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : '0.0';
  const totalNetPnl = history.reduce((acc, t) => acc + t.pnl, 0);
  const bestTrade = history.reduce((max, t) => (t.pnl > max ? t.pnl : max), 0);

  // Simulated Equity Curve Data
  const equityData = React.useMemo(() => {
    let currentEquity = 10000;
    return [
      { name: 'افتتاحیه', value: 10000 },
      ...history.slice().reverse().map((t, idx) => {
        currentEquity += t.pnl;
        return {
          name: `معامله ${idx + 1}`,
          value: Number(currentEquity.toFixed(2))
        };
      })
    ];
  }, [history]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 p-6 rounded-2xl border border-blue-500/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>خوش آمدید به Crypto Trader Pro</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
              نسخه ۳.۰ پایدار
            </span>
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            سامانه جامع مدیریت معاملات خودکار، دستی و الگوریتمی با لایه امنیتی رمزنگاری‌شده و موتور تحلیل ریسک
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('trading')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 text-sm transition-all flex items-center gap-1.5"
          >
            <span>شروع معامله جدید</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('bots')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 text-sm transition-all flex items-center gap-1.5"
          >
            <span>مدیریت ربات‌ها</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>سود/ضرر کل</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-2xl font-extrabold font-mono dir-ltr ${totalNetPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalNetPnl >= 0 ? '+' : ''}${totalNetPnl.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">از زمان فعال‌سازی سامانه</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>نرخ موفقیت (Win Rate)</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono dir-ltr">{winRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{winningTrades} معامله سودده از {totalTrades} معامله</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>کل معاملات انجام‌شده</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono dir-ltr">{totalTrades}</div>
          <div className="text-[11px] text-slate-500 mt-1">پوزیشن‌های بسته‌شده</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>بهترین معامله (Best Win)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono dir-ltr">
            +${bestTrade.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">بیشترین سود تک‌معامله</div>
        </div>
      </div>

      {/* Main Performance Chart & Assets Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equity Curve Chart */}
        <div className="lg:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span>روند رشد سرمایه و عملکرد حساب (Equity Growth)</span>
            </h3>
            <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
              پایش لحظه‌ای
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: any) => [`$${value}`, 'موجودی کل']}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#equityGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Assets Distribution */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">ترکیب دارایی‌ها</h3>
            <p className="text-xs text-slate-400">ارزش کل کیف پول و ارزهای تحت نظر</p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>تتر آزاد (USDT)</span>
                <span className="font-mono dir-ltr">${balance.toLocaleString()} (100%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-full" />
              </div>
            </div>

            {pairs.slice(0, 4).map((pair) => (
              <div key={pair.symbol} className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">{pair.symbol}</div>
                  <div className="text-[11px] text-slate-400">قیمت زنده بازار</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-white">${pair.price.toLocaleString()}</div>
                  <div className={`text-[10px] ${pair.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent History Preview */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white">آخرین معاملات ثبت‌شده</h3>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs text-blue-400 hover:text-blue-300 font-bold"
          >
            مشاهده تمام تاریخچه ➔
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">هیچ معامله‌ای هنوز انجام نشده است.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">نماد</th>
                  <th className="p-3">نوع</th>
                  <th className="p-3">حجم</th>
                  <th className="p-3">قیمت ورود/خروج</th>
                  <th className="p-3">سود/ضرر</th>
                  <th className="p-3">تاریخ و زمان</th>
                  <th className="p-3">برچسب استراتژی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.slice(0, 5).map((trade) => (
                  <tr key={trade.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-white">{trade.symbol}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        trade.side === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {trade.side === 'BUY' ? 'خرید' : 'فروش'}
                      </span>
                    </td>
                    <td className="p-3 font-mono dir-ltr">${trade.amount.toLocaleString()}</td>
                    <td className="p-3 font-mono dir-ltr">${trade.price.toLocaleString()}</td>
                    <td className={`p-3 font-bold font-mono dir-ltr ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                    </td>
                    <td className="p-3 text-slate-400">{trade.timestamp}</td>
                    <td className="p-3 text-slate-300">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px]">{trade.strategyTag}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
