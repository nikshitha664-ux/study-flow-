import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import aiRoutes from './routes/ai.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiters
const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI processing rate limit exceeded. Please wait a minute.' }
});

app.use('/api/v1/', standardLimiter);
app.use('/api/v1/ai', aiLimiter);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AI Workspace Express Core'
  });
});

// Routes
app.use('/api/v1/ai', aiRoutes);

// In-Memory Data Store Fallback for CRUD endpoints when live Supabase is offline
const mockStore = {
  chats: [
    { id: '1', title: 'Q3 Product Strategy Breakdown', created_at: new Date().toISOString(), is_pinned: true },
    { id: '2', title: 'React 18 Architecture Review', created_at: new Date().toISOString(), is_pinned: false }
  ],
  notes: [
    { id: '1', title: 'Sprint Planning Notes', content: 'Discussed architectural modularity and Gemini streaming SSE integration.', tags: ['work', 'sprint'], is_favorite: true, created_at: new Date().toISOString() },
    { id: '2', title: 'Product Vision 2026', content: 'Apple aesthetic inspired clean workspace with Linear task workflows.', tags: ['ideas'], is_favorite: false, created_at: new Date().toISOString() }
  ],
  projects: [
    { id: '1', title: 'AI Workspace V1 Release', description: 'Enterprise ready full-stack productivity launch', status: 'active', color: '#10B981', created_at: new Date().toISOString() },
    { id: '2', title: 'Mobile App Companion', description: 'React Native companion app research', status: 'active', color: '#3B82F6', created_at: new Date().toISOString() }
  ],
  tasks: [
    { id: 't1', project_id: '1', title: 'Implement SSE Chat Stream', description: 'Connect Gemini 3.6 Flash streaming endpoint', status: 'done', priority: 'high', created_at: new Date().toISOString() },
    { id: 't2', project_id: '1', title: 'Design Glassmorphism Sidebar', description: 'Subtle hover states and dark mode tokens', status: 'in_progress', priority: 'urgent', created_at: new Date().toISOString() },
    { id: 't3', project_id: '1', title: 'PDF Quiz Generator Engine', description: 'Parse text into JSON structured schema', status: 'review', priority: 'medium', created_at: new Date().toISOString() }
  ]
};

// CRUD Routes
app.get('/api/v1/chats', (req, res) => res.json(mockStore.chats));
app.post('/api/v1/chats', (req, res) => {
  const newChat = { id: String(Date.now()), title: req.body.title || 'New Conversation', created_at: new Date().toISOString(), is_pinned: false };
  mockStore.chats.unshift(newChat);
  res.status(201).json(newChat);
});

app.get('/api/v1/notes', (req, res) => res.json(mockStore.notes));
app.post('/api/v1/notes', (req, res) => {
  const newNote = { id: String(Date.now()), title: req.body.title || 'Untitled Note', content: req.body.content || '', tags: req.body.tags || [], is_favorite: false, created_at: new Date().toISOString() };
  mockStore.notes.unshift(newNote);
  res.status(201).json(newNote);
});
app.put('/api/v1/notes/:id', (req, res) => {
  const noteIndex = mockStore.notes.findIndex(n => n.id === req.params.id);
  if (noteIndex !== -1) {
    mockStore.notes[noteIndex] = { ...mockStore.notes[noteIndex], ...req.body };
    return res.json(mockStore.notes[noteIndex]);
  }
  res.status(404).json({ error: 'Note not found' });
});

app.get('/api/v1/projects', (req, res) => res.json(mockStore.projects));
app.post('/api/v1/projects', (req, res) => {
  const newProj = { id: String(Date.now()), title: req.body.title, description: req.body.description || '', status: 'active', color: req.body.color || '#10B981', created_at: new Date().toISOString() };
  mockStore.projects.unshift(newProj);
  res.status(201).json(newProj);
});

app.get('/api/v1/projects/:id/tasks', (req, res) => {
  const tasks = mockStore.tasks.filter(t => t.project_id === req.params.id);
  res.json(tasks);
});

app.post('/api/v1/tasks', (req, res) => {
  const newTask = { id: String(Date.now()), project_id: req.body.projectId, title: req.body.title, description: req.body.description || '', status: 'todo', priority: req.body.priority || 'medium', created_at: new Date().toISOString() };
  mockStore.tasks.unshift(newTask);
  res.status(201).json(newTask);
});

app.patch('/api/v1/tasks/:id', (req, res) => {
  const taskIndex = mockStore.tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex !== -1) {
    mockStore.tasks[taskIndex] = { ...mockStore.tasks[taskIndex], ...req.body };
    return res.json(mockStore.tasks[taskIndex]);
  }
  res.status(404).json({ error: 'Task not found' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Workspace Backend running on http://localhost:${PORT}`);
});
