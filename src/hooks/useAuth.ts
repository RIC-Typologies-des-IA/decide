'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, UserSession, LoginData, RegisterData } from '@/lib/api-client';

interface UseAuthReturn {
  user: UserSession | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.me();
      if (response.success && response.session) {
        setUser(response.session);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (data: LoginData): Promise<boolean> => {
    setError(null);
    try {
      const response = await api.login(data);
      if (response.success && response.session) {
        setUser(response.session);
        return true;
      } else {
        setError(response.error || 'Échec de la connexion');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await api.logout();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setError(null);
    try {
      const response = await api.register(data);
      if (response.success && response.session) {
        setUser(response.session);
        return true;
      } else {
        setError(response.error || "Échec de l'inscription");
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    refreshUser,
  };
}

export default useAuth;
