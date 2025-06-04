import React from 'react';
import { 
  Card, 
  CardBody, 
  Input, 
  Button, 
  Avatar, 
  Divider,
  Tabs,
  Tab,
  Select,
  SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { studentName, classOptions } from '../data/mock-data';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState("personal");
  const [selectedClass, setSelectedClass] = React.useState(new Set(["10 класс"]));
  
  // Mock profile data
  const [formData, setFormData] = React.useState({
    name: studentName,
    email: "test@example.com",
    phone: "+7 (777) 123-45-67",
    school: "Гимназия №120",
    parentName: "Асан Тасанов",
    parentPhone: "+7 (777) 765-43-21"
  });
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
    }, 1000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Профиль</h1>
        <p className="text-foreground-500 mt-2">
          Управляйте вашей учетной записью и настройками
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User info card */}
        <Card className="lg:col-span-1">
          <CardBody className="p-6 flex flex-col items-center text-center">
            <Avatar
              src="https://img.heroui.chat/image/avatar?w=200&h=200&u=10"
              className="w-24 h-24 mb-4"
              isBordered
              color="primary"
              showFallback
              name={formData.name}
            />
            
            <h2 className="text-xl font-semibold">{formData.name}</h2>
            <p className="text-foreground-500 mt-1">ID: MS-2023-001</p>
            
            <Divider className="my-4 w-full" />
            
            <div className="w-full flex flex-col gap-2 text-left">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:mail" width={16} height={16} className="text-foreground-500" />
                <span className="text-foreground-500">{formData.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Icon icon="lucide:phone" width={16} height={16} className="text-foreground-500" />
                <span className="text-foreground-500">{formData.phone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Icon icon="lucide:building" width={16} height={16} className="text-foreground-500" />
                <span className="text-foreground-500">{formData.school}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Icon icon="lucide:graduation-cap" width={16} height={16} className="text-foreground-500" />
                <span className="text-foreground-500">{Array.from(selectedClass).join(", ")}</span>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Profile tabs */}
        <Card className="lg:col-span-2">
          <CardBody className="p-0">
            <Tabs 
              selectedKey={selectedTab} 
              onSelectionChange={setSelectedTab as any}
              className="w-full"
              variant="underlined"
            >
              <Tab key="personal" title="Личные данные">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Личные данные</h3>
                    {!isEditing ? (
                      <Button 
                        variant="flat" 
                        color="primary" 
                        startContent={<Icon icon="lucide:edit" width={16} height={16} />}
                        onPress={() => setIsEditing(true)}
                      >
                        Редактировать
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="flat" 
                          color="danger"
                          onPress={() => setIsEditing(false)}
                        >
                          Отмена
                        </Button>
                        <Button 
                          color="primary"
                          onPress={handleSaveProfile}
                          isLoading={isLoading}
                        >
                          Сохранить
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Имя"
                      value={formData.name}
                      onValueChange={(value) => handleInputChange('name', value)}
                      isReadOnly={!isEditing}
                    />
                    
                    <Input
                      label="Email"
                      value={formData.email}
                      onValueChange={(value) => handleInputChange('email', value)}
                      isReadOnly={!isEditing}
                      type="email"
                    />
                    
                    <Input
                      label="Телефон"
                      value={formData.phone}
                      onValueChange={(value) => handleInputChange('phone', value)}
                      isReadOnly={!isEditing}
                      type="tel"
                    />
                    
                    <Input
                      label="Школа"
                      value={formData.school}
                      onValueChange={(value) => handleInputChange('school', value)}
                      isReadOnly={!isEditing}
                    />
                    
                    <Select
                      label="Класс"
                      selectedKeys={selectedClass}
                      onSelectionChange={setSelectedClass as any}
                      isDisabled={!isEditing}
                    >
                      {classOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  
                  <Divider className="my-6" />
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-6">Информация о родителе/опекуне</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="ФИО родителя"
                        value={formData.parentName}
                        onValueChange={(value) => handleInputChange('parentName', value)}
                        isReadOnly={!isEditing}
                      />
                      
                      <Input
                        label="Телефон родителя"
                        value={formData.parentPhone}
                        onValueChange={(value) => handleInputChange('parentPhone', value)}
                        isReadOnly={!isEditing}
                        type="tel"
                      />
                    </div>
                  </div>
                </div>
              </Tab>
              
              <Tab key="security" title="Безопасность">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Изменение пароля</h3>
                  
                  <div className="flex flex-col gap-4 max-w-md">
                    <Input
                      label="Текущий пароль"
                      type="password"
                      placeholder="Введите текущий пароль"
                    />
                    
                    <Input
                      label="Новый пароль"
                      type="password"
                      placeholder="Введите новый пароль"
                    />
                    
                    <Input
                      label="Подтверждение пароля"
                      type="password"
                      placeholder="Подтвердите новый пароль"
                    />
                    
                    <div className="mt-2">
                      <Button color="primary">
                        Изменить пароль
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>
              
              <Tab key="notifications" title="Уведомления">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Настройки уведомлений</h3>
                  
                  <div className="flex flex-col gap-4">
                    <Card>
                      <CardBody className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Напоминания о занятиях</h4>
                            <p className="text-foreground-500 text-sm">Получать напоминания за час до начала занятия</p>
                          </div>
                          <Button color="primary" variant="flat">Включено</Button>
                        </div>
                      </CardBody>
                    </Card>
                    
                    <Card>
                      <CardBody className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Email-уведомления</h4>
                            <p className="text-foreground-500 text-sm">Получать уведомления на email</p>
                          </div>
                          <Button color="primary" variant="flat">Включено</Button>
                        </div>
                      </CardBody>
                    </Card>
                    
                    <Card>
                      <CardBody className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">SMS-уведомления</h4>
                            <p className="text-foreground-500 text-sm">Получать уведомления по SMS</p>
                          </div>
                          <Button variant="flat">Отключено</Button>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};

export default Profile;