import React, { useState } from 'react';
import { Search, Bell, Sparkles, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC<{ title?: string }> = ({ title = "Dashboard" }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      const q = query.toLowerCase();
      if (q.includes('chat')) navigate('/chat');
      else if (q.includes('doc') || q.includes('pdf')) navigate('/documents');
      else if (q.includes('note')) navigate('/notes');
      else if (q.includes('code')) navigate('/code-assistant');
      else if (q.includes('translate')) navigate('/translator');
      else if (q.includes('image')) navigate('/image-generator');
      else if (q.includes('project') || q.includes('task')) navigate('/projects');
      else navigate('/dashboard');
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0B0F17]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Gemini 2.5 Flash
        </span>
      </div>

      <div className="flex items-center space-x-3">
        {/* Global Search Bar Command Palette Trigger */}
        <div className="relative">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center space-x-2 w-48 sm:w-64 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs hover:border-slate-700 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="flex-1 text-left">Quick Search...</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
              <Command className="w-3 h-3 mr-0.5" /> K
            </kbd>
          </button>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-[#0B0F17]" />
        </button>

        {/* AI Quick Prompt Button */}
        <button 
          onClick={() => navigate('/chat')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold hover:opacity-90 shadow-md shadow-blue-500/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New AI Task</span>
        </button>
      </div>

      {/* Command Palette Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-lg bg-[#131A27] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
              <Search className="w-5 h-5 text-blue-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search modules (e.g. Chat, Notes, Code, Tasks)..."
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
                autoFocus
              />
              <button 
                onClick={() => setSearchOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded bg-slate-800"
              >
                ESC
              </button>
            </div>
            <div className="p-3 text-xs text-slate-400 space-y-1">
              <p className="px-3 py-1 font-semibold text-slate-500 uppercase text-[10px]">Suggestions</p>
              <div onClick={() => { navigate('/chat'); setSearchOpen(false); }} className="px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer flex justify-between">
                <span>AI Chat Assistant</span> <span className="text-slate-600">/chat</span>
              </div>
              <div onClick={() => { navigate('/documents'); setSearchOpen(false); }} className="px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer flex justify-between">
                <span>Document Assistant & PDF Quiz</span> <span className="text-slate-600">/documents</span>
              </div>
              <div onClick={() => { navigate('/code-assistant'); setSearchOpen(false); }} className="px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer flex justify-between">
                <span>Code Debugger & Generator</span> <span className="text-slate-600">/code-assistant</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
