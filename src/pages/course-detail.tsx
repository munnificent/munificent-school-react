import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Card, CardBody, Button, Divider, Chip, Avatar } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { courses, lessons } from '../data/mock-data';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id as string);
  const history = useHistory();
  
  // Find the course
  const course = courses.find(c => c.id === courseId);
  const courseLessons = lessons[courseId] || [];
  
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Icon icon="lucide:book-x" width={48} height={48} className="text-foreground-400 mb-4" />
        <h2 className="text-xl font-semibold">Курс не найден</h2>
        <p className="text-foreground-500 mt-2">Курс с указанным идентификатором не существует.</p>
      </div>
    );
  }
  
  const handleGoBack = () => {
    history.push('/my-courses');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            variant="light"
            aria-label="Go back"
            onPress={handleGoBack}
          >
            <Icon icon="lucide:arrow-left" width={20} height={20} />
          </Button>
          <h1 className="text-3xl font-bold">{course.name}</h1>
        </div>
        
        <div className="mt-4 flex items-center gap-4">
          <Avatar src={course.teacher.photoUrl} size="md" />
          <div>
            <p className="font-medium">Преподаватель: {course.teacher.name}</p>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                <Icon icon="lucide:book-open" width={16} height={16} className="text-foreground-500 mr-1" />
                <span className="text-sm text-foreground-500">{courseLessons.length} уроков</span>
              </div>
              <Divider orientation="vertical" className="h-4 mx-2" />
              <div className="flex items-center">
                <Icon icon="lucide:check-circle" width={16} height={16} className="text-foreground-500 mr-1" />
                <span className="text-sm text-foreground-500">
                  {courseLessons.filter(l => l.status === 'пройден').length} завершено
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
            <Chip
              color={course.progress >= 75 ? 'success' : 'primary'}
              variant="flat"
              radius="sm"
            >
              {course.progress}% завершено
            </Chip>
          </div>
          
          <div className="w-full h-3 bg-content3 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${course.progress >= 75 ? 'bg-success' : 'bg-primary'}`}
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </CardBody>
      </Card>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Список уроков</h2>
        
        <div className="space-y-4">
          {courseLessons.map((lesson, index) => (
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
                      <div className={`p-2 rounded-full ${
                        lesson.status === 'пройден' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        <Icon 
                          icon={lesson.status === 'пройден' ? 'lucide:check' : 'lucide:calendar'} 
                          width={20} 
                          height={20} 
                        />
                      </div>
                      
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-foreground-500">Дата: {lesson.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:ml-auto">
                      {lesson.status === 'пройден' ? (
                        <>
                          {lesson.recordingUrl && (
                            <Button
                              as="a"
                              href={lesson.recordingUrl}
                              target="_blank"
                              size="sm"
                              variant="flat"
                              color="primary"
                              startContent={<Icon icon="lucide:video" width={16} height={16} />}
                            >
                              Смотреть запись
                            </Button>
                          )}
                          
                          {lesson.homeworkUrl && (
                            <Button
                              as="a"
                              href={lesson.homeworkUrl}
                              target="_blank"
                              size="sm"
                              variant="flat"
                              color="primary"
                              startContent={<Icon icon="lucide:download" width={16} height={16} />}
                            >
                              Скачать ДЗ
                            </Button>
                          )}
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="flat"
                            isDisabled
                            startContent={<Icon icon="lucide:video" width={16} height={16} />}
                          >
                            Смотреть запись
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="flat"
                            isDisabled
                            startContent={<Icon icon="lucide:download" width={16} height={16} />}
                          >
                            Скачать ДЗ
                          </Button>
                        </>
                      )}
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