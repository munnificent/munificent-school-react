import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import apiClient from '../api/apiClient';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User | null>; // Изменено
  logout: () => void;
  refetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => null, // Изменено
  logout: () => {},
  refetchUser: async () => {},
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
      setIsLoading(false); // Важно: завершить загрузку, если токена нет
      return;
    }
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const { data } = await apiClient.get<User>('/users/me/');
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch user", error);
      logout();
    } finally {
        setIsLoading(false); // Завершаем загрузку в любом случае
    }
  }, [logout]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (username: string, password: string): Promise<User | null> => {
    try {
      const response = await apiClient.post('/token/', { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Сразу после получения токена запрашиваем данные пользователя
      const { data: userData } = await apiClient.get<User>('/users/me/');
      setUser(userData);
      setIsAuthenticated(true);
      return userData; // Возвращаем пользователя
    } catch (error) {
      console.error("Login failed:", error);
      logout();
      return null; // Возвращаем null в случае ошибки
    }
  };
  
  const contextValue = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    refetchUser: fetchUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);