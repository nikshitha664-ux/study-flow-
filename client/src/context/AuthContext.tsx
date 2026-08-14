import React, { createContext, useContext, useState } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('user_session');
    return saved ? JSON.parse(saved) : { id: 'demo-user-id', email: 'architect@aiworkspace.com', full_name: 'Alex Mercer', theme_preference: 'dark' };
  });

  const [customApiKey, setCustomApiKeyState] = useState<string>(() => {
    return localStorage.getItem('gemini_custom_key') || '';
  });

  const setCustomApiKey = (key: string) => {
    setCustomApiKeyState(key);
    localStorage.setItem('gemini_custom_key', key);
  };

  const login = (email: string) => {
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      email,
      full_name: email.split('@')[0],
      theme_preference: 'dark'
    };
    setUser(newUser);
    localStorage.setItem('user_session', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
  };

  return (
    <AuthContext.Provider value={{ user, customApiKey, setCustomApiKey, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
