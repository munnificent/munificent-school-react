import React, { useState, useEffect } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { Card, CardBody, Button, Link, Divider, Spinner, Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/auth-context';
import apiClient from '../api/apiClient';
import { UpcomingLesson } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<UpcomingLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingLessons = async () => {
      try {
        const response = await apiClient.get<UpcomingLesson[]>('/courses/upcoming-lessons/');
        setLessons(response.data);
      } catch (error) {
        console.error("Failed to fetch upcoming lessons:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpcomingLessons();
  }, []);

  const formatDate = (dateString: string) => {
    const lessonDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (lessonDate.toDateString() === today.toDateString()) return "Сегодня";
    if (lessonDate.toDateString() === tomorrow.toDateString()) return "Завтра";
    return lessonDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  const isLessonActive = (lesson: UpcomingLesson): boolean => {
    const now = new Date();
    // Собираем полную дату и время урока
    const lessonDateTime = new Date(`${lesson.date}T${lesson.time}`);
    // Урок считается активным, если он еще не прошел
    return lessonDateTime >= now;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Привет, {user?.first_name || user?.username}!</h1>
        <p className="text-foreground-500 mt-2">Добро пожаловать в твой личный кабинет.</p>
      </div>
      
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Ближайшие занятия</h2>
          <Link as={RouteLink} to="/my-courses" color="primary"><div className="flex items-center gap-1"><span>Все курсы</span><Icon icon="lucide:chevron-right" width={16} height={16} /></div></Link>
        </div>
        
        {isLoading ? <div className="flex justify-center items-center h-40"><Spinner label="Загрузка занятий..." /></div>
        : lessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {lessons.map((lesson, index) => {
              const isActive = isLessonActive(lesson);
              return (
                <motion.div key={lesson.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.4 }}>
                  <Card>
                    <CardBody className="p-4">
                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between gap-4">
                          <div><h3 className="font-semibold text-lg">{lesson.courseName}</h3><p className="text-foreground-500">с {lesson.teacherName}</p></div>
                          <Chip color={formatDate(lesson.date) === 'Сегодня' ? 'success' : 'primary'} variant="flat">{formatDate(lesson.date)}</Chip>
                        </div>
                        <Divider className="my-3" />
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2"><Icon icon="lucide:clock" width={16} height={16} className="text-foreground-500" /><span>{new Date(`1970-01-01T${lesson.time}`).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span></div>
                          <Button as="a" href={lesson.zoomLink} target="_blank" rel="noopener noreferrer" color="primary" variant={isActive && formatDate(lesson.date) === 'Сегодня' ? 'solid' : 'flat'} startContent={<Icon icon="lucide:video" width={16} height={16} />} isDisabled={!isActive}>
                            {isActive ? 'Подключиться' : 'Прошел'}
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : <Card><CardBody className="p-6 text-center text-foreground-500"><Icon icon="lucide:calendar-off" className="mx-auto mb-2" width={32} height={32} /><p>Ближайших занятий пока нет.</p></CardBody></Card>}
      </section>
      
      {/* ВОССТАНОВЛЕННЫЙ БЛОК */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Прогресс подготовки к ЕНТ</h2>
        </div>
        <Card>
          <CardBody className="p-6">
            <div className="text-center p-8">
              <Icon icon="lucide:book-open" width={48} height={48} className="text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Пройди первый тест ЕНТ</h3>
              <p className="text-foreground-500 mb-6 max-w-lg mx-auto">
                Начни подготовку к ЕНТ прямо сейчас. Пройди пробный тест, чтобы оценить свой текущий уровень
                знаний и понять, на что нужно обратить больше внимания.
              </p>
              <Button as={RouteLink} to="/test-simulator" color="primary" size="lg" startContent={<Icon icon="lucide:check-square" width={18} height={18} />}>
                Начать пробный тест
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </motion.div>
  );
};

export default Dashboard;
