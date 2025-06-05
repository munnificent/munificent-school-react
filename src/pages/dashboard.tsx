// src/pages/dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { Card, CardBody, Button, Link, Divider, Spinner, addToast } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/auth-context';
import { getStudentDashboardData, StudentDashboardData } from '../services/studentService'; // Убедитесь, что путь правильный
import { UpcomingLesson } from '../types'; // Убедитесь, что путь правильный

const Dashboard: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth(); // isLoading из useAuth - это isLoading состояния аутентификации
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [isComponentLoading, setIsComponentLoading] = useState(true); // Отдельное состояние загрузки для данных компонента
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Загружаем данные, только если аутентификация завершена, есть пользователь и это студент
      if (!isAuthLoading && user && user.userType === 'student') {
        setIsComponentLoading(true);
        setError(null);
        try {
          console.log('Dashboard.tsx: Attempting to fetch student dashboard data...');
          const data = await getStudentDashboardData();
          console.log('Dashboard.tsx: Data received from service:', data);
          setDashboardData(data);
        } catch (err: any) {
          const errorMessage = err.message || "Не удалось загрузить данные для дашборда.";
          console.error('Dashboard.tsx: Error fetching data:', errorMessage, err);
          setError(errorMessage);
          addToast({ title: "Ошибка загрузки данных", description: errorMessage, color: "danger" });
        } finally {
          setIsComponentLoading(false);
        }
      } else if (!isAuthLoading && (!user || user.userType !== 'student')) {
        // Если аутентификация завершена, но это не студент или нет пользователя,
        // то загрузку данных для этого дашборда не начинаем.
        // App.tsx должен был бы перенаправить такого пользователя.
        console.log('Dashboard.tsx: User is not a student or not logged in. Data fetching skipped.');
        setIsComponentLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthLoading]); // Перезапускаем эффект, если изменился user или статус загрузки аутентификации

  // Общее состояние загрузки: либо аутентификация еще грузится, либо данные компонента
  const overallIsLoading = isAuthLoading || isComponentLoading;

  if (overallIsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="primary" label="Загрузка данных студента..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-danger">
        <Icon icon="lucide:alert-triangle" width={48} height={48} className="mx-auto mb-2" />
        <p>{error}</p>
        <Button 
          color="primary" 
          variant="flat" 
          onPress={() => { // Повторная попытка загрузки
             if (user) { // Вызываем только если user есть, иначе useEffect сам сработает при его появлении
                const event = new CustomEvent('refetchStudentDashboard');
                window.dispatchEvent(event); // Это не лучший способ, лучше передать функцию refetch
             }
          }}
          className="mt-4"
        >
          Попробовать снова (требует доработки)
        </Button>
      </div>
    );
  }

  // Если это не студент, или данных нет (но загрузка завершена и нет ошибок)
  // App.tsx должен был перенаправить, но на всякий случай:
  if (!user || user.userType !== 'student' || !dashboardData) {
    return (
        <div className="text-center p-8">
            <Icon icon="lucide:user-x" width={48} height={48} className="text-foreground-400 mx-auto mb-2" />
            <p className="text-foreground-500">Нет данных для отображения или вы не авторизованы как студент.</p>
            <p className="text-xs text-foreground-400 mt-2">Пользователь: {user?.username}, Тип: {user?.userType}</p>
        </div>
    );
  }

  // Если мы дошли сюда, значит, dashboardData не null
  const upcomingLessons: UpcomingLesson[] = dashboardData.upcoming_lessons || [];
  const entProgressSummary: string = dashboardData.ent_progress_summary || 'Пройди первый тест ЕНТ, чтобы оценить свой уровень!';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Привет, {user.username}!</h1>
        <p className="text-foreground-500 mt-2">
          Добро пожаловать в твой личный кабинет. Здесь ты найдешь расписание занятий и важную информацию.
        </p>
      </div>
      
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Ближайшие занятия</h2>
          <Link as={RouteLink} to="/my-courses" color="primary">
            <div className="flex items-center gap-1">
              <span>Все курсы</span>
              <Icon icon="lucide:chevron-right" width={16} height={16} />
            </div>
          </Link>
        </div>
        
        {upcomingLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {upcomingLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
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
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          lesson.date === 'Сегодня' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-primary/10 text-primary'
                        }`}>
                          {lesson.date}
                        </div>
                      </div>
                      <Divider className="my-3" />
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:clock" width={16} height={16} className="text-foreground-500" />
                          <span>{lesson.time}</span>
                        </div>
                        <Button
                          as="a"
                          href={lesson.zoomLink || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                          variant={lesson.date === 'Сегодня' ? 'solid' : 'flat'}
                          startContent={<Icon icon="lucide:video" width={16} height={16} />}
                          className={lesson.date === 'Сегодня' ? '' : 'text-primary'}
                          isDisabled={!lesson.zoomLink}
                        >
                          {lesson.date === 'Сегодня' ? 'Подключиться' : 'Напоминание'}
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="p-6 text-center text-foreground-500">
              <Icon icon="lucide:calendar-off" width={32} height={32} className="mx-auto mb-2" />
              Нет ближайших занятий.
            </CardBody>
          </Card>
        )}
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Прогресс подготовки к ЕНТ</h2>
        </div>
        <Card>
          <CardBody className="p-6">
            <div className="text-center p-8">
              <Icon icon="lucide:book-open" width={48} height={48} className="text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{entProgressSummary}</h3>
              <p className="text-foreground-500 mb-6 max-w-lg mx-auto">
                Начни подготовку к ЕНТ прямо сейчас. Пройди пробный тест, чтобы оценить свой текущий уровень
                знаний и понять, на что нужно обратить больше внимания.
              </p>
              <Button
                as={RouteLink}
                to="/test-simulator"
                color="primary"
                size="lg"
                startContent={<Icon icon="lucide:check-square" width={18} height={18} />}
              >
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