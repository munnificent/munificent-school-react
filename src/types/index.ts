// Teacher type
export interface Teacher {
  id: number;
  name: string;
  photoUrl: string;
  subjects: string[];
  description: string;
}

// Review type
export interface Review {
  id: number;
  author: string; 
  text: string;
  scoreInfo: string;
}

// Upcoming lesson type
export interface UpcomingLesson {
  id: number;
  courseName: string;
  teacherName: string;
  date: string;
  time: string;
  zoomLink: string;
}

// Course type
export interface Course {
  id: number;
  name: string;
  teacher: {
    name: string;
    photoUrl: string;
  };
  progress: number;
}

// Lesson type
export interface Lesson {
  id: number;
  title: string;
  date: string;
  status: 'пройден' | 'предстоит';
  recordingUrl?: string;
  homeworkUrl?: string;
}

// Test question type
export interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex?: number; // For result calculation
}


// Blog post type
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author_name: string; // Поле из сериализатора
  created_at: string;  // Django отдает дату как строку в формате ISO
  image_url: string;
  category: number; // ID категории
  category_name: string; // Имя категории из сериализатора
}

// Тип для категорий блога
export interface BlogCategory {
    id: number;
    name: string;
    slug: string;
}


// User type for authentication
export interface User {
  username: string;
  role: 'student' | 'teacher' | 'admin';
  name: string;
  photoUrl?: string;
}

// Course package type
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