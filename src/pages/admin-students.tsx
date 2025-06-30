import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Input, Button, Spinner, Avatar, addToast, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import apiClient from '../api/apiClient';
import { useDebounce } from '../hooks/useDebounce';
import { User } from '../types';
import UserFormModal from '../components/admin/UserFormModal';
import DeleteConfirmationModal from '../components/admin/DeleteConfirmationModal';
import EnrollStudentModal from '../components/admin/EnrollStudentModal';

interface PaginatedResponse<T> { results: T[]; }

const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('role', 'student');
      if (debouncedSearch) params.append('search', debouncedSearch);
      
      // --- ИЗМЕНЕНИЕ ЗДЕСЬ: убираем /all/ ---
      const response = await apiClient.get<PaginatedResponse<User> | User[]>(`/users/?${params.toString()}`);
      
      if (response.data && 'results' in response.data && Array.isArray(response.data.results)) {
        setStudents(response.data.results);
      } else if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      addToast({ title: "Ошибка", description: "Не удалось загрузить список учеников", color: "danger" });
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleEnroll = (student: User) => {
    setSelectedStudent(student);
    setIsEnrollModalOpen(true);
  };

  const handleEdit = (student: User) => {
    setSelectedStudent(student);
    setIsUserModalOpen(true);
  };

  const handleDelete = (student: User) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedStudent) return;
    setIsDeleting(true);
    try {
      // --- ИЗМЕНЕНИЕ ЗДЕСЬ: убираем /all/ ---
      await apiClient.delete(`/users/${selectedStudent.id}/`);
      addToast({ title: "Успех", description: `Ученик ${selectedStudent.email} удален.`, color: "success" });
      fetchStudents();
      setIsDeleteModalOpen(false);
    } catch (error) {
      addToast({ title: "Ошибка", description: "Не удалось удалить ученика.", color: "danger" });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ученики</h1>
        <Button color="primary" onPress={() => { setSelectedStudent(null); setIsUserModalOpen(true); }} startContent={<Icon icon="lucide:plus" />}>Добавить ученика</Button>
      </div>
      <Card>
        <CardBody className="p-6">
            <Input placeholder="Поиск по имени, email..." value={searchQuery} onValueChange={setSearchQuery} startContent={<Icon icon="lucide:search" />} isClearable className="max-w-md mb-4"/>
            <Table aria-label="Таблица учеников" removeWrapper>
              <TableHeader>
                <TableColumn>УЧЕНИК</TableColumn><TableColumn>ТЕЛЕФОН</TableColumn><TableColumn>СТАТУС</TableColumn><TableColumn>ПОСЛЕДНИЙ ВХОД</TableColumn><TableColumn>ДЕЙСТВИЯ</TableColumn>
              </TableHeader>
              <TableBody items={students} isLoading={isLoading} loadingContent={<Spinner />} emptyContent="Ученики не найдены.">
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell><div className="flex items-center gap-3"><Avatar src={item.avatar} name={`${item.first_name} ${item.last_name}`} size="sm" /><div><p className="font-medium">{item.first_name} {item.last_name}</p><p className="text-sm text-foreground-500">{item.email}</p></div></div></TableCell>
                    <TableCell>{item.phone || "Не указан"}</TableCell>
                    <TableCell><Chip color={item.is_active ? "success" : "default"} variant="dot" size="sm">{item.is_active ? "Активен" : "Неактивен"}</Chip></TableCell>
                    <TableCell>{item.last_login ? new Date(item.last_login).toLocaleString('ru-RU') : "Никогда"}</TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger><Button isIconOnly variant="light" size="sm"><Icon icon="lucide:more-vertical" /></Button></DropdownTrigger>
                        <DropdownMenu aria-label="Действия">
                          <DropdownItem key="enroll" onPress={() => handleEnroll(item)}>Записать на курс</DropdownItem>
                          <DropdownItem key="edit" onPress={() => handleEdit(item)}>Редактировать</DropdownItem>
                          <DropdownItem key="delete" className="text-danger" color="danger" onPress={() => handleDelete(item)}>Удалить</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </CardBody>
      </Card>
      <UserFormModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSuccess={fetchStudents} currentUser={selectedStudent} />
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} itemName={selectedStudent?.email || ''} isDeleting={isDeleting} />
      <EnrollStudentModal isOpen={isEnrollModalOpen} onClose={() => setIsEnrollModalOpen(false)} student={selectedStudent} />
    </motion.div>
  );
};

export default AdminStudents;