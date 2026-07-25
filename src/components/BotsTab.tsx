import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { BotState } from '../types';
import { Bot, Play, Square, Settings, Activity, Sparkles, ArrowRightLeft, ShieldCheck } from 'lucide-react';

export const BotsTab: React.FC = () => {
  const { bots, toggleBot, updateBotConfig } = useTrading();
  const [activeBotModal, setActiveBotModal] = useState<BotState | null>(null);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-400" />
            <span>ربات‌های معامله‌گر الگوریتمی (Algorithmic Trading Bots)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            اجرای خودکار استراتژی‌های گرید، آربیتراژ نوبیتکس-بایننس و سیگنال‌های نوسان‌گیری با هوش مصنوعی
          </p>
        </div>

        <div className="bg-purple-500/10 text-purple-300 border border-purple-500/30 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>موتور بک‌تست و هوش مصنوعی فعال</span>
        </div>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bots.map((bot) => {
          const isRunning = bot.status === 'RUNNING';

          return (
            <div
              key={bot.id}
              className={`bg-slate-900 rounded-2xl border p-5 shadow-xl space-y-4 flex flex-col justify-between transition-all ${
                isRunning ? 'border-purple-500/50 shadow-purple-500/10' : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                {/* Bot Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{bot.id} BOT</span>
                    <h3 className="text-base font-bold text-white">{bot.name}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      isRunning
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {isRunning ? '🟢 در حال معامله' : '🔴 متوقف شده'}
                  </span>
                </div>

                {/* Bot Stats */}
                <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500 block">سود کل ربات:</span>
                    <span className="font-extrabold text-emerald-400 font-mono text-sm dir-ltr">
                      +${bot.profit.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">تعداد معاملات:</span>
                    <span className="font-bold text-slate-200 font-mono">{bot.tradesCount} معامله</span>
                  </div>
                </div>

                {/* Bot Config Preview */}
                <div className="text-xs space-y-1 text-slate-400">
                  <div className="text-[11px] font-bold text-slate-300">پیکربندی فعال:</div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                    {Object.entries(bot.config).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-500">{key}:</span>
                        <span className="text-slate-200 font-bold">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bot Real-time Log Feed */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-blue-400" />
                    <span>لاگ رویدادهای زنده:</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 h-24 overflow-y-auto text-[10px] font-mono space-y-1">
                    {bot.logs.length === 0 ? (
                      <span className="text-slate-600">منتظر اجرای رویداد...</span>
                    ) : (
                      bot.logs.map((log, i) => (
                        <div key={i} className="text-slate-300 leading-tight">
                          <span className="text-slate-500 font-bold me-1.5">[{log.time}]</span>
                          <span className={log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}>
                            {log.msg}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Bot Control Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => toggleBot(bot.id)}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                    isRunning
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Square className="w-4 h-4 fill-white" />
                      <span>توقف ربات</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>شروع ربات</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setActiveBotModal(bot)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all border border-slate-700"
                  title="تنظیمات پارامترهای ربات"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bot Configuration Modal */}
      {activeBotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              <span>پیکربندی پارامترهای {activeBotModal.name}</span>
            </h3>

            <div className="space-y-3 text-xs">
              {Object.entries(activeBotModal.config).map(([key, value]) => (
                <div key={key}>
                  <label className="text-slate-300 font-bold block mb-1">{key}:</label>
                  <input
                    type="text"
                    defaultValue={String(value)}
                    id={`config_${key}`}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono dir-ltr outline-none focus:border-purple-500"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  const updated: Record<string, any> = {};
                  Object.keys(activeBotModal.config).forEach((key) => {
                    const el = document.getElementById(`config_${key}`) as HTMLInputElement;
                    if (el) {
                      const numVal = parseFloat(el.value);
                      updated[key] = isNaN(numVal) ? el.value : numVal;
                    }
                  });
                  updateBotConfig(activeBotModal.id, updated);
                  setActiveBotModal(null);
                }}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                ذخیره پارامترها
              </button>
              <button
                onClick={() => setActiveBotModal(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
