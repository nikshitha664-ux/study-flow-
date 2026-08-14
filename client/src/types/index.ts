export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  theme_preference: 'light' | 'dark' | 'system';
  custom_gemini_api_key?: string;
}

export interface Chat {
  id: string;
  folder_id?: string;
  title: string;
  is_pinned: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'archived' | 'completed';
  color: string;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  created_at: string;
}

export interface QuizQuestion {
  questionId: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizData {
  quizTitle: string;
  questions: QuizQuestion[];
}
