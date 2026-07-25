import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { Position } from '../types';
import { Zap, XCircle, Edit3, AlertOctagon, TrendingUp, TrendingDown } from 'lucide-react';

export const PositionsTab: React.FC = () => {
  const { positions, closePosition, closeAllPositions, updatePositionLimits, pairs } = useTrading();
  const [editingPos, setEditingPos] = useState<Position | null>(null);

  const [editAmount, setEditAmount] = useState<number>(0);
  const [editSl, setEditSl] = useState<number>(0);
  const [editTp, setEditTp] = useState<number>(0);

  const openEditModal = (pos: Position) => {
    setEditingPos(pos);
    setEditAmount(pos.amount);
    setEditSl(pos.stopLoss);
    setEditTp(pos.takeProfit);
  };

  const handleSaveEdit = () => {
    if (editingPos) {
      updatePositionLimits(editingPos.id, editAmount, editSl, editTp);
      setEditingPos(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Emergency Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>مدیریت پوزیشن‌های فعال ({positions.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            پایش لحظه‌ای سود و ضرر، به‌روزرسانی حد سود و ضرر و تسویه آنی پوزیشن‌ها
          </p>
        </div>

        {positions.length > 0 && (
          <button
            onClick={closeAllPositions}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-rose-600/30"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>بستن اضطراری تمام پوزیشن‌ها</span>
          </button>
        )}
      </div>

      {/* Positions Table / Cards */}
      {positions.length === 0 ? (
        <div className="bg-slate-900 p-12 rounded-2xl border border-slate-800 text-center space-y-3">
          <div className="inline-flex p-4 bg-slate-800 text-slate-500 rounded-full">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-300">هیچ پوزیشن فعالی وجود ندارد</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            برای باز کردن معامله جدید به تب «معامله» مراجعه نمایید یا ربات‌های معامله‌گر را فعال سازید.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">شناسه</th>
                  <th className="p-4">نماد</th>
                  <th className="p-4">نوع</th>
                  <th className="p-4">حجم ($)</th>
                  <th className="p-4">قیمت ورود</th>
                  <th className="p-4">قیمت بازار</th>
                  <th className="p-4">حد ضرر (SL)</th>
                  <th className="p-4">حد سود (TP)</th>
                  <th className="p-4">سود/ضرر خالص</th>
                  <th className="p-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {positions.map((pos) => {
                  const currentPair = pairs.find((p) => p.symbol === pos.symbol);
                  const markPrice = currentPair ? currentPair.price : pos.entryPrice;
                  const isProfit = pos.netPnl >= 0;

                  return (
                    <tr key={pos.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 text-slate-500 text-[11px]">{pos.id.slice(-6)}</td>
                      <td className="p-4 font-bold text-white text-sm dir-ltr">{pos.symbol}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          pos.side === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {pos.side === 'BUY' ? 'خرید (Long)' : 'فروش (Short)'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-200 dir-ltr">${pos.amount.toLocaleString()}</td>
                      <td className="p-4 text-slate-300 dir-ltr">${pos.entryPrice.toLocaleString()}</td>
                      <td className="p-4 font-bold text-white dir-ltr">${markPrice.toLocaleString()}</td>
                      <td className="p-4 text-rose-400 dir-ltr">{pos.stopLoss > 0 ? `$${pos.stopLoss}` : '—'}</td>
                      <td className="p-4 text-emerald-400 dir-ltr">{pos.takeProfit > 0 ? `$${pos.takeProfit}` : '—'}</td>
                      <td className="p-4 dir-ltr">
                        <div className={`text-sm font-bold flex items-center gap-1 ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span>{isProfit ? '+' : ''}${pos.netPnl.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(pos)}
                            className="p-2 bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                            title="ویرایش حد سود و ضرر"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => closePosition(pos.id, 'بستن مارکت')}
                            className="px-3 py-1.5 bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                            title="بستن پوزیشن به قیمت مارکت"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>تسویه</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit SL/TP Modal */}
      {editingPos && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-400" />
              <span>ویرایش پوزیشن ({editingPos.symbol})</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">حجم سرمایه ($):</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono dir-ltr outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">حد ضرر جدید ($):</label>
                <input
                  type="number"
                  value={editSl}
                  onChange={(e) => setEditSl(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-rose-500/40 rounded-xl p-3 text-white font-mono dir-ltr outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">حد سود جدید ($):</label>
                <input
                  type="number"
                  value={editTp}
                  onChange={(e) => setEditTp(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl p-3 text-white font-mono dir-ltr outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                ذخیره تغییرات
              </button>
              <button
                onClick={() => setEditingPos(null)}
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
