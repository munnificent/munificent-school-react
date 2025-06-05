// src/services/authService.ts
import axios from 'axios';

// Используем одну базовую переменную для URL API из .env
const API_ROOT_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8000/api';
const API_AUTH_PATH = `${API_ROOT_URL}/auth`; // Формируем путь для аутентификации

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    userType: 'student' | 'teacher' | 'admin';
  };
  access?: string;
  refresh?: string;
}

interface UserProfile {
  id: number;
  username: string;
  userType: 'student' | 'teacher' | 'admin';
}

// apiClient лучше вынести в отдельный файл, если он будет использоваться во многих сервисах,
// чтобы не дублировать создание и настройку interceptor'а.
// Пока оставим здесь для простоты примера.
const apiClient = axios.create(); // Базовый URL будет добавляться к каждому запросу ниже

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) { // Добавил проверку config.headers
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(`${API_AUTH_PATH}/login/`, { // Используем apiClient
      username,
      password,
    });
    // Логика сохранения токена остается
    if (response.data.access) {
      localStorage.setItem('authToken', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refreshToken', response.data.refresh);
      }
    } else if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail || error.response.data.message || 'Ошибка входа');
    }
    throw new Error('Не удалось войти из-за непредвиденной ошибки.');
  }
};

export const fetchUserProfile = async (): Promise<UserProfile> => {
  // Токен будет добавлен interceptor'ом
  try {
    const response = await apiClient.get<UserProfile>(`${API_AUTH_PATH}/me/`); // Используем apiClient
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      }
      throw new Error(error.response.data.detail || error.response.data.message || 'Не удалось получить профиль пользователя');
    }
    throw new Error('Не удалось получить профиль пользователя из-за непредвиденной ошибки.');
  }
};