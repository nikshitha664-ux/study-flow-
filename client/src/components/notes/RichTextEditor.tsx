import React, { useState } from 'react';
import { Sparkles, Bold, Italic, List, Wand2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface RichTextEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave?: (title: string, content: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialTitle = '', initialContent = '', onSave }) => {
  const [title, setTitle] = useState(initialTitle || 'Untitled Note');
  const [content, setContent] = useState(initialContent);
  const [aiLoading, setAiLoading] = useState(false);
  const { customApiKey } = useAuth();

  const handleSave = () => {
    onSave?.(title, content);
    toast.success('Note auto-saved!');
  };

  const handleAiTransform = async (action: 'summarize' | 'rephrase' | 'expand') => {
    if (!content.trim()) {
      toast.error('Add text to note first!');
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/v1/ai/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Perform this AI transformation on the following note: ${action.toUpperCase()}.\n\nNote text:\n${content}`,
          customApiKey
        })
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let resultText = '';

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
              resultText += parsed.content;
            } catch (e) {}
          }
        }
      }

      if (resultText) {
        setContent(prev => `${prev}\n\n---\n### AI ${action.toUpperCase()} Output:\n${resultText}`);
        toast.success(`AI ${action} completed!`);
      }
    } catch (e) {
      toast.error('AI transformation failed.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#131A27] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Editor Toolbar */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1">
          <button onClick={() => setContent(prev => prev + ' **bold text**')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg" title="Bold">
            <Bold className="w-4 h-4" />
          </button>
          <button onClick={() => setContent(prev => prev + ' *italic text*')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg" title="Italic">
            <Italic className="w-4 h-4" />
          </button>
          <button onClick={() => setContent(prev => prev + '\n- Bullet item')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg" title="List">
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* AI Action Tools */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-semibold uppercase text-slate-500 flex items-center">
            <Sparkles className="w-3 h-3 mr-1 text-blue-400" /> Inline AI
          </span>
          <button
            onClick={() => handleAiTransform('rephrase')}
            disabled={aiLoading}
            className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs hover:bg-blue-600/30 transition-colors flex items-center space-x-1"
          >
            <Wand2 className="w-3 h-3" />
            <span>Rephrase</span>
          </button>
          <button
            onClick={() => handleAiTransform('summarize')}
            disabled={aiLoading}
            className="px-2.5 py-1 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs hover:bg-purple-600/30 transition-colors"
          >
            Summarize
          </button>
          <button
            onClick={() => handleAiTransform('expand')}
            disabled={aiLoading}
            className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs hover:bg-indigo-600/30 transition-colors"
          >
            Expand
          </button>
          <button
            onClick={handleSave}
            className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
            title="Save Note"
          >
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content Inputs */}
      <div className="p-6 flex-1 flex flex-col space-y-4 overflow-y-auto">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title..."
          className="w-full bg-transparent text-xl font-bold text-white placeholder-slate-600 focus:outline-none border-b border-slate-800 pb-2"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your rich notes or AI transformed ideas..."
          className="w-full flex-1 min-h-[300px] bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none resize-none leading-relaxed text-sm"
        />
      </div>
    </div>
  );
};
