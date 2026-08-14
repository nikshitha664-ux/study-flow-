import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  FileCode, 
  Languages, 
  Image as ImageIcon, 
  CheckSquare, 
  StickyNote, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Chat', path: '/chat', icon: MessageSquare },
    { label: 'Documents Assistant', path: '/documents', icon: FileText },
    { label: 'Rich Text Notes', path: '/notes', icon: StickyNote },
    { label: 'Code Studio', path: '/code-assistant', icon: FileCode },
    { label: 'Translator Engine', path: '/translator', icon: Languages },
    { label: 'Image Studio', path: '/image-generator', icon: ImageIcon },
    { label: 'Projects & Tasks', path: '/projects', icon: CheckSquare },
    { label: 'Settings & API Keys', path: '/settings', icon: Settings },
  ];

  return (
    <aside 
      className={`relative flex flex-col h-screen border-r transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      } bg-[#0D131F]/90 backdrop-blur-xl border-slate-800/80 text-slate-300`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/60">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-blue-300 tracking-wide">
              AI Workspace
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-blue-600 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                } ${collapsed ? 'justify-center' : 'space-x-3.5'}`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-slate-800/60 space-y-2">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center space-x-3">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            {!collapsed && <span>Theme Mode</span>}
          </div>
          {!collapsed && (
            <span className="text-xs uppercase font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md">
              {theme}
            </span>
          )}
        </button>

        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-2 rounded-xl bg-slate-900/60 border border-slate-800/50`}>
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.full_name || 'Alex Mercer'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'architect@aiworkspace.com'}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button 
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
