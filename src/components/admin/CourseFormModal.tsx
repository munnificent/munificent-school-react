import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem, addToast } from '@heroui/react';
import apiClient from '../../api/apiClient';
import { Course, User } from '../../types';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentCourse?: Course | null;
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({ isOpen, onClose, onSuccess, currentCourse }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    price: '',
    teacher: '',
  });
  const [teachers, setTeachers] = useState<User[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
        const response = await apiClient.get<any>('/public-teachers/');
        
        if (response.data && Array.isArray(response.data.results)) {
            setTeachers(response.data.results);
        } else if (Array.isArray(response.data)) {
            setTeachers(response.data);
        }

      } catch (error) {
        console.error("Failed to fetch teachers", error);
      }
    };
    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentCourse) {
      setFormData({
        title: currentCourse.title,
        description: currentCourse.description,
        subject: currentCourse.subject,
        price: String(currentCourse.price),
        teacher: String(currentCourse.teacher),
      });
    } else {
      setFormData({ title: '', description: '', subject: '', price: '', teacher: '' });
    }
  }, [currentCourse, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    // Преобразуем teacher в число, если он не пустой, иначе null
    const teacherId = formData.teacher ? Number(formData.teacher) : null;
    const dataToSend = { ...formData, price: Number(formData.price), teacher: teacherId };

    try {
      if (currentCourse) {
        await apiClient.patch(`/courses/${currentCourse.id}/`, dataToSend);
        addToast({ title: "Успех", description: "Курс обновлен.", color: "success" });
      } else {
        await apiClient.post('/courses/', dataToSend);
        addToast({ title: "Успех", description: "Новый курс создан.", color: "success" });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : "Произошла ошибка";
      addToast({ title: "Ошибка", description: `Не удалось сохранить курс: ${errorMsg}`, color: "danger" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>{currentCourse ? "Редактировать курс" : "Добавить курс"}</ModalHeader>
        <ModalBody className="space-y-4">
          <Input label="Название курса" value={formData.title} onValueChange={(v) => handleInputChange('title', v)} isRequired />
          <Textarea label="Описание" value={formData.description} onValueChange={(v) => handleInputChange('description', v)} />
          <div className="flex gap-4">
            <Input label="Предмет" value={formData.subject} onValueChange={(v) => handleInputChange('subject', v)} isRequired />
            <Input label="Цена" type="number" value={formData.price} onValueChange={(v) => handleInputChange('price', v)} isRequired />
          </div>
          <Select
            label="Преподаватель"
            items={teachers}
            selectedKeys={formData.teacher ? [formData.teacher] : []}
            onSelectionChange={(keys) => handleInputChange('teacher', Array.from(keys as Set<string>)[0])}
            isRequired
          >
            {(teacher) => <SelectItem key={teacher.id}>{`${teacher.first_name} ${teacher.last_name}`}</SelectItem>}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>Отмена</Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isSaving}>
            {currentCourse ? "Сохранить" : "Создать"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CourseFormModal;