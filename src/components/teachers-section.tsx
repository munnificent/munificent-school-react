import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, Button, Avatar, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import apiClient from '../api/apiClient';

interface PublicTeacher {
  id: number;
  name: string;
  profile: {
    photo_url: string;
    public_description: string;
    public_subjects: string;
  } | null;
}

export const TeachersSection: React.FC = () => {
  const [teachers, setTeachers] = useState<PublicTeacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await apiClient.get('/users/public-teachers/');
        setTeachers(response.data);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const visibleCount = useMemo(() => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }, []);

  const nextTeacher = () => {
    if (teachers.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % teachers.length);
  };

  const prevTeacher = () => {
    if (teachers.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? teachers.length - 1 : prev - 1));
  };

  const displayedTeachers = useMemo(() => {
    if (teachers.length === 0) return [];
    const result: PublicTeacher[] = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % teachers.length;
      result.push(teachers[index]);
    }
    return result;
  }, [currentIndex, visibleCount, teachers]);

  return (
    <section id="teachers" className="py-20 bg-content1">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Знакомься, это твоя новая команда поддержки.
          </h2>
        </div>
        
        <div className="relative">
          {isLoading ? (
            <div className="flex justify-center h-80 items-center"><Spinner size="lg" /></div>
          ) : (
            <div className="flex space-x-6 overflow-hidden min-h-[420px]">
              {displayedTeachers.map((teacher, idx) => (
                <motion.div
                  // ИСПРАВЛЕНИЕ: Ключ сделан уникальным добавлением индекса
                  key={`${teacher.id}-${idx}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0"
                >
                  <Card className="h-full">
                    <CardBody className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <Avatar
                          src={teacher.profile?.photo_url}
                          name={teacher.name}
                          className="w-32 h-32 mb-4 text-large"
                          isBordered
                          color="primary"
                        />
                        <h3 className="text-xl font-semibold mb-1">{teacher.name}</h3>
                        <div className="flex gap-2 flex-wrap justify-center mb-3 min-h-[24px]">
                          {teacher.profile?.public_subjects && teacher.profile.public_subjects.split(',').map((subject) => (
                            <span key={subject} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              {subject.trim()}
                            </span>
                          ))}
                        </div>
                        <p className="text-foreground-500">{teacher.profile?.public_description}</p>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="flex justify-center mt-8 gap-2">
            <Button isIconOnly variant="flat" onPress={prevTeacher} aria-label="Previous teacher" isDisabled={isLoading}>
              <Icon icon="lucide:chevron-left" width={24} />
            </Button>
            <Button isIconOnly variant="flat" onPress={nextTeacher} aria-label="Next teacher" isDisabled={isLoading}>
              <Icon icon="lucide:chevron-right" width={24} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;