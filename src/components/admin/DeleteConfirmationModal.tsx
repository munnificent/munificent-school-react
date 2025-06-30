import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <Icon icon="lucide:alert-triangle" className="text-danger" width={24} />
          Подтвердите удаление
        </ModalHeader>
        <ModalBody>
          <p>Вы уверены, что хотите удалить <strong>{itemName}</strong>?</p>
          <p className="text-sm text-foreground-500">Это действие невозможно отменить.</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>Отмена</Button>
          <Button color="danger" onPress={onConfirm} isLoading={isDeleting}>
            Удалить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;