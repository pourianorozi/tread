import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CryptoPair,
  Position,
  TradeRecord,
  BotState,
  RiskSettings,
  SecurityConfig,
  OrderSide,
  OrderType,
  SystemLogs
} from '../types';
import { INITIAL_PAIRS, INITIAL_BOTS } from '../data/mockData';

interface TradingContextType {
  isDemo: boolean;
  setIsDemo: (demo: boolean) => void;
  balance: number;
  setBalance: (val: number) => void;
  pairs: CryptoPair[];
  selectedPair: CryptoPair;
  setSelectedPair: (pair: CryptoPair) => void;
  positions: Position[];
  history: TradeRecord[];
  bots: BotState[];
  riskSettings: RiskSettings;
  setRiskSettings: React.Dispatch<React.SetStateAction<RiskSettings>>;
  securityConfig: SecurityConfig;
  setSecurityConfig: React.Dispatch<React.SetStateAction<SecurityConfig>>;
  logs: SystemLogs[];
  dailyPnl: number;
  openPosition: (
    symbol: string,
    side: OrderSide,
    type: OrderType,
    amount: number,
    price: number,
    sl: number,
    tp: number,
    strategyTag?: string
  ) => { success: boolean; message: string };
  closePosition: (posId: string, reason?: string) => { success: boolean; message: string };
  closeAllPositions: () => void;
  updatePositionLimits: (posId: string, amount: number, sl: number, tp: number) => void;
  toggleBot: (botId: string) => void;
  updateBotConfig: (botId: string, newConfig: Record<string, any>) => void;
  clearHistory: () => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemo, setIsDemo] = useState<boolean>(() => {
    return localStorage.getItem('cpro_demo') !== 'false';
  });

  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('cpro_balance');
    return saved ? parseFloat(saved) : 10000.0;
  });

  const [pairs, setPairs] = useState<CryptoPair[]>(INITIAL_PAIRS);
  const [selectedPair, setSelectedPair] = useState<CryptoPair>(INITIAL_PAIRS[0]);

  const [positions, setPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem('cpro_positions');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<TradeRecord[]>(() => {
    const saved = localStorage.getItem('cpro_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 'trade_init_1',
        symbol: 'BTC/USDT',
        side: 'BUY',
        amount: 500,
        price: 64200,
        pnl: 32.50,
        fee: 0.50,
        timestamp: new Date(Date.now() - 3600000 * 4).toLocaleString('fa-IR'),
        strategyTag: 'معامله دستی'
      }
    ];
  });

  const [bots, setBots] = useState<BotState[]>(INITIAL_BOTS);

  const [riskSettings, setRiskSettings] = useState<RiskSettings>(() => {
    const saved = localStorage.getItem('cpro_risk');
    return saved ? JSON.parse(saved) : {
      dailyLossLimit: 200,
      maxDailyTrades: 15,
      maxPositions: 5,
      feeRate: 0.001,
      leverageLimit: 10
    };
  });

  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>(() => {
    const saved = localStorage.getItem('cpro_security');
    return saved ? JSON.parse(saved) : {
      apiKey: '',
      secretKey: '',
      isEncrypted: true,
      twoFactorEnabled: false,
      hardwareWalletConnected: false
    };
  });

  const [logs, setLogs] = useState<SystemLogs[]>([
    {
      id: 'log_1',
      timestamp: new Date().toLocaleTimeString('fa-IR'),
      level: 'INFO',
      message: 'سامانه Crypto Trader Pro با موفقیت راه‌اندازی شد.'
    }
  ]);

  const addLog = (level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', message: string) => {
    setLogs((prev) => [
      {
        id: `log_${Date.now()}_${Math.random()}`,
        timestamp: new Date().toLocaleTimeString('fa-IR'),
        level,
        message
      },
      ...prev.slice(0, 49)
    ]);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('cpro_demo', String(isDemo));
    localStorage.setItem('cpro_balance', String(balance));
    localStorage.setItem('cpro_positions', JSON.stringify(positions));
    localStorage.setItem('cpro_history', JSON.stringify(history));
    localStorage.setItem('cpro_risk', JSON.stringify(riskSettings));
    localStorage.setItem('cpro_security', JSON.stringify(securityConfig));
  }, [isDemo, balance, positions, history, riskSettings, securityConfig]);

  // Live Price Ticker Generator
  useEffect(() => {
    const interval = setInterval(() => {
      setPairs((prevPairs) => {
        const updated = prevPairs.map((pair) => {
          const deltaPct = (Math.random() - 0.49) * 0.006;
          const newPrice = Math.max(0.001, pair.price * (1 + deltaPct));
          const roundedPrice = Number(newPrice.toFixed(pair.symbol.includes('IRT') ? 0 : 2));
          const high = Math.max(pair.high24h, roundedPrice);
          const low = Math.min(pair.low24h, roundedPrice);
          const newChange = Number((pair.change24h + deltaPct * 10).toFixed(2));
          return {
            ...pair,
            price: roundedPrice,
            change24h: newChange,
            high24h: high,
            low24h: low
          };
        });

        // Update selectedPair reference if price changed
        const currentSelected = updated.find((p) => p.symbol === selectedPair.symbol);
        if (currentSelected) {
          setSelectedPair(currentSelected);
        }

        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedPair.symbol]);

  // Monitor Positions for Stop Loss & Take Profit and calculate PnL
  useEffect(() => {
    if (positions.length === 0) return;

    setPositions((prevPositions) => {
      let needsStateUpdate = false;
      const updated = prevPositions.map((pos) => {
        const currentPair = pairs.find((p) => p.symbol === pos.symbol);
        const currentPrice = currentPair ? currentPair.price : pos.entryPrice;

        // Calculate PnL
        let rawPnl = 0;
        if (pos.side === 'BUY') {
          rawPnl = (currentPrice - pos.entryPrice) * pos.quantity;
        } else {
          rawPnl = (pos.entryPrice - currentPrice) * pos.quantity;
        }

        const netPnl = rawPnl - pos.fee;

        // Check SL & TP trigger
        let triggeredReason: string | null = null;
        if (pos.stopLoss > 0) {
          if (pos.side === 'BUY' && currentPrice <= pos.stopLoss) triggeredReason = 'حد ضرر (Stop Loss)';
          if (pos.side === 'SELL' && currentPrice >= pos.stopLoss) triggeredReason = 'حد ضرر (Stop Loss)';
        }
        if (pos.takeProfit > 0) {
          if (pos.side === 'BUY' && currentPrice >= pos.takeProfit) triggeredReason = 'حد سود (Take Profit)';
          if (pos.side === 'SELL' && currentPrice <= pos.takeProfit) triggeredReason = 'حد سود (Take Profit)';
        }

        if (triggeredReason) {
          needsStateUpdate = true;
          // Auto close position
          setTimeout(() => closePosition(pos.id, triggeredReason!), 50);
        }

        return {
          ...pos,
          pnl: Number(rawPnl.toFixed(2)),
          netPnl: Number(netPnl.toFixed(2))
        };
      });

      return needsStateUpdate ? updated : updated;
    });
  }, [pairs]);

  // Simulated bot activity loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBots((prevBots) =>
        prevBots.map((bot) => {
          if (bot.status !== 'RUNNING') return bot;

          const timeStr = new Date().toLocaleTimeString('fa-IR');
          const isTradeExecuted = Math.random() < 0.25;
          const profitDelta = (Math.random() - 0.42) * 5.5;

          const newLogs = [...bot.logs];
          if (isTradeExecuted) {
            newLogs.unshift({
              time: timeStr,
              msg: `اجرای خودکار معامله گرید/سیگنال - سود دبردی: $${profitDelta.toFixed(2)}`,
              type: profitDelta >= 0 ? 'success' : 'warning'
            });
          }

          return {
            ...bot,
            profit: Number((bot.profit + (isTradeExecuted ? profitDelta : 0)).toFixed(2)),
            tradesCount: bot.tradesCount + (isTradeExecuted ? 1 : 0),
            logs: newLogs.slice(0, 15)
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Calculate Daily PnL
  const dailyPnl = history
    .filter((t) => {
      const today = new Date().toLocaleDateString('fa-IR');
      return t.timestamp.includes(today) || true; // sum recent for demo
    })
    .reduce((sum, t) => sum + t.pnl, 0);

  // Open Position
  const openPosition = (
    symbol: string,
    side: OrderSide,
    type: OrderType,
    amount: number,
    price: number,
    sl: number,
    tp: number,
    strategyTag = 'معامله دستی'
  ) => {
    const currentPair = pairs.find((p) => p.symbol === symbol);
    const execPrice = type === 'MARKET' ? (currentPair ? currentPair.price : price) : price;

    // Risk Check 1: Balance
    const fee = amount * riskSettings.feeRate;
    if (amount + fee > balance) {
      addLog('WARN', `خطای موجودی: موجودی کیف پول ($${balance.toFixed(2)}) برای معامله $${amount} کافی نیست.`);
      return { success: false, message: 'موجودی کیف پول برای انجام این معامله کافی نیست.' };
    }

    // Risk Check 2: Max Positions
    if (positions.length >= riskSettings.maxPositions) {
      addLog('WARN', `محدودیت ریسک: حداکثر تعداد پوزیشن‌های همزمان (${riskSettings.maxPositions}) پر شده است.`);
      return { success: false, message: `حداکثر تعداد پوزیشن‌های باز همزمان (${riskSettings.maxPositions}) تکمیل شده است.` };
    }

    // Risk Check 3: Daily Trades Limit
    const todayTrades = history.length;
    if (todayTrades >= riskSettings.maxDailyTrades) {
      addLog('WARN', `محدودیت تعداد معامله روزانه: رسیدن به سقف ${riskSettings.maxDailyTrades} معامله.`);
      return { success: false, message: `به حداکثر تعداد معامله مجاز روزانه (${riskSettings.maxDailyTrades}) رسیده‌اید.` };
    }

    // Calculate quantity
    const quantity = amount / execPrice;

    // Deduct from Balance
    setBalance((prev) => prev - amount - fee);

    const newPos: Position = {
      id: `POS_${Date.now()}`,
      symbol,
      side,
      amount,
      quantity,
      entryPrice: execPrice,
      stopLoss: sl,
      takeProfit: tp,
      timestamp: new Date().toLocaleString('fa-IR'),
      status: 'OPEN',
      pnl: 0,
      netPnl: -fee,
      fee,
      strategyTag
    };

    setPositions((prev) => [newPos, ...prev]);
    addLog('SUCCESS', `پوزیشن ${side === 'BUY' ? 'خرید' : 'فروش'} ${symbol} با حجم $${amount.toLocaleString()} باز شد.`);

    return { success: true, message: 'پوزیشن با موفقیت ثبت شد.' };
  };

  // Close Position
  const closePosition = (posId: string, reason = 'بستن دستی') => {
    const pos = positions.find((p) => p.id === posId);
    if (!pos) return { success: false, message: 'پوزیشن یافت نشد.' };

    const currentPair = pairs.find((p) => p.symbol === pos.symbol);
    const closePrice = currentPair ? currentPair.price : pos.entryPrice;

    let rawPnl = 0;
    if (pos.side === 'BUY') {
      rawPnl = (closePrice - pos.entryPrice) * pos.quantity;
    } else {
      rawPnl = (pos.entryPrice - closePrice) * pos.quantity;
    }

    const netPnl = rawPnl - pos.fee;

    // Return balance + initial capital + netPnl
    setBalance((prev) => prev + pos.amount + netPnl);

    // Remove from active positions
    setPositions((prev) => prev.filter((p) => p.id !== posId));

    // Record in History
    const tradeRecord: TradeRecord = {
      id: `TR_${Date.now()}`,
      symbol: pos.symbol,
      side: pos.side,
      amount: pos.amount,
      price: closePrice,
      pnl: Number(netPnl.toFixed(2)),
      fee: pos.fee,
      timestamp: new Date().toLocaleString('fa-IR'),
      strategyTag: reason
    };

    setHistory((prev) => [tradeRecord, ...prev]);
    addLog('INFO', `پوزیشن ${pos.symbol} بسته شد (${reason}). سود/ضرر خالص: $${netPnl.toFixed(2)}`);

    return { success: true, message: `پوزیشن بسته شد. سود/ضرر: $${netPnl.toFixed(2)}` };
  };

  // Close All Positions
  const closeAllPositions = () => {
    positions.forEach((pos) => {
      closePosition(pos.id, 'بستن اضطراری تمام پوزیشن‌ها');
    });
  };

  // Update Position Limits
  const updatePositionLimits = (posId: string, amount: number, sl: number, tp: number) => {
    setPositions((prev) =>
      prev.map((pos) => {
        if (pos.id === posId) {
          const newQty = amount / pos.entryPrice;
          return {
            ...pos,
            amount,
            quantity: newQty,
            stopLoss: sl,
            takeProfit: tp
          };
        }
        return pos;
      })
    );
    addLog('INFO', `تنظیمات حد سود و حد ضرر پوزیشن ${posId} به‌روز شد.`);
  };

  // Toggle Bot
  const toggleBot = (botId: string) => {
    setBots((prev) =>
      prev.map((b) => {
        if (b.id === botId) {
          const nextStatus = b.status === 'RUNNING' ? 'STOPPED' : 'RUNNING';
          addLog('INFO', `وضعیت ${b.name} به ${nextStatus === 'RUNNING' ? 'فعال' : 'متوقف'} تغییر یافت.`);
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  // Update Bot Config
  const updateBotConfig = (botId: string, newConfig: Record<string, any>) => {
    setBots((prev) =>
      prev.map((b) => (b.id === botId ? { ...b, config: { ...b.config, ...newConfig } } : b))
    );
    addLog('INFO', `پیکربندی پارامترهای ربات ${botId} به‌روزرسانی شد.`);
  };

  const clearHistory = () => {
    setHistory([]);
    addLog('WARN', 'تاریخچه معاملات پاکسازی گردید.');
  };

  return (
    <TradingContext.Provider
      value={{
        isDemo,
        setIsDemo,
        balance,
        setBalance,
        pairs,
        selectedPair,
        setSelectedPair,
        positions,
        history,
        bots,
        riskSettings,
        setRiskSettings,
        securityConfig,
        setSecurityConfig,
        logs,
        dailyPnl,
        openPosition,
        closePosition,
        closeAllPositions,
        updatePositionLimits,
        toggleBot,
        updateBotConfig,
        clearHistory
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
