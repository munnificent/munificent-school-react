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
  addToast
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { classOptions, subjectOptions } from '../data/mock-data';
import apiClient from '../api/apiClient';

interface RequestFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const RequestFormModal: React.FC<RequestFormModalProps> = ({ 
  isOpen, 
  onOpenChange 
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedClass, setSelectedClass] = useState<Set<string>>(new Set([]));
  const [selectedSubject, setSelectedSubject] = useState<Set<string>>(new Set([]));
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearForm = () => {
    setName("");
    setPhone("");
    setSelectedClass(new Set([]));
    setSelectedSubject(new Set([]));
    setComment("");
  }
  
  const handleWhatsAppContact = () => {
    const whatsappPhone = "77771234567"; // Пример номера
    const message = `Здравствуйте! Я хотел(а) бы узнать подробнее о курсах Munificent School.`;
    const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const payload = {
      name: name,
      phone: phone,
      student_class: Array.from(selectedClass)[0] || "",
      subject: Array.from(selectedSubject)[0] || "",
      comment: comment
    };

    try {
      await apiClient.post('/applications/', payload);
      
      addToast({
        title: "Заявка отправлена!",
        description: "Наш менеджер скоро с вами свяжется.",
        color: "success",
      });

      clearForm();
      onOpenChange(false);

    } catch (error) {
      console.error("Failed to submit application:", error);
      addToast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Пожалуйста, попробуйте позже.",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Оставить заявку
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Ваше имя"
                  placeholder="Напишите ваше имя"
                  value={name}
                  onValueChange={setName}
                  isRequired
                />
                <Input
                  label="Номер телефона"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onValueChange={setPhone}
                  isRequired
                  type="tel"
                />
                <Select
                  label="Выберите класс"
                  placeholder="Выберите класс ученика"
                  selectedKeys={selectedClass}
                  onSelectionChange={(keys) => setSelectedClass(keys as Set<string>)}
                  isRequired
                >
                  {classOptions.map((option) => (
                    // ИСПРАВЛЕНИЕ 1: Убран 'value'
                    <SelectItem key={option}>
                      {option}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Выберите предмет"
                  placeholder="Выберите предмет"
                  selectedKeys={selectedSubject}
                  onSelectionChange={(keys) => setSelectedSubject(keys as Set<string>)}
                >
                  {subjectOptions.map((option) => (
                    // ИСПРАВЛЕНИЕ 2: Убран 'value'
                    <SelectItem key={option}>
                      {option}
                    </SelectItem>
                  ))}
                </Select>
                <Textarea
                  label="Комментарий"
                  placeholder="Дополнительная информация (опционально)"
                  value={comment}
                  onValueChange={setComment}
                />
                
                <div className="flex justify-center">
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
                isDisabled={!name || !phone || selectedClass.size === 0}
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