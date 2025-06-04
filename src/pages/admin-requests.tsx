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
  Select,
  SelectItem
} from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const AdminRequests: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Mock applications data
  const applications = [
    { id: 1, name: "Айдана Серикова", phone: "+7 (777) 123-45-67", class: "9 класс", subject: "Математика", date: "22.09.2023", status: "new" },
    { id: 2, name: "Алихан Тастанбеков", phone: "+7 (707) 765-43-21", class: "11 класс", subject: "Физика", date: "21.09.2023", status: "contacted" },
    { id: 3, name: "Дарина Жумабаева", phone: "+7 (747) 987-65-43", class: "10 класс", subject: "Казахский язык", date: "20.09.2023", status: "registered" },
    { id: 4, name: "Руслан Ахметов", phone: "+7 (778) 345-67-89", class: "7 класс", subject: "Английский язык", date: "19.09.2023", status: "new" },
    { id: 5, name: "Камила Нурланова", phone: "+7 (701) 234-56-78", class: "8 класс", subject: "Химия", date: "18.09.2023", status: "contacted" },
    { id: 6, name: "Арман Касымов", phone: "+7 (707) 876-54-32", class: "11 класс", subject: "Математика, Физика", date: "17.09.2023", status: "registered" }
  ];
  
  // Filter applications based on search query
  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.class.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="text-3xl font-bold">Заявки</h1>
        <p className="text-foreground-500 mt-2">
          Управление заявками на обучение
        </p>
      </div>
      
      <Card>
        <CardBody className="p-6">
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
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default AdminRequests;