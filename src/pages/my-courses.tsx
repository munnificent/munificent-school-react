import React from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { Card, CardBody, Progress, Link } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { courses } from '../data/mock-data';

const MyCourses: React.FC = () => {
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
                      <div className="flex items-center mt-1">
                        <img 
                          src={course.teacher.photoUrl} 
                          alt={course.teacher.name}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="text-sm text-foreground-500">{course.teacher.name}</span>
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
    </motion.div>
  );
};

export default MyCourses;