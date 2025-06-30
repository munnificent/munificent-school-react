import React, { useState, useEffect } from 'react';
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
  addToast
} from '@heroui/react';
import apiClient from '../../api/apiClient';
import { User } from '../../types';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentUser?: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSuccess, currentUser }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'student',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        role: currentUser.role || 'student',
      });
    } else {
      setFormData({ first_name: '', last_name: '', email: '', phone: '', role: 'student' });
    }
  }, [currentUser, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      if (currentUser) {
        await apiClient.patch(`/users/all/${currentUser.id}/`, formData);
        addToast({ title: "Успех", description: "Данные пользователя обновлены.", color: "success" });
      } else {
        const dataToSend = { ...formData, password: 'DefaultPassword123' };
        await apiClient.post('/users/all/', dataToSend);
        addToast({ title: "Успех", description: "Новый пользователь создан.", color: "success" });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : "Произошла ошибка";
      addToast({ title: "Ошибка", description: `Не удалось сохранить пользователя: ${errorMsg}`, color: "danger" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>{currentUser ? "Редактировать пользователя" : "Добавить пользователя"}</ModalHeader>
        <ModalBody className="space-y-4">
          <div className="flex gap-4">
            <Input label="Имя" value={formData.first_name} onValueChange={(v) => handleInputChange('first_name', v)} isRequired />
            <Input label="Фамилия" value={formData.last_name} onValueChange={(v) => handleInputChange('last_name', v)} isRequired />
          </div>
          <Input label="Email" type="email" value={formData.email} onValueChange={(v) => handleInputChange('email', v)} isRequired />
          <Input label="Телефон" value={formData.phone} onValueChange={(v) => handleInputChange('phone', v)} />
          <Select
            label="Роль"
            selectedKeys={[formData.role]}
            onSelectionChange={(keys) => handleInputChange('role', Array.from(keys as Set<string>)[0])}
            isRequired
          >
            <SelectItem key="student">Ученик</SelectItem>
            <SelectItem key="teacher">Преподаватель</SelectItem>
            <SelectItem key="admin">Администратор</SelectItem>
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>Отмена</Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isSaving}>
            {currentUser ? "Сохранить" : "Создать"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserFormModal;