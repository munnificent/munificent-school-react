import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Card, CardBody, Button, Divider, Chip, Avatar, Spinner, Progress } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import apiClient from '../api/apiClient';
import { Course, Lesson } from '../types';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [courseResponse, lessonsResponse] = await Promise.all([
          apiClient.get<Course>(`/courses/my/${id}/`),
          apiClient.get<Lesson[]>(`/courses/my/${id}/lessons/`)
        ]);

        setCourse(courseResponse.data);
        setLessons(lessonsResponse.data);

      } catch (err) {
        console.error("Failed to fetch course details:", err);
        setError("Не удалось загрузить данные курса. Возможно, он не существует или у вас нет к нему доступа.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourseData();
  }, [id]);
  
  const handleGoBack = () => {
    history.push('/my-courses');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" label="Загрузка данных о курсе..." />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Icon icon="lucide:book-x" width={48} height={48} className="text-foreground-400 mb-4" />
        <h2 className="text-xl font-semibold">Курс не найден</h2>
        <p className="text-foreground-500 mt-2">{error}</p>
        <Button onPress={handleGoBack} color="primary" variant="flat" className="mt-4">
          Вернуться к моим курсам
        </Button>
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
        <div className="flex items-center gap-2">
          <Button isIconOnly variant="light" aria-label="Go back" onPress={handleGoBack}>
            <Icon icon="lucide:arrow-left" width={20} height={20} />
          </Button>
          <h1 className="text-3xl font-bold">{course.name}</h1>
        </div>
        
        <div className="mt-4 flex items-center gap-4">
          <Avatar src={course.teacher.profile?.photo_url || ''} name={`${course.teacher.first_name} ${course.teacher.last_name}`} size="md" />
          <div>
            <p className="font-medium">Преподаватель: {course.teacher.first_name} {course.teacher.last_name}</p>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                <Icon icon="lucide:book-open" width={16} height={16} className="text-foreground-500 mr-1" />
                <span className="text-sm text-foreground-500">{lessons.length} уроков</span>
              </div>
              <Divider orientation="vertical" className="h-4 mx-2" />
              <div className="flex items-center">
                <Icon icon="lucide:check-circle" width={16} height={16} className="text-foreground-500 mr-1" />
                <span className="text-sm text-foreground-500">
                  {lessons.filter(l => l.status === 'пройден').length} завершено
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Прогресс курса</h2>
            <Chip color={course.progress >= 75 ? 'success' : 'primary'} variant="flat" radius="sm">
              {course.progress}% завершено
            </Chip>
          </div>
          <Progress 
            value={course.progress} 
            className="h-3"
            color={course.progress >= 75 ? 'success' : 'primary'}
          />
        </CardBody>
      </Card>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Список уроков</h2>
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card>
                <CardBody className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${lesson.status === 'пройден' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                        <Icon icon={lesson.status === 'пройден' ? 'lucide:check' : 'lucide:calendar'} width={20} height={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-foreground-500">Дата: {new Date(lesson.date).toLocaleDateString('ru-RU')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-auto">
                      {/* ИСПРАВЛЕНО: используем recording_url и homework_url */}
                      <Button as="a" href={lesson.recording_url || '#'} target="_blank" size="sm" variant="flat" color="primary" startContent={<Icon icon="lucide:video" width={16} height={16} />} isDisabled={!lesson.recording_url}>Смотреть запись</Button>
                      <Button as="a" href={lesson.homework_url || '#'} target="_blank" size="sm" variant="flat" color="primary" startContent={<Icon icon="lucide:download" width={16} height={16} />} isDisabled={!lesson.homework_url}>Скачать ДЗ</Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseDetail;
