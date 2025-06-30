// src/types/index.ts

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'teacher' | 'admin';
  phone?: string;
  avatar?: string;
  is_active?: boolean;
  last_login?: string;
}

// Детали преподавателя, вложенные в курс
export interface TeacherDetails {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  subject: string;
  price: number;
  teacher: number; // ID преподавателя
  teacher_details?: TeacherDetails;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  course: number;
}