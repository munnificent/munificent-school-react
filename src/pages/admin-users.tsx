import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Input, Button, Spinner, Tabs, Tab, Avatar, addToast, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import apiClient from '../api/apiClient';
import { useDebounce } from '../hooks/useDebounce';
import { User } from '../types';
import UserFormModal from '../components/admin/UserFormModal';
import DeleteConfirmationModal from '../components/admin/DeleteConfirmationModal';

interface PaginatedResponse<T> { results: T[]; }

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (selectedRole !== 'all') params.append('role', selectedRole);
      
      // --- ИЗМЕНЕНИЕ ЗДЕСЬ: убираем /all/ ---
      const response = await apiClient.get<PaginatedResponse<User> | User[]>(`/users/?${params.toString()}`);
      
      if (response.data && 'results' in response.data && Array.isArray(response.data.results)) {
        setUsers(response.data.results);
      } else if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      addToast({ title: "Ошибка", description: "Не удалось загрузить пользователей", color: "danger" });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedRole]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    try {
      // --- ИЗМЕНЕНИЕ ЗДЕСЬ: убираем /all/ ---
      await apiClient.delete(`/users/${selectedUser.id}/`);
      addToast({ title: "Успех", description: `Пользователь ${selectedUser.email} удален.`, color: "success" });
      fetchUsers();
      setIsDeleteModalOpen(false);
    } catch (error) {
      addToast({ title: "Ошибка", description: "Не удалось удалить пользователя.", color: "danger" });
    } finally {
      setIsDeleting(false);
    }
  };

  const roleChips: { [key: string]: React.ReactElement } = {
    student: <Chip color="primary" variant="flat" size="sm">Ученик</Chip>,
    teacher: <Chip color="success" variant="flat" size="sm">Преподаватель</Chip>,
    admin: <Chip color="secondary" variant="flat" size="sm">Администратор</Chip>,
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Пользователи</h1>
        <Button color="primary" onPress={() => { setSelectedUser(null); setIsUserModalOpen(true); }} startContent={<Icon icon="lucide:plus" />}>Добавить пользователя</Button>
      </div>
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
            <Input placeholder="Поиск по имени, email..." value={searchQuery} onValueChange={setSearchQuery} startContent={<Icon icon="lucide:search" />} isClearable className="flex-1 max-w-md"/>
            <Tabs aria-label="Фильтр по ролям" selectedKey={selectedRole} onSelectionChange={(key) => setSelectedRole(key as string)}>
              <Tab key="all" title="Все" /><Tab key="admin" title="Администраторы" /><Tab key="teacher" title="Преподаватели" /><Tab key="student" title="Ученики" />
            </Tabs>
          </div>
          <Table aria-label="Таблица пользователей" removeWrapper>
            <TableHeader>
              <TableColumn>ПОЛЬЗОВАТЕЛЬ</TableColumn><TableColumn>РОЛЬ</TableColumn><TableColumn>СТАТУС</TableColumn><TableColumn>ПОСЛЕДНИЙ ВХОД</TableColumn><TableColumn>ДЕЙСТВИЯ</TableColumn>
            </TableHeader>
            <TableBody items={users} isLoading={isLoading} loadingContent={<Spinner />} emptyContent="Пользователи не найдены.">
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell><div className="flex items-center gap-3"><Avatar src={item.avatar} name={`${item.first_name} ${item.last_name}`} size="sm" /><div><p className="font-medium">{item.first_name} {item.last_name}</p><p className="text-sm text-foreground-500">{item.email}</p></div></div></TableCell>
                  <TableCell>{roleChips[item.role]}</TableCell>
                  <TableCell><Chip color={item.is_active ? "success" : "default"} variant="dot" size="sm">{item.is_active ? "Активен" : "Неактивен"}</Chip></TableCell>
                  <TableCell>{item.last_login ? new Date(item.last_login).toLocaleString('ru-RU') : "Никогда"}</TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger><Button isIconOnly variant="light" size="sm"><Icon icon="lucide:more-vertical" /></Button></DropdownTrigger>
                      <DropdownMenu aria-label="Действия">
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
      <UserFormModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSuccess={fetchUsers} currentUser={selectedUser}/>
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} itemName={selectedUser?.email || ''} isDeleting={isDeleting}/>
    </motion.div>
  );
};

export default AdminUsers;