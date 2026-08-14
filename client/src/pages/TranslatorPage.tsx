import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Languages, ArrowRightLeft, Sparkles, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const TranslatorPage: React.FC = () => {
  const [sourceText, setSourceText] = useState('Welcome to AI Workspace. High performance productivity platform for engineering teams.');
  const [targetLanguage, setTargetLanguage] = useState<'English' | 'Hindi' | 'Telugu' | 'French' | 'German' | 'Japanese'>('French');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const { customApiKey } = useAuth();

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText, targetLanguage, customApiKey })
      });
      const data = await res.json();
      setTranslatedText(data.translatedText);
      toast.success(`Translated into ${targetLanguage}!`);
    } catch (e) {
      toast.error('Translation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#0B0F17] pb-12">
      <Header title="Multi-Language Translation Engine" />

      <main className="p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Language Selection Header */}
        <div className="p-4 rounded-2xl bg-[#131A27] border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs font-semibold text-slate-300">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">Source: Auto Detect</span>
            <ArrowRightLeft className="w-4 h-4 text-blue-400" />
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 focus:outline-none"
            >
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Hindi">Hindi</option>
              <option value="Telugu">Telugu</option>
              <option value="Japanese">Japanese</option>
              <option value="English">English</option>
            </select>
          </div>

          <button
            onClick={handleTranslate}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-blue-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Translating...' : 'Translate Content'}</span>
          </button>
        </div>

        {/* Dual Text Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#131A27] border border-slate-800 rounded-2xl p-4 flex flex-col space-y-2">
            <label className="text-xs font-bold text-slate-400">Original Text</label>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="w-full h-72 bg-slate-950 p-4 rounded-xl text-sm text-slate-200 focus:outline-none resize-none border border-slate-800/80 leading-relaxed"
            />
          </div>

          <div className="bg-[#131A27] border border-slate-800 rounded-2xl p-4 flex flex-col space-y-2">
            <label className="text-xs font-bold text-slate-400">Target Output ({targetLanguage})</label>
            <textarea
              value={translatedText}
              readOnly
              placeholder="Translation output will render here with full context preservation..."
              className="w-full h-72 bg-slate-950 p-4 rounded-xl text-sm text-blue-300 focus:outline-none resize-none border border-slate-800/80 leading-relaxed"
            />
          </div>
        </div>
      </main>
    </div>
  );
};
