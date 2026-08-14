import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Sidebar } from './components/layout/Sidebar';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { NotesPage } from './pages/NotesPage';
import { CodeAssistantPage } from './pages/CodeAssistantPage';
import { TranslatorPage } from './pages/TranslatorPage';
import { ImageGenPage } from './pages/ImageGenPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F17]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{ style: { background: '#131A27', color: '#fff', border: '1px solid #1E293B' } }} />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/forgot-password" element={<LoginPage />} />

            <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
            <Route path="/chat" element={<ProtectedLayout><ChatPage /></ProtectedLayout>} />
            <Route path="/chat/:id" element={<ProtectedLayout><ChatPage /></ProtectedLayout>} />
            <Route path="/documents" element={<ProtectedLayout><DocumentsPage /></ProtectedLayout>} />
            <Route path="/notes" element={<ProtectedLayout><NotesPage /></ProtectedLayout>} />
            <Route path="/code-assistant" element={<ProtectedLayout><CodeAssistantPage /></ProtectedLayout>} />
            <Route path="/translator" element={<ProtectedLayout><TranslatorPage /></ProtectedLayout>} />
            <Route path="/image-generator" element={<ProtectedLayout><ImageGenPage /></ProtectedLayout>} />
            <Route path="/projects" element={<ProtectedLayout><ProjectsPage /></ProtectedLayout>} />
            <Route path="/projects/:id" element={<ProtectedLayout><ProjectsPage /></ProtectedLayout>} />
            <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
