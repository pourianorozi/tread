import { CryptoPair, CandleData, NewsItem, BotState } from '../types';

export const INITIAL_PAIRS: CryptoPair[] = [
  { symbol: 'BTC/USDT', baseCurrency: 'BTC', quoteCurrency: 'USDT', price: 65420.5, change24h: 2.84, high24h: 66200.0, low24h: 63800.0, volume24h: 48210.5 },
  { symbol: 'ETH/USDT', baseCurrency: 'ETH', quoteCurrency: 'USDT', price: 3512.8, change24h: -1.15, high24h: 3620.0, low24h: 3450.0, volume24h: 125400.2 },
  { symbol: 'SOL/USDT', baseCurrency: 'SOL', quoteCurrency: 'USDT', price: 148.25, change24h: 5.62, high24h: 152.0, low24h: 139.5, volume24h: 890450.0 },
  { symbol: 'BNB/USDT', baseCurrency: 'BNB', quoteCurrency: 'USDT', price: 585.4, change24h: 0.45, high24h: 592.0, low24h: 578.0, volume24h: 32100.8 },
  { symbol: 'USDT/IRT', baseCurrency: 'USDT', quoteCurrency: 'IRT', price: 61250.0, change24h: 0.82, high24h: 61800.0, low24h: 60700.0, volume24h: 18500000.0 },
];

export const generateCandles = (basePrice: number, count = 40): CandleData[] => {
  const candles: CandleData[] = [];
  let currentPrice = basePrice * 0.95;
  const now = new Date();

  for (let i = count; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const changePct = (Math.random() - 0.48) * 0.015;
    const open = currentPrice;
    const close = open * (1 + changePct);
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    const volume = Math.floor(Math.random() * 50 + 10);

    candles.push({ time, open, high, low, close, volume });
    currentPrice = close;
  }
  return candles;
};

export const INITIAL_NEWS: NewsItem[] = [
  { id: '1', title: 'بیت‌کوین به بالاترین سطح مقاومت محلی در محدوده ۶۶,۰۰۰ دلار نزدیک می‌شود', source: 'نوبیتکس مگ', time: '۱۰ دقیقه پیش', impact: 'HIGH', sentiment: 'BULLISH' },
  { id: '2', title: 'افزایش چشمگیر حجم معاملات روزانه سولانا در صرافی‌های متمرکز', source: 'کریپتو نیوز', time: '۲۵ دقیقه پیش', impact: 'MEDIUM', sentiment: 'BULLISH' },
  { id: '3', title: 'تصمیم جدید فدرال رزرو درباره نرخ بهره آمریکا امشب اعلام می‌شود', source: 'بلومبرگ', time: '۱ ساعت پیش', impact: 'HIGH', sentiment: 'NEUTRAL' },
  { id: '4', title: 'بروزرسانی شبکه اصلی اتریوم با کاهش ۷۰ درصدی کارمزد لایه دوم همراه شد', source: 'کوین‌تلگراف', time: '۲ ساعت پیش', impact: 'MEDIUM', sentiment: 'BULLISH' },
];

export const INITIAL_BOTS: BotState[] = [
  {
    id: 'GRID',
    name: 'ربات گرید (Grid Trading)',
    symbol: 'BTC/USDT',
    status: 'STOPPED',
    profit: 142.50,
    tradesCount: 18,
    config: { levels: 6, gridSpreadPct: 0.8, lowerBound: 62000, upperBound: 68000, investment: 500 },
    logs: [
      { time: '10:15:02', msg: 'ربات آماده‌سازی شد - محدوده ۶۲,۰۰۰ تا ۶۸,۰۰۰', type: 'info' }
    ]
  },
  {
    id: 'ARBITRAGE',
    name: 'ربات آربیتراژ (Nobitex vs Binance)',
    symbol: 'USDT/IRT',
    status: 'STOPPED',
    profit: 85.20,
    tradesCount: 12,
    config: { minSpreadPct: 0.6, maxLatencyMs: 120, capitalAllocation: 1000 },
    logs: [
      { time: '09:40:11', msg: 'بررسی اختلاف قیمت صرافی نوبیتکس و بایننس فعال است', type: 'info' }
    ]
  },
  {
    id: 'AI',
    name: 'ربات هوش مصنوعی (RSI & Moving Average)',
    symbol: 'ETH/USDT',
    status: 'STOPPED',
    profit: 215.80,
    tradesCount: 9,
    config: { timeframe: '15m', rsiPeriod: 14, overbought: 70, oversold: 30, riskPerTrade: 2 },
    logs: [
      { time: '08:30:00', msg: 'سیگنال‌یاب هوشمند آماده دریافت داده‌های زنده', type: 'info' }
    ]
  }
];
