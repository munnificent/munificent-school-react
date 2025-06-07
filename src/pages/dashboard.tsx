import React from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { Card, CardBody, Button, Link, Divider } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { studentName, upcomingLessons } from '../data/mock-data';

const Dashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Привет, {studentName}!</h1>
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
                      <div className={`px-3 py-1 rounded-full ${lesson.date === 'Сегодня' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
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
                        href={lesson.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        variant={lesson.date === 'Сегодня' ? 'solid' : 'flat'}
                        startContent={<Icon icon="lucide:video" width={16} height={16} />}
                        className={lesson.date === 'Сегодня' ? '' : 'text-primary'}
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
      </section>
      
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