// src/contexts/auth-context.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { loginUser, fetchUserProfile } from '../services/authService'; // Импортируем наши сервисы

export type UserRole = 'student' | 'teacher' | 'admin';

interface User {
  id: number; // или string
  username: string;
  userType: UserRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('authToken'); // Проверяем, есть ли токен вообще
      if (storedToken) { // Если токен есть, пытаемся его валидировать, запросив профиль
        try {
          // fetchUserProfile сам возьмет токен из localStorage через interceptor
          const userProfile = await fetchUserProfile(); // <--- ИЗМЕНЕНО ЗДЕСЬ
          setUser(userProfile);
        } catch (error) {
          console.error("Невалидный или просроченный токен при проверке:", error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken'); // Также удаляем refresh токен, если есть
          setUser(null); // Сбрасываем пользователя, так как токен невалиден
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);
// ...

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { token, user: loggedInUser } = await loginUser(username, password);
      localStorage.setItem('authToken', token);
      setUser(loggedInUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Ошибка входа:", error);
      localStorage.removeItem('authToken');
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const isAuthenticated = !!user;

  const contextValue = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);