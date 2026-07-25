import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { OrderSide, OrderType } from '../types';
import { ShoppingBag, DollarSign, ShieldAlert, CheckCircle2, Sliders, AlertCircle } from 'lucide-react';

export const TradingTab: React.FC = () => {
  const { pairs, selectedPair, setSelectedPair, openPosition, balance, riskSettings } = useTrading();

  const [side, setSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [limitPrice, setLimitPrice] = useState<number>(selectedPair.price);
  const [amount, setAmount] = useState<number>(100);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [takeProfit, setTakeProfit] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentPrice = orderType === 'MARKET' ? selectedPair.price : limitPrice;
  const estimatedFee = amount * riskSettings.feeRate;
  const totalCost = amount + estimatedFee;

  const handlePercentageClick = (pct: number) => {
    const calculated = Math.floor((balance * (pct / 100)) / (1 + riskSettings.feeRate));
    setAmount(Math.max(10, calculated));
  };

  const handleSubmitOrder = () => {
    setNotice(null);
    if (amount <= 0) {
      setNotice({ type: 'error', text: 'مبلغ معامله باید بیشتر از صفر باشد.' });
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmAndExecute = () => {
    setShowConfirmModal(false);
    const result = openPosition(
      selectedPair.symbol,
      side,
      orderType,
      amount,
      currentPrice,
      stopLoss,
      takeProfit,
      'معامله دستی'
    );

    if (result.success) {
      setNotice({ type: 'success', text: result.message });
      setTimeout(() => setNotice(null), 4000);
    } else {
      setNotice({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Notice Banner */}
      {notice && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm font-bold ${
            notice.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
            <span>{notice.text}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Order Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="md:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <span>ثبت سفارش معامله ({selectedPair.symbol})</span>
            </h2>

            {/* Pair Selector dropdown */}
            <select
              value={selectedPair.symbol}
              onChange={(e) => {
                const found = pairs.find((p) => p.symbol === e.target.value);
                if (found) {
                  setSelectedPair(found);
                  setLimitPrice(found.price);
                }
              }}
              className="bg-slate-950 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 outline-none focus:border-blue-500"
            >
              {pairs.map((p) => (
                <option key={p.symbol} value={p.symbol}>
                  {p.symbol} (${p.price})
                </option>
              ))}
            </select>
          </div>

          {/* Buy / Sell Tabs */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setSide('BUY')}
              className={`py-3 rounded-lg font-extrabold text-sm transition-all ${
                side === 'BUY'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🟢 پوزیشن خرید (Long)
            </button>
            <button
              onClick={() => setSide('SELL')}
              className={`py-3 rounded-lg font-extrabold text-sm transition-all ${
                side === 'SELL'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔴 پوزیشن فروش (Short)
            </button>
          </div>

          {/* Market vs Limit Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">نوع سفارش:</label>
            <div className="flex gap-4 text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="orderType"
                  checked={orderType === 'MARKET'}
                  onChange={() => setOrderType('MARKET')}
                  className="accent-blue-500"
                />
                <span>قیمت بازار (Market)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="orderType"
                  checked={orderType === 'LIMIT'}
                  onChange={() => setOrderType('LIMIT')}
                  className="accent-blue-500"
                />
                <span>سفارش لیمیت (Limit Price)</span>
              </label>
            </div>
          </div>

          {/* Limit Price Input */}
          {orderType === 'LIMIT' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">قیمت لیمیت ($):</label>
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono dir-ltr outline-none focus:border-blue-500 text-sm"
              />
            </div>
          )}

          {/* Amount / Volume Input */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">مبلغ سرمایه‌گذاری ($):</span>
              <span className="text-slate-400">موجودی دسترس: ${balance.toLocaleString()}</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono dir-ltr outline-none focus:border-blue-500 text-sm font-bold"
            />

            {/* Quick Percentage Buttons */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handlePercentageClick(pct)}
                  className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-700"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Stop Loss & Take Profit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex justify-between">
                <span>حد ضرر (Stop Loss $):</span>
                <span className="text-rose-400 text-[11px]">اختیاری</span>
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={stopLoss || ''}
                onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-rose-500/30 rounded-xl p-3 text-white font-mono dir-ltr outline-none focus:border-rose-500 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex justify-between">
                <span>حد سود (Take Profit $):</span>
                <span className="text-emerald-400 text-[11px]">اختیاری</span>
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={takeProfit || ''}
                onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl p-3 text-white font-mono dir-ltr outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            onClick={handleSubmitOrder}
            className={`w-full py-4 rounded-xl font-extrabold text-base transition-all shadow-lg mt-4 ${
              side === 'BUY'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
            }`}
          >
            تأیید و ثبت سفارش {side === 'BUY' ? 'خرید' : 'فروش'} {selectedPair.symbol}
          </button>
        </div>

        {/* Right 1 Col: Summary & Risk Guard */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>محاسبه‌گر کارمزد و ریسک</span>
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">نماد هدف:</span>
                <span className="font-bold text-white font-mono">{selectedPair.symbol}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">قیمت هر واحد:</span>
                <span className="font-bold text-emerald-400 font-mono dir-ltr">${currentPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">حجم پرداختی:</span>
                <span className="font-bold text-white font-mono dir-ltr">${amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">کارمزد معامله (۰.۱٪):</span>
                <span className="font-bold text-amber-400 font-mono dir-ltr">${estimatedFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800 font-bold">
                <span className="text-slate-200">کل کسر از حساب:</span>
                <span className="text-white font-mono dir-ltr">${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>پایش ریسک روزانه</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              سقف ضرر روزانه حساب ${riskSettings.dailyLossLimit} تنظیم شده است. در صورت ثبت معامله با حد ضرر مشخص، ریسک شما به صورت خودکار کنترل می‌شود.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">تأیید نهایی ثبت سفارش معامله</h3>
              <p className="text-xs text-slate-400">
                لطفاً جزییات سفارش خود را قبل از ارسال نهایی بررسی نمایید.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">سمت معامله:</span>
                <span className={`font-bold ${side === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {side === 'BUY' ? 'خرید (BUY)' : 'فروش (SELL)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">نماد:</span>
                <span className="text-white font-bold">{selectedPair.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">قیمت اجرا:</span>
                <span className="text-white font-bold">${currentPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">حجم:</span>
                <span className="text-white font-bold">${amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">کارمزد:</span>
                <span className="text-amber-400 font-bold">${estimatedFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmAndExecute}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg"
              >
                ✅ تأیید و ارسال
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all"
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
