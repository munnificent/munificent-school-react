// admin-dashboard.tsx
import React from 'react';
import { 
  Card, 
  CardBody, 
  Button, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Tabs,
  Tab,
  Input,
  Select,
  SelectItem,
  Chip,
  Divider,
  Switch,
  DatePicker,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { courses } from '../data/mock-data';

// Add custom useDisclosure hook since it's not being imported properly
const useDisclosure = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const onOpen = React.useCallback(() => {
    setIsOpen(true);
  }, []);
  
  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, []);
  
  const onOpenChange = React.useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);
  
  return {
    isOpen,
    onOpen,
    onClose,
    onOpenChange
  };
};

const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState("applications");
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Mock data for admin dashboard
  const applications = [
    { id: 1, name: "Айдана Серикова", phone: "+7 (777) 123-45-67", class: "9 класс", subject: "Математика", date: "22.09.2023", status: "new" },
    { id: 2, name: "Алихан Тастанбеков", phone: "+7 (707) 765-43-21", class: "11 класс", subject: "Физика", date: "21.09.2023", status: "contacted" },
    { id: 3, name: "Дарина Жумабаева", phone: "+7 (747) 987-65-43", class: "10 класс", subject: "Казахский язык", date: "20.09.2023", status: "registered" },
    { id: 4, name: "Руслан Ахметов", phone: "+7 (778) 345-67-89", class: "7 класс", subject: "Английский язык", date: "19.09.2023", status: "new" },
    { id: 5, name: "Камила Нурланова", phone: "+7 (701) 234-56-78", class: "8 класс", subject: "Химия", date: "18.09.2023", status: "contacted" },
    { id: 6, name: "Арман Касымов", phone: "+7 (707) 876-54-32", class: "11 класс", subject: "Математика, Физика", date: "17.09.2023", status: "registered" }
  ];
  
  const students = [
    { id: 101, name: "Ескендыр Маратов", class: "10 класс", subjects: ["Математика", "Физика"], balance: 45000, status: "active" },
    { id: 102, name: "Асель Кенжебаева", class: "11 класс", subjects: ["Биология", "Химия", "Казахский язык"], balance: 0, status: "inactive" },
    { id: 103, name: "Бауыржан Алиев", class: "9 класс", subjects: ["История", "География"], balance: 15000, status: "active" },
    { id: 104, name: "Дана Сатпаева", class: "8 класс", subjects: ["Математика"], balance: 22500, status: "active" },
    { id: 105, name: "Тимур Ахметов", class: "11 класс", subjects: ["Физика", "Информатика", "Английский язык"], balance: -7500, status: "debt" }
  ];
  
  const teachers = [
    { id: 201, name: "Айгерим Нурсултанова", subjects: ["Математика", "Физика"], students: 32, rating: 4.9 },
    { id: 202, name: "Данияр Серикулы", subjects: ["Физика", "Информатика"], students: 28, rating: 4.7 },
    { id: 203, name: "Алия Касымова", subjects: ["Казахский язык", "Литература"], students: 36, rating: 4.8 },
    { id: 204, name: "Арман Токаев", subjects: ["История", "География"], students: 24, rating: 4.6 }
  ];
  
  // Filter data based on search query
  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.class.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.subjects.some(subj => subj.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subjects.some(subj => subj.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Helper function for status display
  const getStatusChip = (status: string) => {
    let color = "default";
    let label = "";
    
    switch(status) {
      case "new":
        color = "primary";
        label = "Новая";
        break;
      case "contacted":
        color = "warning";
        label = "На связи";
        break;
      case "registered":
        color = "success";
        label = "Оформлен";
        break;
      case "active":
        color = "success";
        label = "Активен";
        break;
      case "inactive":
        color = "default";
        label = "Неактивен";
        break;
      case "debt":
        color = "danger";
        label = "Задолженность";
        break;
    }
    
    return (
      <Chip color={color as any} variant="flat" size="sm">
        {label}
      </Chip>
    );
  };
  
  const { isOpen: isPaymentModalOpen, onOpen: onOpenPaymentModal, onOpenChange: onPaymentModalOpenChange } = useDisclosure();
  const { isOpen: isScheduleModalOpen, onOpen: onOpenScheduleModal, onOpenChange: onScheduleModalOpenChange } = useDisclosure();
  const { isOpen: isSettingsModalOpen, onOpen: onOpenSettingsModal, onOpenChange: onSettingsModalOpenChange } = useDisclosure();
  const [selectedPaymentId, setSelectedPaymentId] = React.useState<number | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = React.useState<number | null>(null);
  
  // New mock data
  const payments = [
    { id: 501, student: "Ескендыр Маратов", amount: 45000, date: "05.09.2023", status: "paid", method: "bank_transfer" },
    { id: 502, student: "Асель Кенжебаева", amount: 35000, date: "02.09.2023", status: "pending", method: "cash" },
    { id: 503, student: "Бауыржан Алиев", amount: 30000, date: "10.09.2023", status: "paid", method: "card" },
    { id: 504, student: "Дана Сатпаева", amount: 22500, date: "15.09.2023", status: "paid", method: "bank_transfer" },
    { id: 505, student: "Тимур Ахметов", amount: 37500, date: "08.09.2023", status: "overdue", method: "card" },
    { id: 506, student: "Алина Бекова", amount: 40000, date: "01.09.2023", status: "paid", method: "cash" }
  ];

  const schedules = [
    { id: 601, subject: "Математика", teacher: "Айгерим Нурсултанова", class: "10 класс", day: "Понедельник", time: "15:30 - 17:00", room: "Кабинет 101", students: 12 },
    { id: 602, subject: "Физика", teacher: "Данияр Серикулы", class: "11 класс", day: "Вторник", time: "16:00 - 17:30", room: "Кабинет 203", students: 10 },
    { id: 603, subject: "Казахский язык", teacher: "Алия Касымова", class: "9 класс", day: "Среда", time: "14:00 - 15:30", room: "Кабинет 105", students: 15 },
    { id: 604, subject: "История", teacher: "Арман Токаев", class: "8 класс", day: "Четверг", time: "15:00 - 16:30", room: "Кабинет 202", students: 8 },
    { id: 605, subject: "Математика", teacher: "Айгерим Нурсултанова", class: "11 класс", day: "Пятница", time: "17:00 - 18:30", room: "Кабинет 101", students: 14 }
  ];

  const reports = [
    { id: 701, title: "Отчет по успеваемости за сентябрь", category: "Успеваемость", date: "30.09.2023", author: "Админ" },
    { id: 702, title: "Финансовый отчет за 3й квартал", category: "Финансы", date: "01.10.2023", author: "Админ" },
    { id: 703, title: "Отчет по посещаемости", category: "Посещаемость", date: "25.09.2023", author: "Админ" },
    { id: 704, title: "Анализ результатов пробного ЕНТ", category: "ЕНТ", date: "20.09.2023", author: "Айгерим Нурсултанова" }
  ];

  const settings = {
    general: {
      schoolName: "Munificent School",
      address: "г. Алматы, ул. Достык 132, БЦ 'Прогресс', офис 401",
      phone: "+7 (777) 123-45-67",
      email: "info@munificentschool.kz"
    },
    notification: {
      emailNotifications: true,
      smsNotifications: true,
      paymentReminders: true,
      classReminders: true
    },
    system: {
      timezone: "Asia/Almaty",
      language: "Русский",
      currency: "KZT"
    }
  };

  // Helper for payment status display
  const getPaymentStatusChip = (status: string) => {
    let color = "default";
    let label = "";
    
    switch(status) {
      case "paid":
        color = "success";
        label = "Оплачено";
        break;
      case "pending":
        color = "warning";
        label = "В обработке";
        break;
      case "overdue":
        color = "danger";
        label = "Просрочено";
        break;
    }
    
    return (
      <Chip color={color as any} variant="flat" size="sm">
        {label}
      </Chip>
    );
  };

  // Helper for payment method display
  const getPaymentMethodLabel = (method: string) => {
    switch(method) {
      case "card": return "Карта";
      case "cash": return "Наличные";
      case "bank_transfer": return "Банковский перевод";
      default: return method;
    }
  };

  // Open payment detail modal
  const handlePaymentClick = (id: number) => {
    setSelectedPaymentId(id);
    onOpenPaymentModal();
  };

  // Open schedule detail modal
  const handleScheduleClick = (id: number) => {
    setSelectedScheduleId(id);
    onOpenScheduleModal();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-foreground-500 mt-2">
          Добро пожаловать в панель управления школой
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Icon icon="lucide:users" width={24} height={24} className="text-primary" />
              </div>
              <div>
                <p className="text-foreground-500 text-sm">Учеников</p>
                <h3 className="text-2xl font-bold">256</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/10">
                <Icon icon="lucide:user-check" width={24} height={24} className="text-success" />
              </div>
              <div>
                <p className="text-foreground-500 text-sm">Преподавателей</p>
                <h3 className="text-2xl font-bold">24</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-secondary/10">
                <Icon icon="lucide:book-open" width={24} height={24} className="text-secondary" />
              </div>
              <div>
                <p className="text-foreground-500 text-sm">Курсов</p>
                <h3 className="text-2xl font-bold">16</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-warning/10">
                <Icon icon="lucide:file-text" width={24} height={24} className="text-warning" />
              </div>
              <div>
                <p className="text-foreground-500 text-sm">Новых заявок</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Main Content */}
      <Card>
        <CardBody className="p-0">
          <Tabs 
            selectedKey={selectedTab} 
            onSelectionChange={setSelectedTab as any}
            className="w-full"
            variant="underlined"
          >
            <Tab 
              key="applications" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:file-text" width={18} height={18} />
                  <span>Заявки</span>
                </div>
              }
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                  <div className="flex-1 max-w-md">
                    <Input
                      placeholder="Поиск заявок..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      startContent={<Icon icon="lucide:search" width={16} height={16} className="text-foreground-500" />}
                      clearable
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select defaultSelectedKeys={["all"]} className="w-40">
                      <SelectItem key="all" value="all">Все статусы</SelectItem>
                      <SelectItem key="new" value="new">Новые</SelectItem>
                      <SelectItem key="contacted" value="contacted">На связи</SelectItem>
                      <SelectItem key="registered" value="registered">Оформленные</SelectItem>
                    </Select>
                    
                    <Button color="primary" startContent={<Icon icon="lucide:plus" width={16} height={16} />}>
                      Добавить
                    </Button>
                  </div>
                </div>
                
                <Table aria-label="Таблица заявок" removeWrapper>
                  <TableHeader>
                    <TableColumn>ИМЯ</TableColumn>
                    <TableColumn>ТЕЛЕФОН</TableColumn>
                    <TableColumn>КЛАСС</TableColumn>
                    <TableColumn>ПРЕДМЕТ</TableColumn>
                    <TableColumn>ДАТА</TableColumn>
                    <TableColumn>СТАТУС</TableColumn>
                    <TableColumn>ДЕЙСТВИЯ</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Заявки не найдены">
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>{app.name}</TableCell>
                        <TableCell>{app.phone}</TableCell>
                        <TableCell>{app.class}</TableCell>
                        <TableCell>{app.subject}</TableCell>
                        <TableCell>{app.date}</TableCell>
                        <TableCell>{getStatusChip(app.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button isIconOnly size="sm" variant="light">
                              <Icon icon="lucide:pencil" width={16} height={16} />
                            </Button>
                            <Button isIconOnly size="sm" variant="light">
                              <Icon icon="lucide:phone" width={16} height={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tab>
            
            <Tab 
              key="students" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:users" width={18} height={18} />
                  <span>Ученики</span>
                </div>
              }
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                  <div className="flex-1 max-w-md">
                    <Input
                      placeholder="Поиск учеников..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      startContent={<Icon icon="lucide:search" width={16} height={16} className="text-foreground-500" />}
                      clearable
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select defaultSelectedKeys={["all"]} className="w-40">
                      <SelectItem key="all" value="all">Все статусы</SelectItem>
                      <SelectItem key="active" value="active">Активные</SelectItem>
                      <SelectItem key="inactive" value="inactive">Неактивные</SelectItem>
                      <SelectItem key="debt" value="debt">С задолженностью</SelectItem>
                    </Select>
                    
                    <Button color="primary" startContent={<Icon icon="lucide:plus" width={16} height={16} />}>
                      Добавить
                    </Button>
                  </div>
                </div>
                
                <Table aria-label="Таблица учеников" removeWrapper>
                  <TableHeader>
                    <TableColumn>ИМЯ</TableColumn>
                    <TableColumn>КЛАСС</TableColumn>
                    <TableColumn>ПРЕДМЕТЫ</TableColumn>
                    <TableColumn>БАЛАНС</TableColumn>
                    <TableColumn>СТАТУС</TableColumn>
                    <TableColumn>ДЕЙСТВИЯ</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Ученики не найдены">
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {student.subjects.map((subject, idx) => (
                              <Chip key={idx} size="sm" variant="flat" color="default">
                                {subject}
                              </Chip>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            student.balance < 0 ? 'text-danger' : 
                            student.balance > 0 ? 'text-success' : 'text-foreground-500'
                          }`}>
                            {student.balance.toLocaleString()} тг
                          </span>
                        </TableCell>
                        <TableCell>{getStatusChip(student.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button isIconOnly size="sm" variant="light">
                              <Icon icon="lucide:pencil" width={16} height={16} />
                            </Button>
                            <Button isIconOnly size="sm" variant="light">
                              <Icon icon="lucide:file-text" width={16} height={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tab>
            
            <Tab 
              key="teachers" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:user-check" width={18} height={18} />
                  <span>Преподаватели</span>
                </div>
              }
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                  <div className="flex-1 max-w-md">
                    <Input
                      placeholder="Поиск преподавателей..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      startContent={<Icon icon="lucide:search" width={16} height={16} className="text-foreground-500" />}
                      clearable
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select defaultSelectedKeys={["all"]} className="w-40">
                      <SelectItem key="all" value="all">Все предметы</SelectItem>
                      <SelectItem key="math" value="math">Математика</SelectItem>
                      <SelectItem key="physics" value="physics">Физика</SelectItem>
                      <SelectItem key="kazakh" value="kazakh">Казахский язык</SelectItem>
                    </Select>
                    
                    <Button color="primary" startContent={<Icon icon="lucide:plus" width={16} height={16} />}>
                      Добавить
                    </Button>
                  </div>
                </div>
                
                <Table aria-label="Таблица преподавателей" removeWrapper>
                  <TableHeader>
                    <TableColumn>ИМЯ</TableColumn>
                    <TableColumn>ПРЕДМЕТЫ</TableColumn>
                    <TableColumn>УЧЕНИКОВ</TableColumn>
                    <TableColumn>РЕЙТИНГ</TableColumn>
                    <TableColumn>ДЕЙСТВИЯ</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Преподаватели не найдены">
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>{teacher.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {teacher.subjects.map((subject, idx) => (
                              <Chip key={idx} size="sm" variant="flat" color="primary">
                                {subject}
                              </Chip>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{teacher.students}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Icon icon="lucide:star" width={16} height={16} className="text-warning" />
                            <span className="font-medium">{teacher.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button isIconOnly size="sm" variant="light">
                              <Icon icon="lucide:pencil" width={16} height={16} />
                            </Button>
                            <Button isIconOnly size="sm" variant="light">
                              <Icon icon="lucide:users" width={16} height={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tab>
            
            <Tab 
              key="courses" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:book-open" width={18} height={18} />
                  <span>Курсы</span>
                </div>
              }
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                  <div className="flex-1 max-w-md">
                    <Input
                      placeholder="Поиск курсов..."
                      startContent={<Icon icon="lucide:search" width={16} height={16} className="text-foreground-500" />}
                      clearable
                    />
                  </div>
                  
                  <Button color="primary" startContent={<Icon icon="lucide:plus" width={16} height={16} />}>
                    Добавить курс
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <Card key={course.id} isPressable>
                      <CardBody className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{course.name}</h3>
                            <p className="text-sm text-foreground-500">{course.teacher.name}</p>
                          </div>
                          <Button isIconOnly size="sm" variant="light">
                            <Icon icon="lucide:more-vertical" width={16} height={16} />
                          </Button>
                        </div>
                        
                        <Divider className="my-3" />
                        
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Icon icon="lucide:users" width={14} height={14} className="text-foreground-500" />
                            <span>12 учеников</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon icon="lucide:calendar" width={14} height={14} className="text-foreground-500" />
                            <span>8 уроков</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </Tab>
            
            <Tab 
              key="finance" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:bar-chart" width={18} height={18} />
                  <span>Финансы</span>
                </div>
              }
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                  <Card className="flex-1">
                    <CardBody className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Доход за сентябрь</h3>
                        <Chip color="success" variant="flat">+12.5%</Chip>
                      </div>
                      <div className="text-3xl font-bold mb-2">4,850,000 тг</div>
                      <p className="text-sm text-foreground-500">По сравнению с 4,312,000 тг в августе</p>
                    </CardBody>
                  </Card>
                  
                  <Card className="flex-1">
                    <CardBody className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Расходы за сентябрь</h3>
                        <Chip color="danger" variant="flat">+4.2%</Chip>
                      </div>
                      <div className="text-3xl font-bold mb-2">2,760,000 тг</div>
                      <p className="text-sm text-foreground-500">По сравнению с 2,650,000 тг в августе</p>
                    </CardBody>
                  </Card>
                  
                  <Card className="flex-1">
                    <CardBody className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Задолженности</h3>
                      </div>
                      <div className="text-3xl font-bold mb-2">365,000 тг</div>
                      <p className="text-sm text-foreground-500">7 учеников с задолженностями</p>
                    </CardBody>
                  </Card>
                </div>
                
                <Card>
                  <CardBody className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-2">Финансовый отчет</h3>
                      <p className="text-foreground-500">Распределение доходов и расходов по категориям</p>
                    </div>
                    
                    <div className="h-64 flex items-center justify-center bg-content3 rounded-lg">
                      <div className="text-center">
                        <Icon icon="lucide:bar-chart-3" width={48} height={48} className="text-foreground-400 mx-auto mb-4" />
                        <p className="text-foreground-500">Здесь будет финансовая диаграмма</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-foreground-500">Платежи за курсы</p>
                        <p className="font-semibold">4,320,000 тг</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground-500">Индивидуальные занятия</p>
                        <p className="font-semibold">530,000 тг</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground-500">Зарплаты</p>
                        <p className="font-semibold">2,150,000 тг</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground-500">Аренда и коммунальные</p>
                        <p className="font-semibold">610,000 тг</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Tab>
            
            <Tab 
              key="payments" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:credit-card" width={18} height={18} />
                  <span>Платежи</span>
                </div>
              }
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                  <div className="flex-1 max-w-md">
                    <Input
                      placeholder="Поиск платежей..."
                      startContent={<Icon icon="lucide:search" width={16} height={16} className="text-foreground-500" />}
                      clearable
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select defaultSelectedKeys={["all"]} className="w-40">
                      <SelectItem key="all" value="all">Все статусы</SelectItem>
                      <SelectItem key="paid" value="paid">Оплаченные</SelectItem>
                      <SelectItem key="pending" value="pending">В обработке</SelectItem>
                      <SelectItem key="overdue" value="overdue">Просроченные</SelectItem>
                    </Select>
                    
                    <DatePicker 
                      placeholder="Выберите месяц"
                      defaultValue={new Date()}
                      granularity="month"
                      className="w-48"
                    />
                    
                    <Button color="primary" startContent={<Icon icon="lucide:plus" width={16} height={16} />}>
                      Новый платеж
                    </Button>
                  </div>
                </div>
                
                <Table aria-label="Таблица платежей" removeWrapper>
                  <TableHeader>
                    <TableColumn>УЧЕНИК</TableColumn>
                    <TableColumn>СУММА</TableColumn>
                    <TableColumn>ДАТА</TableColumn>
                    <TableColumn>СПОСОБ ОПЛАТЫ</TableColumn>
                    <TableColumn>СТАТУС</TableColumn>
                    <TableColumn>ДЕЙСТВИЯ</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Платежи не найдены">
                    {payments.map((payment) => (
                      <TableRow key={payment.id} className="cursor-pointer" onClick={() => handlePaymentClick(payment.id)}>
                        <TableCell>{payment.student}</TableCell>
                        <TableCell>
                          <span className="font-medium">{payment.amount.toLocaleString()} тг</span>
                        </TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{getPaymentMethodLabel(payment.method)}</TableCell>
                        <TableCell>{getPaymentStatusChip(payment.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button isIconOnly size="sm" variant="light">
                              <Icon icon="lucide:printer" width={16} height={16} />
                            </Button>
                            <Button isIconOnly size="sm" variant="light">
                              <Icon icon="lucide:more-vertical" width={16} height={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tab>
            
            <Tab 
              key="schedule" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:calendar" width={18} height={18} />
                  <span>Расписание</span>
                </div>
              }
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                  <div className="flex-1 max-w-md">
                    <Input
                      placeholder="Поиск в расписании..."
                      startContent={<Icon icon="lucide:search" width={16} height={16} className="text-foreground-500" />}
                      clearable
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select defaultSelectedKeys={["all"]} className="w-40">
                      <SelectItem key="all" value="all">Все дни</SelectItem>
                      <SelectItem key="monday" value="monday">Понедельник</SelectItem>
                      <SelectItem key="tuesday" value="tuesday">Вторник</SelectItem>
                      <SelectItem key="wednesday" value="wednesday">Среда</SelectItem>
                      <SelectItem key="thursday" value="thursday">Четверг</SelectItem>
                      <SelectItem key="friday" value="friday">Пятница</SelectItem>
                      <SelectItem key="saturday" value="saturday">Суббота</SelectItem>
                      <SelectItem key="sunday" value="sunday">Воскресенье</SelectItem>
                    </Select>
                    
                    <Button color="primary" startContent={<Icon icon="lucide:plus" width={16} height={16} />}>
                      Добавить занятие
                    </Button>
                  </div>
                </div>
                
                <Table aria-label="Таблица расписания" removeWrapper>
                  <TableHeader>
                    <TableColumn>ПРЕДМЕТ</TableColumn>
                    <TableColumn>ПРЕПОДАВАТЕЛЬ</TableColumn>
                    <TableColumn>КЛАСС</TableColumn>
                    <TableColumn>ДЕНЬ</TableColumn>
                    <TableColumn>ВРЕМЯ</TableColumn>
                    <TableColumn>КАБИНЕТ</TableColumn>
                    <TableColumn>УЧЕНИКОВ</TableColumn>
                    <TableColumn>ДЕЙСТВИЯ</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Занятия не найдены">
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id} className="cursor-pointer" onClick={() => handleScheduleClick(schedule.id)}>
                        <TableCell>{schedule.subject}</TableCell>
                        <TableCell>{schedule.teacher}</TableCell>
                        <TableCell>{schedule.class}</TableCell>
                        <TableCell>{schedule.day}</TableCell>
                        <TableCell>{schedule.time}</TableCell>
                        <TableCell>{schedule.room}</TableCell>
                        <TableCell>{schedule.students}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button isIconOnly size="sm" variant="light">
                              <Icon icon="lucide:pencil" width={16} height={16} />
                            </Button>
                            <Button isIconOnly size="sm" variant="light" color="danger">
                              <Icon icon="lucide:trash-2" width={16} height={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tab>
            
            <Tab 
              key="reports" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:clipboard-list" width={18} height={18} />
                  <span>Отчеты</span>
                </div>
              }
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                  <div className="flex-1 max-w-md">
                    <Input
                      placeholder="Поиск отчетов..."
                      startContent={<Icon icon="lucide:search" width={16} height={16} className="text-foreground-500" />}
                      clearable
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select defaultSelectedKeys={["all"]} className="w-48">
                      <SelectItem key="all" value="all">Все категории</SelectItem>
                      <SelectItem key="attendance" value="attendance">Посещаемость</SelectItem>
                      <SelectItem key="finance" value="finance">Финансы</SelectItem>
                      <SelectItem key="performance" value="performance">Успеваемость</SelectItem>
                      <SelectItem key="ent" value="ent">ЕНТ</SelectItem>
                    </Select>
                    
                    <Button color="primary" startContent={<Icon icon="lucide:plus" width={16} height={16} />}>
                      Создать отчет
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reports.map((report) => (
                    <Card key={report.id} isPressable>
                      <CardBody className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Icon icon="lucide:file-text" width={18} height={18} className="text-primary" />
                              <h3 className="font-semibold">{report.title}</h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground-500">
                              <span>{report.date}</span>
                              <span>•</span>
                              <span>Автор: {report.author}</span>
                            </div>
                          </div>
                          <Chip size="sm" variant="flat" color="primary">{report.category}</Chip>
                        </div>
                        
                        <Divider className="my-3" />
                        
                        <div className="flex justify-between">
                          <Button size="sm" variant="flat" startContent={<Icon icon="lucide:eye" width={14} height={14} />}>
                            Просмотр
                          </Button>
                          <div className="flex gap-1">
                            <Button isIconOnly size="sm" variant="flat">
                              <Icon icon="lucide:download" width={14} height={14} />
                            </Button>
                            <Button isIconOnly size="sm" variant="flat">
                              <Icon icon="lucide:share-2" width={14} height={14} />
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </Tab>
            
            <Tab 
              key="settings" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:settings" width={18} height={18} />
                  <span>Настройки</span>
                </div>
              }
            >
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardBody className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Общие настройки</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium block mb-1">Название школы</label>
                          <Input 
                            defaultValue={settings.general.schoolName} 
                            placeholder="Название школы"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium block mb-1">Адрес</label>
                          <Textarea 
                            defaultValue={settings.general.address} 
                            placeholder="Адрес школы"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium block mb-1">Телефон</label>
                            <Input 
                              defaultValue={settings.general.phone} 
                              placeholder="Телефон школы"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium block mb-1">Email</label>
                            <Input 
                              defaultValue={settings.general.email} 
                              placeholder="Email школы"
                              type="email"
                            />
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button color="primary" onPress={onOpenSettingsModal}>
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardBody className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Уведомления</h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Email-уведомления</h4>
                            <p className="text-foreground-500 text-sm">Отправлять уведомления по email</p>
                          </div>
                          <Switch 
                            defaultSelected={settings.notification.emailNotifications} 
                            color="primary"
                          />
                        </div>
                        
                        <Divider />
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">SMS-уведомления</h4>
                            <p className="text-foreground-500 text-sm">Отправлять уведомления по SMS</p>
                          </div>
                          <Switch 
                            defaultSelected={settings.notification.smsNotifications} 
                            color="primary"
                          />
                        </div>
                        
                        <Divider />
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Напоминания об оплате</h4>
                            <p className="text-foreground-500 text-sm">Отправлять напоминания о необходимости оплаты</p>
                          </div>
                          <Switch 
                            defaultSelected={settings.notification.paymentReminders} 
                            color="primary"
                          />
                        </div>
                        
                        <Divider />
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Напоминания о занятиях</h4>
                            <p className="text-foreground-500 text-sm">Отправлять напоминания о предстоящих занятиях</p>
                          </div>
                          <Switch 
                            defaultSelected={settings.notification.classReminders} 
                            color="primary"
                          />
                        </div>
                        
                        <div className="pt-4">
                          <Button color="primary">
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardBody className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Системные настройки</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium block mb-1">Часовой пояс</label>
                          <Select defaultSelectedKeys={[settings.system.timezone]}>
                            <SelectItem key="Asia/Almaty" value="Asia/Almaty">Алматы (UTC+6)</SelectItem>
                            <SelectItem key="Asia/Nur-Sultan" value="Asia/Nur-Sultan">Астана (UTC+6)</SelectItem>
                            <SelectItem key="Europe/Moscow" value="Europe/Moscow">Москва (UTC+3)</SelectItem>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium block mb-1">Язык системы</label>
                          <Select defaultSelectedKeys={[settings.system.language]}>
                            <SelectItem key="russian" value="russian">Русский</SelectItem>
                            <SelectItem key="kazakh" value="kazakh">Казахский</SelectItem>
                            <SelectItem key="english" value="english">Английский</SelectItem>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium block mb-1">Валюта</label>
                          <Select defaultSelectedKeys={[settings.system.currency]}>
                            <SelectItem key="KZT" value="KZT">Тенге (KZT)</SelectItem>
                            <SelectItem key="USD" value="USD">Доллар США (USD)</SelectItem>
                            <SelectItem key="EUR" value="EUR">Евро (EUR)</SelectItem>
                            <SelectItem key="RUB" value="RUB">Рубль (RUB)</SelectItem>
                          </Select>
                        </div>
                        
                        <div className="pt-4">
                          <Button color="primary">
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardBody className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Управление данными</h3>
                      
                      <div className="space-y-4">
                        <div className="p-4 border border-divider rounded-medium">
                          <h4 className="font-medium mb-2">Экспорт данных</h4>
                          <p className="text-foreground-500 text-sm mb-3">
                            Экспортируйте данные в CSV или Excel формате
                          </p>
                          <div className="flex gap-2">
                            <Button color="primary" variant="flat" startContent={<Icon icon="lucide:file-text" width={16} height={16} />}>
                              Экспорт CSV
                            </Button>
                            <Button color="primary" variant="flat" startContent={<Icon icon="lucide:file-spreadsheet" width={16} height={16} />}>
                              Экспорт Excel
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-divider rounded-medium">
                          <h4 className="font-medium mb-2">Резервное копирование</h4>
                          <p className="text-foreground-500 text-sm mb-3">
                            Создайте резервную копию всех данных системы
                          </p>
                          <Button color="primary" variant="flat" startContent={<Icon icon="lucide:download" width={16} height={16} />}>
                            Создать резервную копию
                          </Button>
                        </div>
                        
                        <div className="p-4 border border-danger-200 bg-danger-50 rounded-medium">
                          <h4 className="font-medium text-danger mb-2">Опасная зона</h4>
                          <p className="text-danger-700 text-sm mb-3">
                            Эти действия невозможно отменить. Будьте осторожны.
                          </p>
                          <Button color="danger" variant="flat" startContent={<Icon icon="lucide:trash-2" width={16} height={16} />}>
                            Очистить все данные
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
      
      {/* Payment Detail Modal */}
      <Modal isOpen={isPaymentModalOpen} onOpenChange={onPaymentModalOpenChange}>
        <ModalContent>
          {(onClose) => {
            const payment = payments.find(p => p.id === selectedPaymentId);
            
            if (!payment) return null;
            
            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Детали платежа
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-foreground-500">ID платежа:</span>
                      <span className="font-medium">{payment.id}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-foreground-500">Ученик:</span>
                      <span className="font-medium">{payment.student}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-foreground-500">Сумма:</span>
                      <span className="font-bold">{payment.amount.toLocaleString()} тг</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-foreground-500">Дата:</span>
                      <span className="font-medium">{payment.date}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-foreground-500">Способ оплаты:</span>
                      <span>{getPaymentMethodLabel(payment.method)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-foreground-500">Статус:</span>
                      {getPaymentStatusChip(payment.status)}
                    </div>
                    
                    {payment.status === "pending" && (
                      <div className="flex justify-center gap-2 pt-2">
                        <Button color="success" variant="flat">
                          Подтвердить платеж
                        </Button>
                        <Button color="danger" variant="flat">
                          Отклонить платеж
                        </Button>
                      </div>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="flat" onPress={onClose}>
                    Закрыть
                  </Button>
                  <Button color="primary" startContent={<Icon icon="lucide:printer" width={16} height={16} />}>
                    Распечатать квитанцию
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
      
      {/* Schedule Detail Modal */}
      <Modal isOpen={isScheduleModalOpen} onOpenChange={onScheduleModalOpenChange}>
        <ModalContent>
          {(onClose) => {
            const schedule = schedules.find(s => s.id === selectedScheduleId);
            
            if (!schedule) return null;
            
            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Информация о занятии
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Предмет</h4>
                      <Input defaultValue={schedule.subject} />
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Преподаватель</h4>
                      <Select defaultSelectedKeys={[schedule.teacher]}>
                        {teachers.map(teacher => (
                          <SelectItem key={teacher.name} value={teacher.name}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">День недели</h4>
                        <Select defaultSelectedKeys={[schedule.day]}>
                          <SelectItem key="Понедельник" value="Понедельник">Понедельник</SelectItem>
                          <SelectItem key="Вторник" value="Вторник">Вторник</SelectItem>
                          <SelectItem key="Среда" value="Среда">Среда</SelectItem>
                          <SelectItem key="Четверг" value="Четверг">Четверг</SelectItem>
                          <SelectItem key="Пятница" value="Пятница">Пятница</SelectItem>
                          <SelectItem key="Суббота" value="Суббота">Суббота</SelectItem>
                          <SelectItem key="Воскресенье" value="Воскресенье">Воскресенье</SelectItem>
                        </Select>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1">Время</h4>
                        <Input defaultValue={schedule.time} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Класс</h4>
                        <Input defaultValue={schedule.class} />
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1">Кабинет</h4>
                        <Input defaultValue={schedule.room} />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Ученики</h4>
                      <p className="text-sm text-foreground-500">Количество учеников: {schedule.students}</p>
                      <div className="mt-2">
                        <Button size="sm" variant="flat" color="primary">
                          Управление списком учеников
                        </Button>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Отмена
                  </Button>
                  <Button color="primary">
                    Сохранить изменения
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
      
      {/* Settings Saved Modal */}
      <Modal isOpen={isSettingsModalOpen} onOpenChange={onSettingsModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="py-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <Icon icon="lucide:check-circle" className="text-success text-5xl mb-2" />
                  <h3 className="text-xl font-semibold">Настройки сохранены</h3>
                  <p className="text-foreground-500">Изменения успешно применены к системе</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  );
};

export default AdminDashboard;