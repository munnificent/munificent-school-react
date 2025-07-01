import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  addToast,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { classOptions, subjectOptions } from '../data/mock-data';
import apiClient from '../api/apiClient';

// --- Конфигурация ---
const WHATSAPP_CONFIG = {
  PHONE: '77771234567',
  MESSAGE: 'Здравствуйте! Я хотел(а) бы узнать подробнее о курсах Munificent School.',
};

const INITIAL_FORM_STATE = {
  name: '',
  phone: '',
  studentClass: '',
  subject: '',
  comment: '',
};

interface RequestFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const RequestFormModal: React.FC<RequestFormModalProps> = ({ isOpen, onOpenChange }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Обработчики ---
  const handleInputChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleSelectionChange = (field: keyof typeof formData) => (keys: unknown) => {
    const value = Array.from(keys as Set<string>)[0] || '';
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWhatsAppContact = () => {
    const link = `https://wa.me/${WHATSAPP_CONFIG.PHONE}?text=${encodeURIComponent(WHATSAPP_CONFIG.MESSAGE)}`;
    window.open(link, '_blank');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = { ...formData, student_class: formData.studentClass };
    delete (payload as any).studentClass; // Приводим к формату API

    try {
      await apiClient.post('/applications/', payload);
      addToast({
        title: 'Заявка отправлена!',
        description: 'Наш менеджер скоро с вами свяжется.',
        color: 'success',
      });
      setFormData(INITIAL_FORM_STATE);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to submit application:', error);
      addToast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Пожалуйста, попробуйте позже.',
        color: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = !formData.name || !formData.phone || !formData.studentClass;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Оставить заявку</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Ваше имя"
                  placeholder="Напишите ваше имя"
                  value={formData.name}
                  onValueChange={handleInputChange('name')}
                  isRequired
                />
                <Input
                  label="Номер телефона"
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onValueChange={handleInputChange('phone')}
                  isRequired
                  type="tel"
                />
                <Select
                  label="Выберите класс"
                  placeholder="Выберите класс ученика"
                  selectedKeys={formData.studentClass ? [formData.studentClass] : []}
                  onSelectionChange={handleSelectionChange('studentClass')}
                  isRequired
                >
                  {classOptions.map((option) => (
                    <SelectItem key={option}>{option}</SelectItem>
                  ))}
                </Select>
                <Select
                  label="Выберите предмет"
                  placeholder="Выберите предмет"
                  selectedKeys={formData.subject ? [formData.subject] : []}
                  onSelectionChange={handleSelectionChange('subject')}
                >
                  {subjectOptions.map((option) => (
                    <SelectItem key={option}>{option}</SelectItem>
                  ))}
                </Select>
                <Textarea
                  label="Комментарий"
                  placeholder="Дополнительная информация (опционально)"
                  value={formData.comment}
                  onValueChange={handleInputChange('comment')}
                />
                <Button
                  variant="flat"
                  color="success"
                  onPress={handleWhatsAppContact}
                  startContent={<Icon icon="lucide:message-circle" width={18} height={18} />}
                  className="w-full"
                >
                  Связаться через WhatsApp
                </Button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Отмена
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={isSubmitDisabled}
              >
                Отправить заявку
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RequestFormModal;