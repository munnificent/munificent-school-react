// --- ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ---
export interface ProfileData {
  photo_url: string | null;
  public_description: string;
  public_subjects: string;
  phone: string;
  school: string;
  student_class: string;
  parent_name: string;
  parent_phone: string;
}

// --- ПОЛЬЗОВАТЕЛЬ ---
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  profile: ProfileData | null;
}

// --- КУРС ---
export interface Course {
  id: number;
  name: string;
  teacher: User; // Используем полный тип User
  progress: number;
  description?: string;
  student_count?: number;
  subject?: number;
}

// --- УРОК ---
export interface Lesson {
  id: number;
  title: string;
  date: string;
  time: string;
  status: 'пройден' | 'предстоит';
  recording_url: string | null; // Явно указываем, что поле называется так
  homework_url: string | null;  // Явно указываем, что поле называется так
}

// --- ПРЕДСТОЯЩИЙ УРОК ---
export interface UpcomingLesson {
  id: number;
  courseName: string;
  teacherName: string;
  date: string;
  time: string;
  zoomLink: string;
}

// --- ОСТАЛЬНЫЕ ТИПЫ (без изменений) ---

export interface Teacher {
  id: number;
  name: string;
  photoUrl: string;
  subjects: string[];
  description: string;
}

export interface Review {
  id: number;
  author: string; 
  text: string;
  scoreInfo: string;
}

export interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex?: number;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author_name: string; 
  created_at: string;
  image_url: string;
  category: number;
  category_name: string;
}

export interface BlogCategory {
    id: number;
    name: string;
    slug: string;
}

export interface CoursePackage {
  id: number;
  name: string;
  description: string;
  features: string[];
  price: number;
  priceUnit: string;
  popular?: boolean;
  subjectCount: number;
  lessonsPerMonth: number;
  additionalFeatures?: string[];
}
