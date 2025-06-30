import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, Spinner, addToast, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import apiClient from '../api/apiClient';
import { useDebounce } from '../hooks/useDebounce';
import { Course } from '../types';
import CourseFormModal from '../components/admin/CourseFormModal';
import DeleteConfirmationModal from '../components/admin/DeleteConfirmationModal';
import LessonManagementModal from '../components/admin/LessonManagementModal'; // <-- Импорт

interface PaginatedResponse<T> { results: T[]; }

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false); // <-- Состояние для нового модала
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      
      const response = await apiClient.get<PaginatedResponse<Course> | Course[]>(`/courses/?${params.toString()}`);
      
      if (response.data && 'results' in response.data) {
        setCourses(response.data.results);
      } else if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else {
        setCourses([]);
      }
    } catch (error) {
      addToast({ title: "Ошибка", description: "Не удалось загрузить курсы", color: "danger" });
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };
  
  const handleManageLessons = (course: Course) => { // <-- Функция для открытия модала уроков
    setSelectedCourse(course);
    setIsLessonModalOpen(true);
  };

  const handleDelete = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/courses/${selectedCourse.id}/`);
      addToast({ title: "Успех", description: `Курс "${selectedCourse.title}" удален.`, color: "success" });
      fetchCourses();
      setIsDeleteModalOpen(false);
    } catch (error) {
      addToast({ title: "Ошибка", description: "Не удалось удалить курс.", color: "danger" });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Курсы</h1>
        <Button color="primary" onPress={() => { setSelectedCourse(null); setIsCourseModalOpen(true); }} startContent={<Icon icon="lucide:plus" />}>Добавить курс</Button>
      </div>
      
      <Card>
        <CardBody className="p-6">
            <Input placeholder="Поиск по названию, предмету..." value={searchQuery} onValueChange={setSearchQuery} startContent={<Icon icon="lucide:search" width={16} />} isClearable className="max-w-md mb-4" />
            
            <Table aria-label="Таблица курсов" removeWrapper>
              <TableHeader>
                <TableColumn>НАЗВАНИЕ КУРСА</TableColumn><TableColumn>ПРЕПОДАВАТЕЛЬ</TableColumn><TableColumn>ПРЕДМЕТ</TableColumn><TableColumn>ЦЕНА</TableColumn><TableColumn>ДЕЙСТВИЯ</TableColumn>
              </TableHeader>
              <TableBody items={courses} isLoading={isLoading} loadingContent={<Spinner />} emptyContent="Курсы не найдены.">
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>
                      {item.teacher_details ? ( <div className="flex items-center gap-3"><Avatar src={item.teacher_details.avatar} name={`${item.teacher_details.first_name} ${item.teacher_details.last_name}`} size="sm" /><div><p>{item.teacher_details.first_name} {item.teacher_details.last_name}</p></div></div>) : "Не назначен"}
                    </TableCell>
                    <TableCell><Chip variant='flat'>{item.subject}</Chip></TableCell>
                    <TableCell>{new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT' }).format(item.price)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="flat" onPress={() => handleManageLessons(item)}>Уроки</Button>
                        <Dropdown>
                          <DropdownTrigger><Button isIconOnly variant="light" size="sm"><Icon icon="lucide:more-vertical" /></Button></DropdownTrigger>
                          <DropdownMenu aria-label="Действия">
                            <DropdownItem key="edit" onPress={() => handleEdit(item)}>Редактировать курс</DropdownItem>
                            <DropdownItem key="delete" className="text-danger" color="danger" onPress={() => handleDelete(item)}>Удалить</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </CardBody>
      </Card>

      <CourseFormModal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} onSuccess={fetchCourses} currentCourse={selectedCourse} />
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} itemName={selectedCourse?.title || ''} isDeleting={isDeleting}/>
      <LessonManagementModal isOpen={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)} course={selectedCourse} />
    </motion.div>
  );
};

export default AdminCourses;