import React from 'react';
import { Header } from '../components/layout/Header';
import { 
  MessageSquare, 
  FileText, 
  FileCode, 
  Languages, 
  Image as ImageIcon, 
  CheckSquare, 
  StickyNote, 
  ArrowRight,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    { title: 'AI Chat Assistant', desc: 'Real-time Gemini 2.5 streaming chat', icon: MessageSquare, route: '/chat', color: 'from-blue-600 to-indigo-600' },
    { title: 'PDF & Document Assistant', desc: 'Summarize, Q&A, and generate quizzes', icon: FileText, route: '/documents', color: 'from-purple-600 to-pink-600' },
    { title: 'Rich Text AI Notes', desc: 'Inline AI rephrasing, expand & tone check', icon: StickyNote, route: '/notes', color: 'from-emerald-600 to-teal-600' },
    { title: 'Code Studio', desc: 'Multi-language debugger & generator', icon: FileCode, route: '/code-assistant', color: 'from-amber-600 to-orange-600' },
    { title: 'Translation Engine', desc: 'Multi-language context preservation', icon: Languages, route: '/translator', color: 'from-cyan-600 to-blue-600' },
    { title: 'AI Image Studio', desc: 'Prompt to visual canvas preview', icon: ImageIcon, route: '/image-generator', color: 'from-rose-600 to-red-600' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#0B0F17] pb-12">
      <Header title="Workspace Overview" />

      <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
        {/* Welcome Hero Banner */}
        <div className="relative rounded-3xl p-8 bg-gradient-to-r from-blue-900/40 via-indigo-900/20 to-purple-900/30 border border-blue-500/20 shadow-2xl overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Enterprise AI Workspace Active</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, Principal Architect
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Accelerate your workflow with multimodal AI assistance powered by Google Gemini 2.5 Flash, PostgreSQL multi-tenancy, and real-time streaming services.
            </p>
            <div className="pt-2 flex items-center space-x-4">
              <button
                onClick={() => navigate('/chat')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-blue-500/30 transition-all"
              >
                <span>Launch AI Chat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#131A27] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Conversations Streamed</span>
              <MessageSquare className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">128</p>
            <span className="text-[10px] text-emerald-400 font-semibold">+18% this week</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#131A27] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Documents Analyzed</span>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">42</p>
            <span className="text-[10px] text-purple-400 font-semibold">1.2M tokens processed</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#131A27] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Active Projects</span>
              <CheckSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">6</p>
            <span className="text-[10px] text-slate-400 font-semibold">14 pending tasks</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#131A27] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Security Isolation</span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white">Active</p>
            <span className="text-[10px] text-cyan-400 font-semibold">Row Level Security (RLS)</span>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white tracking-wide">Workspace AI Suites</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.route}
                  onClick={() => navigate(action.route)}
                  className="group relative p-6 rounded-2xl bg-[#131A27] border border-slate-800/90 hover:border-slate-700 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-2xl space-y-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${action.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{action.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{action.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
