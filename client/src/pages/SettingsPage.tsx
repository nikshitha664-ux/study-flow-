import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Settings, Key, Sun, Moon, ShieldCheck, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { customApiKey, setCustomApiKey, user } = useAuth();
  const [apiKeyInput, setApiKeyInput] = useState(customApiKey);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomApiKey(apiKeyInput);
    toast.success('Custom Gemini API Key saved!');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#0B0F17] pb-12">
      <Header title="User Settings & API Configurations" />

      <main className="p-6 max-w-4xl mx-auto w-full space-y-8">
        {/* Gemini API Key Integration Box */}
        <div className="p-6 rounded-2xl bg-[#131A27] border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Custom Gemini API Key Override</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Provide your own Google Gemini API key to override workspace standard rate limits or access custom tuned models.
          </p>
          <form onSubmit={handleSaveApiKey} className="flex gap-3">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Key</span>
            </button>
          </form>
        </div>

        {/* Theme Preferences */}
        <div className="p-6 rounded-2xl bg-[#131A27] border border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Interface Appearance</h3>
            <p className="text-xs text-slate-400 mt-0.5">Toggle theme mode preference across desktop & mobile UI</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-all"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span className="capitalize">{theme} Mode</span>
          </button>
        </div>

        {/* Account Profile Details */}
        <div className="p-6 rounded-2xl bg-[#131A27] border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Account Isolation & RLS Security</h3>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Authenticated Email:</span>
              <span className="text-slate-200 font-semibold">{user?.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Tenant Identifier:</span>
              <span className="text-blue-400 font-mono">{user?.id}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Database Role Isolation:</span>
              <span className="text-emerald-400 font-semibold">Row Level Security (RLS) Enforced</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
