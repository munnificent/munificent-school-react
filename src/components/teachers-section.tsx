import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardBody, Button, Avatar, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import apiClient from '../api/apiClient';

// --- Типы и константы ---
interface TeacherProfile {
  avatar: string;
  public_description: string;
  public_subjects: string;
}

interface PublicTeacher {
  id: number;
  first_name: string;
  last_name: string;
  profile: TeacherProfile | null;
}

const SECTION_CONTENT = {
  title: 'Знакомься, это твоя новая команда поддержки.',
};

// --- Хук для определения количества слайдов ---
const useResponsiveSlides = () => {
  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount);

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return visibleCount;
};

// --- Компоненты ---

const TeacherCard: React.FC<{ teacher: PublicTeacher }> = ({ teacher }) => {
  const fullName = `${teacher.first_name} ${teacher.last_name}`;
  const subjects = teacher.profile?.public_subjects.split(',').map(s => s.trim()) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0"
    >
      <Card className="h-full">
        <CardBody className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar
              src={teacher.profile?.avatar}
              name={fullName}
              className="w-32 h-32 mb-4 text-large"
              isBordered
              color="primary"
            />
            <h3 className="text-xl font-semibold mb-1">{fullName}</h3>
            <div className="flex gap-2 flex-wrap justify-center mb-3 min-h-[24px]">
              {subjects.map((subject) => (
                <span key={subject} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {subject}
                </span>
              ))}
            </div>
            <p className="text-foreground-500">{teacher.profile?.public_description}</p>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

const CarouselControls: React.FC<{ onPrev: () => void; onNext: () => void; isDisabled: boolean }> = ({ onPrev, onNext, isDisabled }) => (
  <div className="flex justify-center mt-8 gap-2">
    <Button isIconOnly variant="flat" onPress={onPrev} aria-label="Previous teacher" isDisabled={isDisabled}>
      <Icon icon="lucide:chevron-left" width={24} />
    </Button>
    <Button isIconOnly variant="flat" onPress={onNext} aria-label="Next teacher" isDisabled={isDisabled}>
      <Icon icon="lucide:chevron-right" width={24} />
    </Button>
  </div>
);

// --- Основной компонент ---
export const TeachersSection: React.FC = () => {
  const [teachers, setTeachers] = useState<PublicTeacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = useResponsiveSlides();

  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<PublicTeacher[]>('/users/public-teachers/');
        setTeachers(response.data);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleNext = useCallback(() => {
    if (teachers.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % teachers.length);
  }, [teachers.length]);

  const handlePrev = useCallback(() => {
    if (teachers.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? teachers.length - 1 : prev - 1));
  }, [teachers.length]);

  const displayedTeachers = useMemo(() => {
    if (teachers.length === 0) return [];
    const result: PublicTeacher[] = [];
    for (let i = 0; i < visibleCount; i++) {
      result.push(teachers[(currentIndex + i) % teachers.length]);
    }
    return result;
  }, [currentIndex, visibleCount, teachers]);

  return (
    <section id="teachers" className="py-20 bg-content1">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{SECTION_CONTENT.title}</h2>
        </div>
        
        <div className="relative">
          {isLoading ? (
            <div className="flex justify-center h-80 items-center"><Spinner size="lg" /></div>
          ) : (
            <div className="flex space-x-6 overflow-hidden min-h-[420px]">
              {displayedTeachers.map((teacher, idx) => (
                <TeacherCard key={`${teacher.id}-${currentIndex + idx}`} teacher={teacher} />
              ))}
            </div>
          )}
          
          <CarouselControls onPrev={handlePrev} onNext={handleNext} isDisabled={isLoading || teachers.length <= visibleCount} />
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;