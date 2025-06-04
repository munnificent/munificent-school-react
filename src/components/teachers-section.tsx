import React from 'react';
import { Card, CardBody, Button, Avatar } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { teachers } from '../data/mock-data';

export const TeachersSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const visibleCount = React.useMemo(() => {
    // Determine how many teachers to show based on screen size
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
    }
    return 1;
  }, []);

  const nextTeacher = () => {
    setCurrentIndex((prev) => (prev + 1) % teachers.length);
  };

  const prevTeacher = () => {
    setCurrentIndex((prev) => (prev === 0 ? teachers.length - 1 : prev - 1));
  };

  // Calculate which teachers to display
  const displayedTeachers = React.useMemo(() => {
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % teachers.length;
      result.push(teachers[index]);
    }
    return result;
  }, [currentIndex, visibleCount]);

  return (
    <section id="teachers" className="py-20 bg-content1">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Знакомься, это твоя новая команда поддержки.
          </h2>
        </div>
        
        <div className="relative">
          <div className="flex space-x-6 overflow-hidden">
            {displayedTeachers.map((teacher, idx) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0"
              >
                <Card className="h-full">
                  <CardBody className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar
                        src={teacher.photoUrl}
                        className="w-32 h-32 mb-4"
                        isBordered
                        color="primary"
                      />
                      <h3 className="text-xl font-semibold mb-1">{teacher.name}</h3>
                      <div className="flex gap-2 flex-wrap justify-center mb-3">
                        {teacher.subjects.map((subject, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                      <p className="text-foreground-500">{teacher.description}</p>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8 gap-2">
            <Button 
              isIconOnly 
              variant="flat" 
              onPress={prevTeacher}
              aria-label="Previous teacher"
            >
              <Icon icon="lucide:chevron-left" width={24} />
            </Button>
            <Button 
              isIconOnly 
              variant="flat" 
              onPress={nextTeacher}
              aria-label="Next teacher"
            >
              <Icon icon="lucide:chevron-right" width={24} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;