import React, { useState, useEffect } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { Card, CardBody, Progress, Link, Spinner, Avatar } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import apiClient from '../api/apiClient';
import { Course } from '../types';

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
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
        <Spinner label="Загрузка ваших курсов..." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Мои курсы</h1>
        <p className="text-foreground-500 mt-2">
          Здесь собраны все твои курсы и прогресс по ним.
        </p>
      </div>
      
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Link 
                as={RouteLink} 
                to={`/my-courses/${course.id}`}
                className="block h-full"
              >
                <Card 
                  isPressable 
                  isHoverable 
                  className="h-full transition-transform duration-300 hover:scale-[1.01]"
                >
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">{course.name}</h2>
                        <div className="flex items-center mt-1 gap-2">
                          {/* ИСПРАВЛЕНО: используем правильные поля */}
                          <Avatar 
                            src={course.teacher.profile?.photo_url || ''} 
                            name={`${course.teacher.first_name} ${course.teacher.last_name}`}
                            size="sm"
                          />
                          <span className="text-sm text-foreground-500">{`${course.teacher.first_name} ${course.teacher.last_name}`}</span>
                        </div>
                      </div>
                      <div className={`p-2 rounded-full ${course.progress >= 75 ? 'bg-success/10' : 'bg-primary/10'}`}>
                        <Icon 
                          icon={course.progress >= 75 ? "lucide:check-circle" : "lucide:book"} 
                          width={20} 
                          height={20}
                          className={course.progress >= 75 ? 'text-success' : 'text-primary'}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground-500">Прогресс:</span>
                        <span className={`text-sm font-medium ${
                          course.progress >= 75 ? 'text-success' : 'text-primary'
                        }`}>{course.progress}%</span>
                      </div>
                      <Progress 
                        value={course.progress} 
                        className="h-2"
                        color={course.progress >= 75 ? 'success' : 'primary'}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
          <Card>
            <CardBody className="p-8 text-center text-foreground-500">
               <Icon icon="lucide:book-x" className="mx-auto mb-2" width={40} height={40} />
               <h3 className="text-lg font-semibold text-foreground">У вас пока нет курсов</h3>
               <p className="mt-1">Вы еще не записаны ни на один курс. Вы можете посмотреть доступные курсы в каталоге.</p>
            </CardBody>
          </Card>
      )}
    </motion.div>
  );
};

export default MyCourses;

