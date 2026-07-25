import React, { useState } from 'react';
import { TradingProvider } from './context/TradingContext';
import { Header } from './components/Header';
import { HomeTab } from './components/HomeTab';
import { MarketTab } from './components/MarketTab';
import { TradingTab } from './components/TradingTab';
import { PositionsTab } from './components/PositionsTab';
import { BotsTab } from './components/BotsTab';
import { HistoryTab } from './components/HistoryTab';
import { SettingsTab } from './components/SettingsTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  return (
    <TradingProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans dir-rtl selection:bg-blue-600 selection:text-white">
        {/* Navigation Header */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Tab Content View */}
        <main className="flex-1 pb-12">
          {activeTab === 'home' && <HomeTab setActiveTab={setActiveTab} />}
          {activeTab === 'market' && <MarketTab />}
          {activeTab === 'trading' && <TradingTab />}
          {activeTab === 'positions' && <PositionsTab />}
          {activeTab === 'bots' && <BotsTab />}
          {activeTab === 'history' && <HistoryTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>

        {/* System Footer */}
        <footer className="bg-slate-950 border-t border-slate-800/80 py-4 px-6 text-xs text-slate-500 text-center flex flex-wrap items-center justify-between gap-2">
          <div>
            🚀 <span className="font-bold text-slate-300">Crypto Trader Pro v3.0</span> — سامانه پیشرفته معاملات الگوریتمی و هوشمند کریپتو
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>رمزنگاری PBKDF2 & Fernet AES-256</span>
            <span>•</span>
            <span>پشتیبانی نوبیتکس و بایننس</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">وضعیت سیستم: آنلاین 🟢</span>
          </div>
        </footer>
      </div>
    </TradingProvider>
  );
}
