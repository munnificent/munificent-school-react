import React from 'react';
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
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { classOptions, subjectOptions } from '../data/mock-data';

interface RequestFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const RequestFormModal: React.FC<RequestFormModalProps> = ({ 
  isOpen, 
  onOpenChange 
}) => {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [selectedClass, setSelectedClass] = React.useState(new Set([]));
  const [selectedSubject, setSelectedSubject] = React.useState(new Set([]));
  const [comment, setComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleWhatsAppContact = () => {
    // Format phone for WhatsApp API
    const whatsappPhone = "77771234567"; // Hardcoded school's WhatsApp number
    const message = `Здравствуйте! Я хотел(а) бы узнать подробнее о курсах Munificent School.`;
    
    // Create WhatsApp link
    const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappLink, '_blank');
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      
      // Reset form
      setName("");
      setPhone("");
      setSelectedClass(new Set([]));
      setSelectedSubject(new Set([]));
      setComment("");
      
      // You would typically show a success toast here
    }, 1500);
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
                  onSelectionChange={setSelectedClass as any}
                  isRequired
                >
                  {classOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </Select>
                
                <Select
                  label="Выберите предмет"
                  placeholder="Выберите предмет"
                  selectedKeys={selectedSubject}
                  onSelectionChange={setSelectedSubject as any}
                >
                  {subjectOptions.map((option) => (
                    <SelectItem key={option} value={option}>
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