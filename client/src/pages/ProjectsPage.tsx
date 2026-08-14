import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { KanbanBoard } from '../components/projects/KanbanBoard';
import { Task, Project } from '../types';
import { Plus, CheckSquare, Calendar, FolderPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', title: 'AI Workspace V1 Release', description: 'Enterprise production full-stack release', status: 'active', color: '#10B981', created_at: new Date().toISOString() },
    { id: '2', title: 'Gemini 2.5 Multi-Modal Upgrade', description: 'Audio and vision streaming enhancement', status: 'active', color: '#3B82F6', created_at: new Date().toISOString() }
  ]);
  const [activeProjectId, setActiveProjectId] = useState<string>('1');

  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', project_id: '1', title: 'Setup Express SSE Endpoint', status: 'done', priority: 'high', created_at: new Date().toISOString() },
    { id: 't2', project_id: '1', title: 'Implement Tailwind Dark Theme Tokens', status: 'in_progress', priority: 'urgent', created_at: new Date().toISOString() },
    { id: 't3', project_id: '1', title: 'PDF Quiz Generator Engine', status: 'review', priority: 'medium', created_at: new Date().toISOString() }
  ]);

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    toast.success('Task status updated!');
  };

  const handleAddTask = (title: string, priority: Task['priority']) => {
    const newTask: Task = {
      id: String(Date.now()),
      project_id: activeProjectId,
      title,
      status: 'todo',
      priority,
      created_at: new Date().toISOString()
    };
    setTasks([newTask, ...tasks]);
  };

  const handleCreateProject = () => {
    const title = prompt('Enter project title:');
    if (!title) return;
    const newProj: Project = {
      id: String(Date.now()),
      title,
      status: 'active',
      color: '#3B82F6',
      created_at: new Date().toISOString()
    };
    setProjects([newProj, ...projects]);
    setActiveProjectId(newProj.id);
    toast.success('New project created!');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#0B0F17] pb-12">
      <Header title="Projects & Kanban Task Management" />

      <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
        {/* Project Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3 overflow-x-auto py-1">
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setActiveProjectId(proj.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
                  proj.id === activeProjectId
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm'
                    : 'bg-[#131A27] text-slate-400 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: proj.color }} />
                <span>{proj.title}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCreateProject}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Project Workspace</span>
          </button>
        </div>

        {/* Interactive Kanban Board */}
        <KanbanBoard
          tasks={tasks.filter(t => t.project_id === activeProjectId)}
          onTaskStatusChange={handleTaskStatusChange}
          onAddTask={handleAddTask}
        />
      </main>
    </div>
  );
};
