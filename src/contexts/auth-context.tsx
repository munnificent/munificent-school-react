import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import apiClient from '../api/apiClient';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refetchUser: () => Promise<void>; // Новая функция
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  refetchUser: async () => {}, // Пустая функция по умолчанию
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete apiClient.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      logout();
      return;
    }
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const { data } = await apiClient.get('/users/me/');
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch user", error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      await fetchUser();
      setIsLoading(false);
    };
    checkAuthStatus();
  }, [fetchUser]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/token/', { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      await fetchUser();
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      logout();
      setIsLoading(false);
      return false;
    }
  };
  
  const contextValue = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    refetchUser: fetchUser // Передаем функцию fetchUser как refetchUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
