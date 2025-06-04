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
  Tabs,
  Tab,
  Select,
  SelectItem
} from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState("all");
  
  // Mock users data
  const users = [
    {
      id: 1,
      name: "Ескендыр Аманов",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=10",
      email: "eskendyr@example.com",
      phone: "+7 (777) 123-45-67",
      role: "student",
      status: "active",
      lastLogin: "Сегодня, 10:15"
    },
    {
      id: 2,
      name: "Айгерим Нурсултанова",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=1",
      email: "aigerim@example.com",
      phone: "+7 (777) 234-56-78",
      role: "teacher",
      status: "active",
      lastLogin: "Вчера, 18:30"
    },
    {
      id: 3,
      name: "Данияр Серикулы",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=2",
      email: "daniyar@example.com",
      phone: "+7 (777) 345-67-89",
      role: "teacher",
      status: "active",
      lastLogin: "Сегодня, 09:45"
    },
    {
      id: 4,
      name: "Алия Сериккызы",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=11",
      email: "aliya@example.com",
      phone: "+7 (777) 456-78-90",
      role: "student",
      status: "inactive",
      lastLogin: "3 дня назад"
    },
    {
      id: 5,
      name: "Арман Токаев",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=4",
      email: "arman@example.com",
      phone: "+7 (777) 567-89-01",
      role: "teacher",
      status: "inactive",
      lastLogin: "Неделю назад"
    },
    {
      id: 6,
      name: "Админ Системы",
      photo: "https://img.heroui.chat/image/avatar?w=200&h=200&u=20",
      email: "admin@example.com",
      phone: "+7 (777) 987-65-43",
      role: "admin",
      status: "active",
      lastLogin: "Сегодня, 08:30"
    }
  ];

  // Filter users based on search query and selected tab
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && user.role === selectedTab;
  });

  // Helper function for role display
  const getRoleChip = (role: string) => {
    let color = "default";
    let label = "";
    
    switch(role) {
      case "admin":
        color = "danger";
        label = "Администратор";
        break;
      case "teacher":
        color = "primary";
        label = "Преподаватель";
        break;
      case "student":
        color = "success";
        label = "Ученик";
        break;
    }
    
    return (
      <Chip color={color as any} variant="flat" size="sm">
        {label}
      </Chip>
    );
  };

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
        <h1 className="text-3xl font-bold">Пользователи</h1>
        <p className="text-foreground-500 mt-2">
          Управление пользователями системы
        </p>
      </div>
      
      <Card>
        <CardBody className="p-0">
          <Tabs 
            selectedKey={selectedTab} 
            onSelectionChange={setSelectedTab as any}
            variant="underlined" 
            aria-label="User tabs"
          >
            <Tab 
              key="all" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:users" width={16} height={16} />
                  <span>Все</span>
                </div>
              }
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                  <div className="flex-1 max-w-md">
                    <Input
                      placeholder="Поиск пользователей..."
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
                    </Select>
                    
                    <Button color="primary" startContent={<Icon icon="lucide:plus" width={16} height={16} />}>
                      Добавить
                    </Button>
                  </div>
                </div>
                
                <Table aria-label="Таблица пользователей" removeWrapper>
                  <TableHeader>
                    <TableColumn>ПОЛЬЗОВАТЕЛЬ</TableColumn>
                    <TableColumn>КОНТАКТЫ</TableColumn>
                    <TableColumn>РОЛЬ</TableColumn>
                    <TableColumn>СТАТУС</TableColumn>
                    <TableColumn>ПОСЛЕДНИЙ ВХОД</TableColumn>
                    <TableColumn>ДЕЙСТВИЯ</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Пользователи не найдены">
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar src={user.photo} size="sm" />
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{user.email}</span>
                            <span className="text-xs text-foreground-500">{user.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleChip(user.role)}</TableCell>
                        <TableCell>{getStatusChip(user.status)}</TableCell>
                        <TableCell>
                          <span className="text-sm">{user.lastLogin}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              aria-label="Редактировать"
                            >
                              <Icon icon="lucide:pencil" width={16} height={16} />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              aria-label="Подробнее"
                            >
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
              key="admin" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:shield" width={16} height={16} />
                  <span>Администраторы</span>
                </div>
              }
            />
            
            <Tab 
              key="teacher" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:user-check" width={16} height={16} />
                  <span>Преподаватели</span>
                </div>
              }
            />
            
            <Tab 
              key="student" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:graduation-cap" width={16} height={16} />
                  <span>Ученики</span>
                </div>
              }
            />
          </Tabs>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default AdminUsers;