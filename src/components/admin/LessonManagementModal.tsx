import React, { useState, useEffect, useCallback } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, addToast, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import apiClient from '../../api/apiClient';
import { Course, Lesson } from '../../types';

interface LessonManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

const LessonManagementModal: React.FC<LessonManagementModalProps> = ({ isOpen, onClose, course }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const fetchLessons = useCallback(async () => {
    if (!course) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get<Lesson[]>(`/courses/${course.id}/lessons/`);
      setLessons(response.data);
    } catch (error) {
      addToast({ title: "Ошибка", description: "Не удалось загрузить уроки.", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  }, [course]);

  useEffect(() => {
    if (isOpen) {
      fetchLessons();
    }
  }, [isOpen, fetchLessons]);

  const handleSaveLesson = async () => {
    // --- ИЗМЕНЕНИЕ ЗДЕСЬ: Проверка на пустой заголовок ---
    if (!title.trim()) {
      addToast({ title: "Ошибка", description: "Название урока не может быть пустым.", color: "danger" });
      return;
    }
    if (!course) return;

    const lessonData = { title, content };
    try {
      if (currentLesson) { // Редактирование
        await apiClient.patch(`/courses/${course.id}/lessons/${currentLesson.id}/`, lessonData);
        addToast({ title: "Успех", description: "Урок обновлен.", color: "success" });
      } else { // Создание
        await apiClient.post(`/courses/${course.id}/lessons/`, lessonData);
        addToast({ title: "Успех", description: "Урок создан.", color: "success" });
      }
      resetForm();
      fetchLessons();
    } catch (error) {
      addToast({ title: "Ошибка", description: "Не удалось сохранить урок.", color: "danger" });
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!course) return;
    try {
      await apiClient.delete(`/courses/${course.id}/lessons/${lessonId}/`);
      addToast({ title: "Успех", description: "Урок удален.", color: "success" });
      fetchLessons();
    } catch (error) {
      addToast({ title: "Ошибка", description: "Не удалось удалить урок.", color: "danger" });
    }
  };
  
  const resetForm = () => {
    setCurrentLesson(null);
    setTitle('');
    setContent('');
  };

  const startEditing = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setTitle(lesson.title);
    setContent(lesson.content);
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="3xl">
      <ModalContent>
        <ModalHeader>Уроки курса: {course?.title}</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">{currentLesson ? "Редактировать урок" : "Новый урок"}</h3>
              <div className="space-y-4">
                <Input label="Название урока" value={title} onValueChange={setTitle} isRequired/>
                <Textarea label="Содержание/ссылки" value={content} onValueChange={setContent} />
                <div className="flex gap-2">
                  <Button color="primary" onPress={handleSaveLesson}>{currentLesson ? "Сохранить" : "Добавить"}</Button>
                  {currentLesson && <Button variant="light" onPress={resetForm}>Отмена</Button>}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Список уроков</h3>
              {isLoading ? <Spinner /> : (
                <Table aria-label="Список уроков" removeWrapper>
                  <TableHeader><TableColumn>НАЗВАНИЕ</TableColumn><TableColumn>ДЕЙСТВИЯ</TableColumn></TableHeader>
                  <TableBody items={lessons} emptyContent="Уроков пока нет.">
                    {(lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell>{lesson.title}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="flat" onPress={() => startEditing(lesson)}>Edit</Button>
                            <Button size="sm" variant="flat" color="danger" onPress={() => handleDeleteLesson(lesson.id)}>Del</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>Закрыть</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LessonManagementModal;