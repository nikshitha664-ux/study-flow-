import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { RichTextEditor } from '../components/notes/RichTextEditor';
import { Note } from '../types';
import { Plus, StickyNote, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Sprint Architecture Notes', content: 'Discussed Gemini 2.5 Flash streaming pipeline and Postgres RLS security policies.', tags: ['sprint', 'architecture'], is_favorite: true, created_at: new Date().toISOString() },
    { id: '2', title: 'Product Vision 2026', content: 'Apple aesthetic layout design system with dark mode glassmorphism.', tags: ['design'], is_favorite: false, created_at: new Date().toISOString() }
  ]);
  const [activeNoteId, setActiveNoteId] = useState<string>('1');

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const handleCreateNote = () => {
    const newNote: Note = {
      id: String(Date.now()),
      title: 'Untitled Note',
      content: '',
      tags: [],
      is_favorite: false,
      created_at: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    toast.success('New note created!');
  };

  const handleSaveNote = (title: string, content: string) => {
    setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, title, content } : n));
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0B0F17]">
      <Header title="Rich Text AI Notes Studio" />

      <div className="flex-1 flex overflow-hidden p-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Notes List Sidebar */}
        <aside className="w-80 bg-[#131A27] border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4">
          <button
            onClick={handleCreateNote}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Note</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  note.id === activeNoteId
                    ? 'bg-blue-600/15 border-blue-500/40 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold truncate">{note.title}</h4>
                  {note.is_favorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{note.content || 'Empty note...'}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Editor Component */}
        <main className="flex-1 h-full">
          {activeNote && (
            <RichTextEditor
              key={activeNote.id}
              initialTitle={activeNote.title}
              initialContent={activeNote.content}
              onSave={handleSaveNote}
            />
          )}
        </main>
      </div>
    </div>
  );
};
