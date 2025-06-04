import React from 'react';
import { 
  Card, 
  CardBody, 
  Button, 
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch,
  Divider
} from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const AdminSettings: React.FC = () => {
  // Mock settings data
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-foreground-500 mt-2">
          Управление настройками системы
        </p>
      </div>
      
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
                <Button color="primary">
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
    </motion.div>
  );
};

export default AdminSettings;