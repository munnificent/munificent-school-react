import React, { useState, useEffect, useMemo } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { Card, CardBody, Button, Link, Divider, Spinner, Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/auth-context';
import apiClient from '../api/apiClient';
import { User } from '../types';
import { UpcomingLesson } from '../types';

// --- Типы и константы ---


const CONTENT = {
  welcome: "Привет",
  welcomeBack: "Добро пожаловать в твой личный кабинет.",
  upcomingLessons: "Ближайшие занятия",
  allCourses: "Все курсы",
  noLessons: "Ближайших занятий пока нет.",
  entProgressTitle: "Прогресс подготовки к ЕНТ",
  entCardTitle: "Пройди первый тест ЕНТ",
  entCardDescription: "Начни подготовку к ЕНТ прямо сейчас. Пройди пробный тест, чтобы оценить свой текущий уровень знаний и понять, на что нужно обратить больше внимания.",
  entButtonText: "Начать пробный тест",
};

// --- Вспомогательные функции ---
const formatDate = (dateString: string) => {
  const lessonDate = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (lessonDate.toDateString() === today.toDateString()) return "Сегодня";
  if (lessonDate.toDateString() === tomorrow.toDateString()) return "Завтра";
  return lessonDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};

const formatTime = (timeString: string) => {
  return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

// --- Компоненты ---

const DashboardHeader: React.FC<{ user: User | null }> = ({ user }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold">{CONTENT.welcome}, {user?.first_name}!</h1>
    <p className="text-foreground-500 mt-2">{CONTENT.welcomeBack}</p>
  </div>
);

const LessonCard: React.FC<{ lesson: UpcomingLesson; index: number }> = ({ lesson, index }) => {
  const lessonDate = useMemo(() => new Date(`${lesson.date}T${lesson.time}`), [lesson.date, lesson.time]);
  const isPast = useMemo(() => lessonDate < new Date(), [lessonDate]);
  const dateLabel = formatDate(lesson.date);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">{lesson.courseName}</h3>
                <p className="text-foreground-500">с {lesson.teacherName}</p>
              </div>
              <Chip color={dateLabel === 'Сегодня' ? 'success' : 'primary'} variant="flat">{dateLabel}</Chip>
            </div>
            <Divider className="my-3" />
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:clock" width={16} height={16} className="text-foreground-500" />
                <span>{formatTime(lesson.time)}</span>
              </div>
              <Button 
                as="a" 
                href={lesson.zoomLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                color="primary" 
                variant={!isPast && dateLabel === 'Сегодня' ? 'solid' : 'flat'} 
                startContent={<Icon icon="lucide:video" width={16} height={16} />} 
                isDisabled={isPast}
              >
                {isPast ? 'Прошел' : 'Подключиться'}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

const EntProgressCard: React.FC = () => (
  <Card>
    <CardBody className="p-6">
      <div className="text-center p-4 md:p-8">
        <Icon icon="lucide:book-open" width={48} height={48} className="text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">{CONTENT.entCardTitle}</h3>
        <p className="text-foreground-500 mb-6 max-w-lg mx-auto">{CONTENT.entCardDescription}</p>
        <Button as={RouteLink} to="/app/tests" color="primary" size="lg" startContent={<Icon icon="lucide:check-square" width={18} height={18} />}>
          {CONTENT.entButtonText}
        </Button>
      </div>
    </CardBody>
  </Card>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<UpcomingLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingLessons = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<UpcomingLesson[]>('/courses/upcoming-lessons/');
        setLessons(response.data);
      } catch (error) {
        console.error("Failed to fetch upcoming lessons:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if(user?.role === 'student') {
        fetchUpcomingLessons();
    } else {
        setIsLoading(false);
    }
  }, [user]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }} 
      className="flex flex-col gap-8"
    >
      <DashboardHeader user={user} />
      
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{CONTENT.upcomingLessons}</h2>
          <Link as={RouteLink} to="/app/my-courses" color="primary">
            <div className="flex items-center gap-1">
              <span>{CONTENT.allCourses}</span>
              <Icon icon="lucide:chevron-right" width={16} height={16} />
            </div>
          </Link>
        </div>
        
        {isLoading 
          ? <div className="flex justify-center items-center h-40"><Spinner label="Загрузка занятий..." /></div>
          : lessons.length > 0 
            ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {lessons.map((lesson, index) => <LessonCard key={lesson.id} lesson={lesson} index={index} />)}
              </div>
            : <Card><CardBody className="p-6 text-center text-foreground-500"><Icon icon="lucide:calendar-off" className="mx-auto mb-2" width={32} height={32} /><p>{CONTENT.noLessons}</p></CardBody></Card>
        }
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">{CONTENT.entProgressTitle}</h2>
        <EntProgressCard />
      </section>
    </motion.div>
  );
};

export default Dashboard;