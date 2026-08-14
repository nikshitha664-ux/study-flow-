import React, { useState } from 'react';
import { Task } from '../../types';
import { Plus, Clock, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onAddTask: (title: string, priority: Task['priority']) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskStatusChange, onAddTask }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');

  const columns: { id: Task['status']; label: string; color: string }[] = [
    { id: 'todo', label: 'To Do', color: 'border-slate-700' },
    { id: 'in_progress', label: 'In Progress', color: 'border-blue-500' },
    { id: 'review', label: 'Review', color: 'border-purple-500' },
    { id: 'done', label: 'Completed', color: 'border-emerald-500' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle, newPriority);
    setNewTitle('');
    toast.success('Task created!');
  };

  const getPriorityBadge = (p: Task['priority']) => {
    switch (p) {
      case 'urgent': return <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Urgent</span>;
      case 'high': return <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">High</span>;
      case 'medium': return <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Medium</span>;
      default: return <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-400">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Task Input Form */}
      <form onSubmit={handleCreate} className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-[#131A27] border border-slate-800">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new project task..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as Task['priority'])}
          className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
          <option value="urgent">Urgent</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="bg-[#131A27] border border-slate-800/80 rounded-2xl p-4 flex flex-col min-h-[400px]">
              <div className={`flex items-center justify-between pb-3 border-b-2 ${col.color} mb-4`}>
                <h3 className="text-sm font-bold text-white tracking-wide">{col.label}</h3>
                <span className="w-5 h-5 rounded-full bg-slate-800 text-xs font-semibold text-slate-400 flex items-center justify-center">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {colTasks.map((t) => (
                  <div key={t.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2 group shadow-sm">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold text-slate-200 leading-snug">{t.title}</p>
                      {getPriorityBadge(t.priority)}
                    </div>
                    <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500 border-t border-slate-800/60">
                      <span>Status</span>
                      <select
                        value={t.status}
                        onChange={(e) => onTaskStatusChange(t.id, e.target.value as Task['status'])}
                        className="bg-slate-950 text-slate-300 text-[10px] rounded px-1 py-0.5 border border-slate-800 focus:outline-none"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
