import React from 'react';
import { 
  Card, 
  CardBody, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Chip,
  Input,
  Button,
  Avatar,
  Select,
  SelectItem
} from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const AdminStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Mock student data
  const students = [
    { id: 101, name: "Ескендыр Маратов", class: "10 класс", subjects: ["Математика", "Физика"], balance: 45000, status: "active" },
    { id: 102, name: "Асель Кенжебаева", class: "11 класс", subjects: ["Биология", "Химия", "Казахский язык"], balance: 0, status: "inactive" },
    { id: 103, name: "Бауыржан Алиев", class: "9 класс", subjects: ["История", "География"], balance: 15000, status: "active" },
    { id: 104, name: "Дана Сатпаева", class: "8 класс", subjects: ["Математика"], balance: 22500, status: "active" },
    { id: 105, name: "Тимур Ахметов", class: "11 класс", subjects: ["Физика", "Информатика", "Английский язык"], balance: -7500, status: "debt" }
  ];

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.subjects.some(subj => subj.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Helper function for status display
  const getStatusChip = (status: string) => {
    let color = "default";
    let label = "";
    
    switch(status) {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ученики</h1>
        <p className="text-foreground-500 mt-2">
          Управление учениками и их прогрессом
        </p>
      </div>
      
      <Card>
        <CardBody className="p-6">
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
              <TableColumn>УЧЕНИК</TableColumn>
              <TableColumn>КЛАСС</TableColumn>
              <TableColumn>ПРЕДМЕТЫ</TableColumn>
              <TableColumn>БАЛАНС</TableColumn>
              <TableColumn>СТАТУС</TableColumn>
              <TableColumn>ДЕЙСТВИЯ</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Ученики не найдены">
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={student.name} size="sm" />
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
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
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default AdminStudents;