import React, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import apiClient from '../api/apiClient';
import { User } from '../types';

// --- Хелперы для управления токенами ---
const tokenService = {
  get: () => localStorage.getItem('accessToken'),
  set: (access: string, refresh: string) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  },
  clear: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// --- Типы и начальное состояние ---
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const INITIAL_STATE: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

// --- Контекст ---
export const AuthContext = createContext<AuthContextType>({
  ...INITIAL_STATE,
  login: async () => null,
  logout: () => {},
  refetchUser: async () => {},
});

// --- Провайдер ---
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(INITIAL_STATE);

  const setAuthorizationHeader = (token: string | null) => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  };

  const logout = useCallback(() => {
    tokenService.clear();
    setAuthorizationHeader(null);
    setAuthState({ ...INITIAL_STATE, isLoading: false });
  }, []);

  const fetchUser = useCallback(async () => {
    const token = tokenService.get();
    if (!token) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return;
    }
    setAuthorizationHeader(token);
    try {
      const { data } = await apiClient.get<User>('/users/me/');
      setAuthState({ isAuthenticated: true, user: data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch user", error);
      logout(); // Если токен невалиден, выходим из системы
    }
  }, [logout]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (username: string, password: string): Promise<User | null> => {
    try {
      const { data: tokenData } = await apiClient.post('/token/', { username, password });
      tokenService.set(tokenData.access, tokenData.refresh);
      setAuthorizationHeader(tokenData.access);
      
      const { data: userData } = await apiClient.get<User>('/users/me/');
      setAuthState({ isAuthenticated: true, user: userData, isLoading: false });
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      logout();
      return null;
    }
  };
  
  const contextValue = useMemo(() => ({
    ...authState,
    login,
    logout,
    refetchUser: fetchUser,
  }), [authState, logout, fetchUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);