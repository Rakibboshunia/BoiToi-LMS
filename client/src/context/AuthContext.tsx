import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  isActive: boolean;
  isApproved?: boolean; // for teachers
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        // Optionally fetch fresh user data from /api/auth/me here
        try {
           const res = await api.get('/auth/me');
           if (res.data.success) {
               setUser(res.data.data);
               localStorage.setItem('user', JSON.stringify(res.data.data));
           }
        } catch (error) {
           console.error("Failed to fetch fresh user data");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data.success) {
      const { accessToken, refreshToken, user: userData } = res.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    }
    return res.data;
  };

  const register = async (userData: any) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { accessToken, refreshToken, user: newUser } = res.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
    }
    return res.data;
  };

  const logout = () => {
    // Fire & forget logout to invalidate refresh token on server
    api.post('/auth/logout').catch(() => {});
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
