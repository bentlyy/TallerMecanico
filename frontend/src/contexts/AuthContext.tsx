import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import type { InicioResponse } from '../types';

interface AuthContextType {
  user: InicioResponse['usuario'] | null;
  org: InicioResponse['organizacion'] | null;
  herramientas: InicioResponse['herramientas'];
  loading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<InicioResponse['usuario'] | null>(null);
  const [org, setOrg] = useState<InicioResponse['organizacion'] | null>(null);
  const [herramientas, setHerramientas] = useState<InicioResponse['herramientas']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await api.get<InicioResponse>('/auth/inicio');
        if (cancelled) return;
        setUser(res.data.usuario);
        setOrg(res.data.organizacion);
        setHerramientas(res.data.herramientas);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(() => {
    window.location.href = '/api/auth/login';
  }, []);

  const logout = useCallback(() => {
    window.location.href = '/auth/logout';
  }, []);

  return (
    <AuthContext.Provider value={{ user, org, herramientas, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
