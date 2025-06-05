// src/pages/admin-courses.tsx
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardBody, 
  Button, 
  Input,
  Divider,
  // Chip, // Chip не используется в этом варианте отображения курсов, можно удалить или оставить для будущего
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner, // Для индикатора загрузки
  addToast
} from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
// import { courses as mockCourses } from '../data/mock-data'; // Больше не используем моковые данные напрямую
import { getAllCourses, createCourse } from '../services/courseService';
import { Course } from '../types'; // Убедитесь, что тип Course импортирован

// Форма для модального окна создания/редактирования курса
const CourseForm: React.FC<{
  initialData?: Partial<Course>;
  onSubmit: (data: Omit<Course, 'id' | 'teacher'> & { teacherId: number }) => Promise<void>; // Обновил тип
  onClose: () => void;
  isLoading: boolean;
}> = ({ initialData, onSubmit, onClose, isLoading }) => {
  const [name, setName] = useState(initialData?.name || '');
  // Предполагаем, что для создания курса нужно будет передать ID учителя.
  // В реальном приложении здесь мог бы быть Select для выбора учителя.
  const [teacherId, setTeacherId] = useState<string>( (initialData?.teacher as any)?.id?.toString() || ''); // Упрощенно, в реальном приложении нужен ID

  const handleSubmit = async () => {
    if (!name || !teacherId) {
      addToast({title: "Ошибка", description: "Название курса и ID учителя обязательны.", color: "danger"});
      return;
    }
    // В реальном приложении нужно будет получить teacherId другим способом
    // Например, из выпадающего списка учителей.
    // Для Course тип teacher был объектом, а для создания может требоваться ID.
    // Здесь нужно будет согласовать с бэкендом, что он ожидает.
    // Пока что для примера передаем teacherId как число.
    await onSubmit({ name, teacherId: parseInt(teacherId) });
  };

  return (
    <>
      <ModalBody>
        <Input
          label="Название курса"
          placeholder="Введите название курса"
          value={name}
          onValueChange={setName}
          isRequired
        />
        <Input
          label="ID Преподавателя" // В реальном приложении здесь был бы Select с преподавателями
          placeholder="Введите ID преподавателя"
          value={teacherId}
          onValueChange={setTeacherId}
          type="number"
          isRequired
        />
        {/* Добавьте другие поля курса здесь, если необходимо */}
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="flat" onPress={onClose} disabled={isLoading}>
          Отмена
        </Button>
        <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
          {initialData?.id ? 'Сохранить' : 'Создать'}
        </Button>
      </ModalFooter>
    </>
  );
};


const AdminCourses: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [editingCourse, setEditingCourse] = useState<Course | null>(null); // Для редактирования

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (err: any) {
      setError(err.message || "Не удалось загрузить курсы.");
      addToast({title: "Ошибка загрузки", description: err.message || "Не удалось загрузить курсы.", color: "danger"});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (courseData: Omit<Course, 'id' | 'teacher'> & { teacherId: number }) => {
    setIsSubmitting(true);
    try {
      await createCourse(courseData);
      addToast({title: "Успех", description: "Курс успешно создан!", color: "success"});
      fetchCourses(); // Обновить список курсов
      setIsModalOpen(false); // Закрыть модальное окно
    } catch (err: any) {
      addToast({title: "Ошибка", description: err.message || "Не удалось создать курс.", color: "danger"});
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.teacher && course.teacher.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-danger">
        <Icon icon="lucide:alert-triangle" width={48} height={48} className="mx-auto mb-2" />
        <p>{error}</p>
        <Button color="primary" variant="flat" onPress={fetchCourses} className="mt-4">
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Курсы</h1>
        <p className="text-foreground-500 mt-2">
          Управление курсами и учебными программами
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Поиск курсов..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Icon icon="lucide:search" width={16} height={16} className="text-foreground-500" />}
            clearable
          />
        </div>
        
        <Button 
          color="primary" 
          startContent={<Icon icon="lucide:plus" width={16} height={16} />}
          onPress={() => setIsModalOpen(true)}
        >
          Добавить курс
        </Button>
      </div>
      
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} isPressable>
              <CardBody className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{course.name}</h3>
                    {/* В CourseService и типе Course учитель - это объект. Убедитесь, что API возвращает его */}
                    <p className="text-sm text-foreground-500">{course.teacher?.name || 'Преподаватель не назначен'}</p>
                  </div>
                  <Button isIconOnly size="sm" variant="light"> {/* TODO: Добавить действия (редактировать, удалить) */}
                    <Icon icon="lucide:more-vertical" width={16} height={16} />
                  </Button>
                </div>
                
                <Divider className="my-3" />
                
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Icon icon="lucide:users" width={14} height={14} className="text-foreground-500" />
                    {/* Эти данные должны приходить с бэкенда или рассчитываться */}
                    <span>{course.id * 3 + 5} учеников</span> 
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon icon="lucide:calendar" width={14} height={14} className="text-foreground-500" />
                    <span>{course.id * 2 + 6} уроков</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
            <Icon icon="lucide:book-x" width={48} height={48} className="text-foreground-400 mx-auto mb-2" />
            <p>Курсы не найдены.</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {/* {editingCourse ? "Редактировать курс" : "Добавить новый курс"} */}
                Добавить новый курс
              </ModalHeader>
              <CourseForm 
                // initialData={editingCourse || {}} 
                onSubmit={handleCreateCourse} // Нужна будет и handleUpdateCourse
                onClose={() => {
                  // setEditingCourse(null);
                  onClose();
                }}
                isLoading={isSubmitting}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  );
};

export default AdminCourses;