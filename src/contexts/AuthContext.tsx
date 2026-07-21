'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionUser, loginUser, logoutUser, registerUser } from '@/lib/db/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { fullName?: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSessionUser();
        if (session && session.id && session.email) {
          setUser({
            id: session.id,
            email: session.email,
            name: "Staff",
            role: session.role,
          });
        }
      } catch {
        // Silent fail on auth check
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await loginUser({ email, password });
      if (result.success && result.user) {
        setUser({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name || "Staff",
          role: result.user.role,
        });
        return { success: true };
      }
      return { success: false, error: result.error || "Login failed" };
    } catch (err: any) {
      return { success: false, error: err?.message || "Network error" };
    }
  };

  const register = async (data: { fullName?: string; email: string; password: string }) => {
    try {
      const result = await registerUser({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: "staff",
      });
      if (result.success && result.user) {
        setUser({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name || "Staff",
          role: result.user.role,
        });
        return { success: true };
      }
      return { success: false, error: result.error || "Registration failed" };
    } catch (err: any) {
      return { success: false, error: err?.message || "Network error" };
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    router.push('/staff/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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