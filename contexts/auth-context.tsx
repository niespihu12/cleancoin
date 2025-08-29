'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';
import { User, LoginRequest, RegisterRequest } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  isAuthenticated: boolean;
  refreshUser?: () => Promise<void>;
  setUserState?: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar si el usuario está autenticado al cargar la app
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('cleanpoint_token');
        if (token) {
          // Aquí podrías validar el token con el backend
          // Por ahora, solo verificamos que existe
          const userData = localStorage.getItem('cleanpoint_user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        localStorage.removeItem('cleanpoint_token');
        localStorage.removeItem('cleanpoint_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.login(credentials);
      
      // Guardar token y datos del usuario
      apiClient.setAuthToken(response.token);
      localStorage.setItem('cleanpoint_user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.register(userData);
      
      // Guardar token y datos del usuario
      apiClient.setAuthToken(response.token);
      localStorage.setItem('cleanpoint_user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrarse';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar estado local
      apiClient.removeAuthToken();
      localStorage.removeItem('cleanpoint_user');
      setUser(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const refreshUser = async () => {
    try {
      if (!user) return;
      const updated = await apiClient.getUserProfile(user.id);
      setUser(updated);
      localStorage.setItem('cleanpoint_user', JSON.stringify(updated));
    } catch (error) {
      console.error('Error refrescando usuario:', error);
    }
  };

  const setUserState = (u: User | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem('cleanpoint_user', JSON.stringify(u));
      else localStorage.removeItem('cleanpoint_user');
    } catch (e) {
      // ignore
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  refreshUser,
  setUserState,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
