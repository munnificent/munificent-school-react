// src/services/courseService.ts
import axios from 'axios';
import { Course } from '../types'; // Предполагаем, что у вас есть тип Course в src/types/index.ts

const API_BASE_URL = import.meta.env.VITE_API_COURSE_URL || 'http://localhost:3001/api'; // Пример, можно настроить отдельный URL или использовать общий

// Функция для получения токена из localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Добавляем interceptor для добавления токена авторизации в каждый запрос
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const response = await apiClient.get<Course[]>('/courses');
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch courses');
    }
    throw new Error('Failed to fetch courses due to an unexpected error.');
  }
};

export const createCourse = async (courseData: Omit<Course, 'id' | 'teacher'> & { teacherId: number }): Promise<Course> => { // Пример типа для создания
  try {
    const response = await apiClient.post<Course>('/courses', courseData);
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to create course');
    }
    throw new Error('Failed to create course due to an unexpected error.');
  }
};

// TODO: Добавить функции getCourseById, updateCourse, deleteCourse по аналогии