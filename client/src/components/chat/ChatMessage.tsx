import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Sparkles, User, Bot } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatMessageProps {
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ sender, content }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = sender === 'user';

  return (
    <div className={`flex items-start space-x-3.5 my-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
        isUser 
          ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white' 
          : 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 text-white'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content Bubble */}
      <div className={`relative max-w-3xl rounded-2xl px-4 py-3.5 text-sm leading-relaxed border ${
        isUser 
          ? 'bg-blue-600/20 text-blue-100 border-blue-500/30 rounded-tr-none' 
          : 'bg-[#131A27] text-slate-200 border-slate-800/90 rounded-tl-none shadow-xl'
      }`}>
        {!isUser && (
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
            <div className="flex items-center space-x-1.5 text-xs text-blue-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Workspace Assistant</span>
            </div>
            <button
              onClick={copyToClipboard}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Copy message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        <div className="prose prose-invert max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-p:my-1 prose-headings:my-2">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
