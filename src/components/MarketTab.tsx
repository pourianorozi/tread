import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { CryptoPair } from '../types';
import { generateCandles, INITIAL_NEWS } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart2, Newspaper, TrendingUp, TrendingDown, ArrowUpDown, ExternalLink, Sparkles } from 'lucide-react';

export const MarketTab: React.FC = () => {
  const { pairs, selectedPair, setSelectedPair } = useTrading();
  const [timeframe, setTimeframe] = useState<string>('15m');
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');

  // Generate Candle data for selected pair
  const candleData = React.useMemo(() => {
    return generateCandles(selectedPair.price, 35);
  }, [selectedPair.symbol, timeframe]);

  // Orderbook Simulation
  const orderbook = React.useMemo(() => {
    const baseP = selectedPair.price;
    const bids = Array.from({ length: 6 }).map((_, i) => ({
      price: Number((baseP * (1 - (i + 1) * 0.0012)).toFixed(2)),
      amount: Number((Math.random() * 2.5 + 0.1).toFixed(3)),
      total: 0
    }));
    const asks = Array.from({ length: 6 }).map((_, i) => ({
      price: Number((baseP * (1 + (i + 1) * 0.0012)).toFixed(2)),
      amount: Number((Math.random() * 2.5 + 0.1).toFixed(3)),
      total: 0
    })).reverse();

    return { bids, asks };
  }, [selectedPair.price]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Pair Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {pairs.map((pair) => {
          const isSelected = pair.symbol === selectedPair.symbol;
          const isPositive = pair.change24h >= 0;
          return (
            <button
              key={pair.symbol}
              onClick={() => setSelectedPair(pair)}
              className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between w-full text-xs font-bold mb-1">
                <span>{pair.symbol}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                  isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {isPositive ? '+' : ''}{pair.change24h}%
                </span>
              </div>
              <div className="text-base font-extrabold font-mono dir-ltr text-right mt-1">
                ${pair.price.toLocaleString()}
              </div>
            </button>
          );
        })}
      </div>

      {/* Chart & Orderbook Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Technical Chart Panel */}
        <div className="lg:col-span-2 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white font-mono">{selectedPair.symbol}</h2>
              <div className="text-sm font-extrabold text-emerald-400 font-mono dir-ltr">
                ${selectedPair.price.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Timeframes */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                {['1m', '5m', '15m', '1h', '4h', '1d'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded font-bold transition-all ${
                      timeframe === tf ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Chart Type Toggle */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-2.5 py-1 rounded font-bold ${chartType === 'line' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                >
                  خطی
                </button>
                <button
                  onClick={() => setChartType('candlestick')}
                  className={`px-2.5 py-1 rounded font-bold ${chartType === 'candlestick' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                >
                  شمعی
                </button>
              </div>
            </div>
          </div>

          {/* Chart Display */}
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={candleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: any) => [`$${value}`, 'قیمت']}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pair Stats Footer */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 block">سقف ۲۴ ساعت:</span>
              <span className="font-bold text-slate-200 font-mono dir-ltr">${selectedPair.high24h.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block">کف ۲۴ ساعت:</span>
              <span className="font-bold text-slate-200 font-mono dir-ltr">${selectedPair.low24h.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block">حجم معاملات:</span>
              <span className="font-bold text-slate-200 font-mono dir-ltr">${selectedPair.volume24h.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block">شاخص نوسان:</span>
              <span className="font-bold text-amber-400 font-mono">متوسط (Medium)</span>
            </div>
          </div>
        </div>

        {/* Live Orderbook Panel */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-amber-400" />
              <span>دفتر سفارشات زنده (Orderbook)</span>
            </h3>
            <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
              اسپرد ۰.۰۵٪
            </span>
          </div>

          {/* Asks (Sell Orders) */}
          <div className="space-y-1 text-xs font-mono">
            <div className="grid grid-cols-2 text-slate-500 pb-1 text-[11px]">
              <span>قیمت (USDT)</span>
              <span className="text-left">حجم (Crypto)</span>
            </div>
            {orderbook.asks.map((ask, idx) => (
              <div key={idx} className="grid grid-cols-2 py-1 px-1.5 rounded hover:bg-rose-500/10 text-rose-400 transition-colors">
                <span>${ask.price.toLocaleString()}</span>
                <span className="text-left text-slate-300">{ask.amount}</span>
              </div>
            ))}
          </div>

          {/* Current Spread Bar */}
          <div className="py-2 my-1 border-y border-slate-800 bg-slate-950 px-3 rounded flex items-center justify-between text-xs">
            <span className="text-slate-400">قیمت لحظه‌ای</span>
            <span className="font-bold text-emerald-400 font-mono">${selectedPair.price.toLocaleString()}</span>
          </div>

          {/* Bids (Buy Orders) */}
          <div className="space-y-1 text-xs font-mono">
            {orderbook.bids.map((bid, idx) => (
              <div key={idx} className="grid grid-cols-2 py-1 px-1.5 rounded hover:bg-emerald-500/10 text-emerald-400 transition-colors">
                <span>${bid.price.toLocaleString()}</span>
                <span className="text-left text-slate-300">{bid.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market News & AI Insights */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-400" />
            <span>اخبار و تحلیل هوشمند سنتیمنت کریپتو (AI Market News)</span>
          </h3>
          <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            تحلیل با Gemini AI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_NEWS.map((news) => (
            <div key={news.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-blue-400">{news.source}</span>
                <span>{news.time}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 leading-snug">{news.title}</h4>
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className={`px-2 py-0.5 rounded font-bold ${
                  news.sentiment === 'BULLISH' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'
                }`}>
                  سیگنال: {news.sentiment === 'BULLISH' ? 'صعودی (Bullish)' : 'خنثی (Neutral)'}
                </span>
                <span className="text-slate-500">تاثیر: {news.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
