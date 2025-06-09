// src/contexts/auth-context.tsx

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import apiClient from '../api/apiClient';
import { User } from '../types'; // Импортируем обновленный тип User

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Контекст с обновленным типом
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {}
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // Теперь храним всего пользователя, а не только его тип
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Функция для получения данных пользователя
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/users/me/');
      setUser(data);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error("Failed to fetch user", error);
      // Если не удалось получить юзера (например, токен истек), выходим из системы
      logout();
      return null;
    }
  }, []);

  // Проверка токена при загрузке приложения
  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        // Устанавливаем заголовок для последующих запросов
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        await fetchUser();
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, [fetchUser]);

  // Функция входа в систему
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/token/', { username, password });
      
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Устанавливаем заголовок для последующих запросов
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Получаем данные пользователя
      await fetchUser();
      
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      // Очищаем в случае ошибки
      logout();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция выхода
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete apiClient.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };
  
  const contextValue = {
    isAuthenticated,
    user, // Передаем всего пользователя
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста
export const useAuth = () => useContext(AuthContext);