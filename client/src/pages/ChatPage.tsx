import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { ChatMessage } from '../components/chat/ChatMessage';
import { Send, Sparkles, FolderPlus, Pin, Plus, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
}

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'assistant', content: 'Hello! I am your AI Workspace Core Engine powered by Gemini 2.5 Flash. How can I assist you with architecture, coding, or productivity today?' }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const { customApiKey } = useAuth();

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { id: String(Date.now()), sender: 'user', content: input };
    const assistantId = String(Date.now() + 1);
    
    setMessages(prev => [...prev, userMessage, { id: assistantId, sender: 'assistant', content: '' }]);
    const currentInput = input;
    setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch('/api/v1/ai/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, customApiKey })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let streamedContent = '';

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '');
            if (dataStr === '[DONE]') break;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.content) {
                streamedContent += parsed.content;
                setMessages(prev =>
                  prev.map(msg => msg.id === assistantId ? { ...msg, content: streamedContent } : msg)
                );
              }
            } catch (err) {}
          }
        }
      }
    } catch (err: any) {
      toast.error('Failed to stream response.');
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0B0F17]">
      <Header title="AI Chat Suite" />

      <div className="flex-1 flex overflow-hidden">
        {/* Chat History & Folders Sidebar */}
        <aside className="w-64 border-r border-slate-800/80 bg-[#0D131F]/70 hidden md:flex flex-col p-4 space-y-4">
          <button 
            onClick={() => setMessages([{ id: String(Date.now()), sender: 'assistant', content: 'New chat initiated. What are we building today?' }])}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase text-slate-500 px-2 tracking-wider">Pinned Threads</p>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between cursor-pointer hover:bg-slate-800">
              <span className="truncate">Q3 Product Architecture</span>
              <Pin className="w-3 h-3 text-blue-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            <p className="text-[10px] font-bold uppercase text-slate-500 px-2 tracking-wider">Recent Chats</p>
            <div className="p-2 rounded-xl text-xs text-slate-400 hover:bg-slate-900 cursor-pointer truncate">
              Express Rate Limiting setup
            </div>
            <div className="p-2 rounded-xl text-xs text-slate-400 hover:bg-slate-900 cursor-pointer truncate">
              Supabase RLS Policy rules
            </div>
          </div>
        </aside>

        {/* Main Streaming Chat Window */}
        <main className="flex-1 flex flex-col h-full bg-[#0B0F17] relative">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
            {messages.map(msg => (
              <ChatMessage key={msg.id} sender={msg.sender} content={msg.content} />
            ))}
            {isStreaming && (
              <div className="flex items-center space-x-2 text-xs text-blue-400 font-medium pl-12 animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span>Gemini 2.5 Flash streaming response...</span>
              </div>
            )}
          </div>

          {/* Prompt Bar Input */}
          <div className="p-4 border-t border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Gemini AI anything (e.g. Generate Express middleware, analyze code)..."
                className="w-full pl-5 pr-14 py-3.5 rounded-2xl bg-[#131A27] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm shadow-xl"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="absolute right-2.5 p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white hover:opacity-90 disabled:opacity-40 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
