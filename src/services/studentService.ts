// src/services/studentService.ts
import axios from 'axios';
import { UpcomingLesson } from '../types'; // Убедитесь, что тип UpcomingLesson существует в src/types/index.ts и актуален

// Определяем базовый URL для API.
// VITE_APP_API_BASE_URL должен указывать на корень вашего API,
// например, http://127.0.0.1:8000/api (без /auth или /student на конце)
// Если такой переменной нет, будет использован fallback.
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor для добавления токена авторизации в каждый запрос
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерфейс для данных, которые мы ожидаем от эндпоинта дашборда студента
export interface StudentDashboardData {
  upcoming_lessons: UpcomingLesson[];
  ent_progress_summary: string;
  // вы можете добавить сюда другие поля, если ваш API их возвращает
}

export const getStudentDashboardData = async (): Promise<StudentDashboardData> => {
  try {
    // Путь к эндпоинту теперь относительно API_BASE_URL
    const response = await apiClient.get<StudentDashboardData>('/student/dashboard-data/');
    console.log('studentService response.data:', response.data); // Для отладки
    return response.data;
  } catch (error) {
    console.error("Error fetching student dashboard data in service:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Axios error response in studentService:", error.response.data);
      throw new Error(error.response.data.message || error.response.data.detail || 'Failed to fetch student dashboard data');
    }
    throw new Error('Failed to fetch student dashboard data due to an unexpected error.');
  }
};