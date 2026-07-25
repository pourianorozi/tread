import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { History, Download, Trash2, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const HistoryTab: React.FC = () => {
  const { history, clearHistory } = useTrading();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSymbol, setFilterSymbol] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const filteredHistory = history.filter((trade) => {
    const matchesSearch =
      trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.strategyTag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSymbol = filterSymbol === 'ALL' || trade.symbol === filterSymbol;
    return matchesSearch && matchesSymbol;
  });

  const totalPages = Math.ceil(filteredHistory.length / pageSize) || 1;
  const paginatedTrades = filteredHistory.slice((page - 1) * pageSize, page * pageSize);

  const handleExportCSV = () => {
    const headers = 'ID,Symbol,Side,Amount,Price,PnL,Fee,Timestamp,Strategy\n';
    const rows = history
      .map(
        (t) => `${t.id},${t.symbol},${t.side},${t.amount},${t.price},${t.pnl},${t.fee},"${t.timestamp}","${t.strategyTag}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CryptoTraderPro_History_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-blue-400" />
            <span>تاریخچه کامل معاملات و گزارش‌گیری (Trade History)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            سوابق تمام پوزیشن‌های تسویه‌شده به همراه سود/ضرر، کارمزد و برچسب استراتژی با قابلیت خروجی CSV
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>دانلود گزارش CSV</span>
          </button>
          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('آیا از پاکسازی کامل تاریخچه معاملات اطمینان دارید؟')) {
                  clearHistory();
                }
              }}
              className="p-2.5 bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-300 rounded-xl transition-all border border-slate-700"
              title="پاکسازی تاریخچه"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="جستجو نماد یا استراتژی..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-white outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 font-bold">فیلتر ارز:</span>
          <select
            value={filterSymbol}
            onChange={(e) => {
              setFilterSymbol(e.target.value);
              setPage(1);
            }}
            className="bg-slate-950 text-white font-bold px-3 py-2 rounded-lg border border-slate-800 outline-none focus:border-blue-500"
          >
            <option value="ALL">همه ارزها</option>
            <option value="BTC/USDT">BTC/USDT</option>
            <option value="ETH/USDT">ETH/USDT</option>
            <option value="SOL/USDT">SOL/USDT</option>
            <option value="BNB/USDT">BNB/USDT</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {paginatedTrades.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">هیچ رکورد معاملاتی یافت نشد.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">شناسه معامله</th>
                  <th className="p-4">نماد</th>
                  <th className="p-4">نوع</th>
                  <th className="p-4">حجم ($)</th>
                  <th className="p-4">قیمت خروج</th>
                  <th className="p-4">سود/ضرر ($)</th>
                  <th className="p-4">کارمزد ($)</th>
                  <th className="p-4">زمان تسویه</th>
                  <th className="p-4">منبع/استراتژی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {paginatedTrades.map((trade) => {
                  const isProfit = trade.pnl >= 0;

                  return (
                    <tr key={trade.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 text-slate-500 text-[11px]">{trade.id.slice(-8)}</td>
                      <td className="p-4 font-bold text-white text-sm dir-ltr">{trade.symbol}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          trade.side === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {trade.side === 'BUY' ? 'خرید' : 'فروش'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-200 dir-ltr">${trade.amount.toLocaleString()}</td>
                      <td className="p-4 text-slate-300 dir-ltr">${trade.price.toLocaleString()}</td>
                      <td className={`p-4 font-bold dir-ltr ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isProfit ? '+' : ''}${trade.pnl.toFixed(2)}
                      </td>
                      <td className="p-4 text-amber-400 dir-ltr">${trade.fee.toFixed(2)}</td>
                      <td className="p-4 text-slate-400 text-[11px] font-sans">{trade.timestamp}</td>
                      <td className="p-4">
                        <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[11px] font-sans">
                          {trade.strategyTag}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              صفحه {page} از {totalPages} ({filteredHistory.length} معامله)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-slate-800 disabled:opacity-40 text-slate-200 font-bold rounded-lg"
              >
                قبلی
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-slate-800 disabled:opacity-40 text-slate-200 font-bold rounded-lg"
              >
                بعدی
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
