export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT';
export type PositionStatus = 'OPEN' | 'CLOSED';
export type BotType = 'GRID' | 'ARBITRAGE' | 'AI';

export interface CryptoPair {
  symbol: string;
  baseCurrency: string;
  quoteCurrency: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

export interface Position {
  id: string;
  symbol: string;
  side: OrderSide;
  amount: number; // in USDT
  quantity: number; // in Crypto units
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timestamp: string;
  status: PositionStatus;
  pnl: number;
  netPnl: number;
  fee: number;
  strategyTag?: string;
}

export interface TradeRecord {
  id: string;
  symbol: string;
  side: OrderSide;
  amount: number;
  price: number;
  pnl: number;
  fee: number;
  timestamp: string;
  strategyTag: string;
}

export interface BotState {
  id: BotType;
  name: string;
  symbol: string;
  status: 'RUNNING' | 'STOPPED' | 'PAUSED';
  profit: number;
  tradesCount: number;
  logs: { time: string; msg: string; type: 'info' | 'success' | 'warning' | 'error' }[];
  config: Record<string, any>;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export interface SystemLogs {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
}

export interface RiskSettings {
  dailyLossLimit: number;
  maxDailyTrades: number;
  maxPositions: number;
  feeRate: number; // e.g. 0.001 = 0.1%
  leverageLimit: number;
}

export interface SecurityConfig {
  apiKey: string;
  secretKey: string;
  isEncrypted: boolean;
  twoFactorEnabled: boolean;
  hardwareWalletConnected: boolean;
}
