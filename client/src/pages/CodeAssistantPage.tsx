import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { FileCode, Play, Sparkles, Copy, Check, Bug, Cpu, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export const CodeAssistantPage: React.FC = () => {
  const [code, setCode] = useState(`// Express Rate Limiter Middleware Snippet
import rateLimit from 'express-rate-limit';

export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { error: 'Rate limit exceeded' }
});`);
  const [language, setLanguage] = useState('typescript');
  const [action, setAction] = useState<'generate' | 'explain' | 'debug' | 'optimize'>('debug');
  const [instruction, setInstruction] = useState('Check for missing CORS options and error trace handling.');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { customApiKey } = useAuth();

  const handleExecute = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/v1/ai/code/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, action, instruction, customApiKey })
      });
      const data = await res.json();
      setResult(data.result);
      toast.success(`Code ${action} completed!`);
    } catch (e) {
      toast.error('Code assistant request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#0B0F17] pb-12">
      <Header title="AI Code Assistant & Debugger Studio" />

      <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Workspace Toolbar controls */}
        <div className="p-4 rounded-2xl bg-[#131A27] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-blue-400 focus:outline-none"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="sql">SQL / PostgreSQL</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>

            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setAction('debug')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  action === 'debug' ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Debug
              </button>
              <button
                onClick={() => setAction('optimize')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  action === 'optimize' ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Optimize
              </button>
              <button
                onClick={() => setAction('explain')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  action === 'explain' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Explain
              </button>
              <button
                onClick={() => setAction('generate')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  action === 'generate' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Generate
              </button>
            </div>
          </div>

          <button
            onClick={handleExecute}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-blue-500/30 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{loading ? 'Analyzing Code...' : `Run AI ${action.toUpperCase()}`}</span>
          </button>
        </div>

        {/* Dual Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Code Editor */}
          <div className="bg-[#131A27] border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-blue-400" />
                <span>Source Code Workspace</span>
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 bg-slate-950 p-4 rounded-xl text-xs font-mono text-blue-300 placeholder-slate-600 focus:outline-none resize-none border border-slate-800/80 leading-relaxed"
            />
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Custom instructions (e.g., Fix memory leaks, convert to async/await)..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 placeholder-slate-600 focus:outline-none"
            />
          </div>

          {/* AI Code Output Console */}
          <div className="bg-[#131A27] border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Engineering Analysis Output</span>
              </span>
            </div>
            <div className="w-full h-[440px] bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-y-auto text-xs text-slate-200 prose prose-invert max-w-none">
              {result ? (
                <ReactMarkdown>{result}</ReactMarkdown>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
                  Run an action to inspect AI optimization recommendations.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
