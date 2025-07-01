import React, { useState, useEffect } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { Card, CardBody, Progress, Link, Spinner, Avatar } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import apiClient from '../api/apiClient';
import { Course } from '../types';

// --- Константы и типы ---
const CONTENT = {
  title: 'Мои курсы',
  subtitle: 'Здесь собраны все твои курсы и прогресс по ним.',
  loading: 'Загрузка ваших курсов...',
  noCoursesTitle: 'У вас пока нет курсов',
  noCoursesSubtitle: 'Вы еще не записаны ни на один курс. Вы можете посмотреть доступные курсы в каталоге.',
  progressLabel: 'Прогресс:',
};

// --- Компоненты ---

const PageHeader: React.FC = () => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold">{CONTENT.title}</h1>
    <p className="text-foreground-500 mt-2">{CONTENT.subtitle}</p>
  </div>
);

const CourseCard: React.FC<{ course: Course, index: number }> = ({ course, index }) => {
  const teacher = course.teacher_details;
  const progress = course.progress || 0; // На случай если прогресс не придет
  const isCompleted = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link as={RouteLink} to={`/app/my-courses/${course.id}`} className="block h-full">
        <Card isPressable isHoverable className="h-full transition-transform duration-300 hover:scale-[1.01]">
          <CardBody className="p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{course.title}</h2>
                {teacher && (
                  <div className="flex items-center mt-1 gap-2">
                    <Avatar 
                      src={teacher.avatar || ''} 
                      name={`${teacher.first_name} ${teacher.last_name}`}
                      size="sm"
                    />
                    <span className="text-sm text-foreground-500">{`${teacher.first_name} ${teacher.last_name}`}</span>
                  </div>
                )}
              </div>
              <div className={`p-2 rounded-full ${isCompleted ? 'bg-success/10' : 'bg-primary/10'}`}>
                <Icon 
                  icon={isCompleted ? "lucide:check-circle" : "lucide:book"} 
                  width={20} 
                  height={20}
                  className={isCompleted ? 'text-success' : 'text-primary'}
                />
              </div>
            </div>
            
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground-500">{CONTENT.progressLabel}</span>
                <span className={`text-sm font-medium ${isCompleted ? 'text-success' : 'text-primary'}`}>{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                size="sm"
                color={isCompleted ? 'success' : 'primary'}
              />
            </div>
          </CardBody>
        </Card>
      </Link>
    </motion.div>
  );
};

const NoCoursesMessage: React.FC = () => (
    <Card>
      <CardBody className="p-8 text-center text-foreground-500">
         <Icon icon="lucide:book-x" className="mx-auto mb-2" width={40} height={40} />
         <h3 className="text-lg font-semibold text-foreground">{CONTENT.noCoursesTitle}</h3>
         <p className="mt-1">{CONTENT.noCoursesSubtitle}</p>
      </CardBody>
    </Card>
);

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<Course[]>('/courses/my/');
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner label={CONTENT.loading} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader />
      
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      ) : (
        <NoCoursesMessage />
      )}
    </motion.div>
  );
};

export default MyCourses;