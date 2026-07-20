'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSessionUser, registerUser, loginUser, logoutUser } from './authActions';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'account_staff';
}

export interface Credentials {
  email: string;
  password: string;
  name?: string;
  role?: 'admin' | 'teacher' | 'account_staff';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  // Adjusted signature to support object payload or distinct multi-arguments
  login: (emailOrCredentials: string | Credentials, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (credentials: Credentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

 const mapToUser = (rawUser: Record<string, unknown> | null | undefined): User | null => {
    if (!rawUser) return null;
    return {
      id: Number(rawUser.id),
      email: String(rawUser.email || ''),
      name: String(rawUser.name || ''),
      role: (rawUser.role as User['role']) || 'teacher',
    };
  };


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const currentUser = await getSessionUser();
      setUser(currentUser as User | null);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (emailOrCredentials: string | Credentials, password?: string) => {
    try {
      // Normalize arguments to ensure compatibility with both signature styles
      const payload: Credentials = 
        typeof emailOrCredentials === 'string' 
          ? { email: emailOrCredentials, password: password || '' } 
          : emailOrCredentials;

      const res = await loginUser(payload);
      
      if (res.success && res.user) {
        setUser( mapToUser(res.user));
        return { success: true };
      }
      return { success: false, error: res.error || 'Login failed' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    }
  };

  const signup = async (credentials: Credentials) => {
    try {
      const res = await registerUser(credentials);
      if (res.success && res.user) {
        setUser(mapToUser(res.user));
        return { success: true };
      }
      return { success: false, error: res.error || 'Registration failed' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error during logout execution:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
