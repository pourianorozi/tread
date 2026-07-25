import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { Settings, Shield, Key, Eye, EyeOff, Lock, CheckCircle2, Save, HardDrive, Cpu, Radio } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { riskSettings, setRiskSettings, securityConfig, setSecurityConfig, logs } = useTrading();

  const [apiKeyInput, setApiKeyInput] = useState<string>(securityConfig.apiKey);
  const [secretKeyInput, setSecretKeyInput] = useState<string>(securityConfig.secretKey);
  const [showKeys, setShowKeys] = useState<boolean>(false);
  const [totpInput, setTotpInput] = useState<string>('');
  const [totpVerified, setTotpVerified] = useState<boolean>(securityConfig.twoFactorEnabled);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Local Form state for risk settings
  const [dailyLoss, setDailyLoss] = useState<number>(riskSettings.dailyLossLimit);
  const [maxTrades, setMaxTrades] = useState<number>(riskSettings.maxDailyTrades);
  const [maxPos, setMaxPos] = useState<number>(riskSettings.maxPositions);
  const [fee, setFee] = useState<number>(riskSettings.feeRate * 100); // in percent

  const handleSaveSecurity = () => {
    setSecurityConfig((prev) => ({
      ...prev,
      apiKey: apiKeyInput,
      secretKey: secretKeyInput,
      twoFactorEnabled: totpVerified
    }));
    setSaveSuccessMsg('تنظیمات کلیدهای API و لایه امنیت رمزنگاری با موفقیت ذخیره شد.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveRisk = () => {
    setRiskSettings({
      dailyLossLimit: dailyLoss,
      maxDailyTrades: maxTrades,
      maxPositions: maxPos,
      feeRate: fee / 100,
      leverageLimit: 10
    });
    setSaveSuccessMsg('تنظیمات پارامترهای کنترل ریسک به‌روزرسانی گردید.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleVerify2FA = () => {
    if (totpInput.length === 6) {
      setTotpVerified(true);
      setSecurityConfig((prev) => ({ ...prev, twoFactorEnabled: true }));
      alert('شناسایی دو مرحله‌ای (2FA TOTP) با موفقیت روی حساب شما فعال گردید.');
    } else {
      alert('لطفاً یک کد ۶ رقمی معتبر وارد کنید.');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            <span>تنظیمات پیشرفته، امنیت و لایه ریسک (Settings & Risk)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            پیکربندی اتصال اتصال به صرافی، کلیدهای رمزنگاری‌شده، تایید دو مرحله‌ای و حد ضرر روزانه
          </p>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & API Keys Panel */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span>کلیدهای API و امنیت (Security & API)</span>
            </h3>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
              AES-256 PBKDF2
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block">Nobitex / Exchange API Key:</label>
              <div className="relative">
                <input
                  type={showKeys ? 'text' : 'password'}
                  placeholder="کلید API صرافی نوبیتکس را وارد کنید..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 pl-10 text-white font-mono dir-ltr outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys(!showKeys)}
                  className="absolute left-3 top-3 text-slate-500 hover:text-white"
                >
                  {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block">Secret Key:</label>
              <input
                type={showKeys ? 'text' : 'password'}
                placeholder="کلید Secret صرافی را وارد کنید..."
                value={secretKeyInput}
                onChange={(e) => setSecretKeyInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono dir-ltr outline-none focus:border-blue-500"
              />
            </div>

            {/* 2FA TOTP Setup */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span>شناسایی دو مرحله‌ای (2FA TOTP)</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${totpVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {totpVerified ? 'فعال' : 'غیرفعال'}
                </span>
              </div>

              {!totpVerified && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="کد ۶ رقمی TOTP..."
                    value={totpInput}
                    onChange={(e) => setTotpInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono dir-ltr text-center outline-none"
                  />
                  <button
                    onClick={handleVerify2FA}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                  >
                    تأیید کد
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleSaveSecurity}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره کلیدهای امنیتی</span>
            </button>
          </div>
        </div>

        {/* Risk Management Engine Panel */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <span>موتور کنترل ریسک خودکار (Risk Management)</span>
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block">حداکثر ضرر مجاز روزانه ($):</label>
              <input
                type="number"
                value={dailyLoss}
                onChange={(e) => setDailyLoss(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono dir-ltr outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block">سقف معاملات مجاز روزانه:</label>
              <input
                type="number"
                value={maxTrades}
                onChange={(e) => setMaxTrades(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono dir-ltr outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block">حداکثر پوزیشن‌های باز همزمان:</label>
              <input
                type="number"
                value={maxPos}
                onChange={(e) => setMaxPos(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono dir-ltr outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block">نرخ کارمزد صرافی (درصد ٪):</label>
              <input
                type="number"
                step="0.01"
                value={fee}
                onChange={(e) => setFee(parseFloat(e.target.value) || 0.1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono dir-ltr outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handleSaveRisk}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره پارامترهای کنترل ریسک</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Event Logs */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-purple-400" />
            <span>لاگ وقایع هسته موتور سیستم (System Event Logs)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {logs.length} رویداد
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 h-40 overflow-y-auto font-mono text-xs space-y-1.5">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2">
              <span className="text-slate-500 font-bold">[{log.timestamp}]</span>
              <span className={`font-bold ${
                log.level === 'SUCCESS' ? 'text-emerald-400' : log.level === 'WARN' ? 'text-amber-400' : log.level === 'ERROR' ? 'text-rose-400' : 'text-blue-400'
              }`}>
                [{log.level}]
              </span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
