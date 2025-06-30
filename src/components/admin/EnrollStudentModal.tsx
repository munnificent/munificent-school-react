import React, { useState, useEffect, useCallback } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, CheckboxGroup, Checkbox, Spinner, addToast, ScrollShadow } from '@heroui/react';
import apiClient from '../../api/apiClient';
import { User, Course } from '../../types';

// Определяем типы для возможных ответов API
interface PaginatedResponse<T> {
  results: T[];
}

interface EnrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: User | null;
}

const EnrollStudentModal: React.FC<EnrollStudentModalProps> = ({ isOpen, onClose, student }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCoursesAndStudentData = useCallback(async () => {
    if (!student) return;
    setIsLoading(true);
    try {
      const coursesResponse = await apiClient.get<PaginatedResponse<Course> | Course[]>('/courses/');
      const studentResponse = await apiClient.get<User>(`/users/${student.id}/`);
      
      // --- ИЗМЕНЕНИЕ ЗДЕСЬ: Надежная обработка ответа ---
      // Проверяем, есть ли в ответе ключ 'results' (пагинация)
      if (coursesResponse.data && 'results' in coursesResponse.data && Array.isArray(coursesResponse.data.results)) {
        setCourses(coursesResponse.data.results);
      } 
      // Иначе проверяем, не является ли ответ просто массивом
      else if (Array.isArray(coursesResponse.data)) {
        setCourses(coursesResponse.data);
      }

      // @ts-ignore - Профиль приходит от API, даже если не указан в базовом типе
      const enrolledIds = studentResponse.data.profile?.enrolled_courses?.map(String) || [];
      setSelectedCourses(enrolledIds);

    } catch (error) {
      addToast({ title: "Ошибка", description: "Не удалось загрузить данные.", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  }, [student]);

  useEffect(() => {
    if (isOpen) {
      fetchCoursesAndStudentData();
    }
  }, [isOpen, fetchCoursesAndStudentData]);

  const handleEnroll = async () => {
    if (!student) return;
    try {
      await apiClient.post(`/users/students/${student.id}/enroll/`, {
        course_ids: selectedCourses.map(Number)
      });
      addToast({ title: "Успех!", description: `Данные о курсах для ${student.first_name} обновлены.`, color: "success" });
      onClose();
    } catch (error) {
      addToast({ title: "Ошибка", description: "Не удалось обновить запись.", color: "danger" });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="lg">
      <ModalContent>
        <ModalHeader>Запись на курсы: {student?.first_name} {student?.last_name}</ModalHeader>
        <ModalBody>
          {isLoading ? <Spinner /> : (
            <ScrollShadow className="h-[300px]">
              <CheckboxGroup
                label="Выберите курсы для записи"
                value={selectedCourses}
                onValueChange={setSelectedCourses}
                className="w-full"
              >
                {courses.length > 0 ? (
                  courses.map(course => (
                    <Checkbox key={course.id} value={String(course.id)}>
                      {course.title} ({course.subject})
                    </Checkbox>
                  ))
                ) : (
                  <p className="text-foreground-500">Доступных курсов не найдено.</p>
                )}
              </CheckboxGroup>
            </ScrollShadow>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>Отмена</Button>
          <Button color="primary" onPress={handleEnroll}>Сохранить</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EnrollStudentModal;