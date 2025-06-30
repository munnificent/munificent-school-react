import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  Button, 
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch,
  Divider,
  Spinner,
  addToast
} from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import apiClient from '../api/apiClient';

interface SettingsData {
  school_name: string;
  address: string;
  phone: string;
  email: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  payment_reminders: boolean;
  class_reminders: boolean;
  timezone: string;
  language: string;
  currency: string;
}

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<SettingsData>('/settings/');
        setSettings(response.data);
      } catch (error) {
        console.error("Failed to fetch settings", error);
        addToast({ title: "Ошибка", description: "Не удалось загрузить настройки", color: "danger" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (field: keyof SettingsData, value: string | boolean) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await apiClient.patch('/settings/', settings);
      addToast({ title: "Успешно", description: "Настройки сохранены", color: "success" });
    } catch (error) {
      console.error("Failed to save settings", error);
      addToast({ title: "Ошибка", description: "Не удалось сохранить настройки", color: "danger" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return <div className="flex justify-center p-8"><Spinner size="lg" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-foreground-500 mt-2">Управление настройками системы</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody className="p-6">
            <h3 className="text-xl font-semibold mb-4">Общие настройки</h3>
            <div className="space-y-4">
              <Input label="Название школы" value={settings.school_name} onValueChange={(v) => handleInputChange('school_name', v)} />
              <Textarea label="Адрес" value={settings.address} onValueChange={(v) => handleInputChange('address', v)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Телефон" value={settings.phone} onValueChange={(v) => handleInputChange('phone', v)} />
                <Input label="Email" type="email" value={settings.email} onValueChange={(v) => handleInputChange('email', v)} />
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-6">
            <h3 className="text-xl font-semibold mb-4">Уведомления</h3>
            <div className="space-y-4">
              <Switch isSelected={settings.email_notifications} onValueChange={(v) => handleInputChange('email_notifications', v)}>Email-уведомления</Switch>
              <Divider />
              <Switch isSelected={settings.sms_notifications} onValueChange={(v) => handleInputChange('sms_notifications', v)}>SMS-уведомления</Switch>
              <Divider />
              <Switch isSelected={settings.payment_reminders} onValueChange={(v) => handleInputChange('payment_reminders', v)}>Напоминания об оплате</Switch>
              <Divider />
              <Switch isSelected={settings.class_reminders} onValueChange={(v) => handleInputChange('class_reminders', v)}>Напоминания о занятиях</Switch>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-6">
            <h3 className="text-xl font-semibold mb-4">Системные настройки</h3>
            <div className="space-y-4">
              <Select label="Часовой пояс" selectedKeys={[settings.timezone]} onSelectionChange={(keys) => handleInputChange('timezone', Array.from(keys as Set<string>)[0])}>
                <SelectItem key="Asia/Almaty">Алматы (UTC+5)</SelectItem>
                <SelectItem key="Asia/Oral">Уральск (UTC+5)</SelectItem>
              </Select>
              <Select label="Язык системы" selectedKeys={[settings.language]} onSelectionChange={(keys) => handleInputChange('language', Array.from(keys as Set<string>)[0])}>
                <SelectItem key="Русский">Русский</SelectItem>
                <SelectItem key="Казахский">Казахский</SelectItem>
                <SelectItem key="Английский">Английский</SelectItem>
              </Select>
              <Select label="Валюта" selectedKeys={[settings.currency]} onSelectionChange={(keys) => handleInputChange('currency', Array.from(keys as Set<string>)[0])}>
                <SelectItem key="KZT">Тенге (KZT)</SelectItem>
                <SelectItem key="USD">Доллар (USD)</SelectItem>
                <SelectItem key="RUB">Рубль (RUB)</SelectItem>
              </Select>
            </div>
          </CardBody>
        </Card>

        <Card>
            <CardBody className="p-6">
                <h3 className="text-xl font-semibold mb-4">Управление данными</h3>
                <div className="space-y-4">
                    <div className="p-4 border border-divider rounded-medium"><h4 className="font-medium mb-2">Экспорт данных</h4><p className="text-foreground-500 text-sm mb-3">Экспортируйте данные в CSV или Excel формате</p><div className="flex gap-2"><Button color="primary" variant="flat" startContent={<Icon icon="lucide:file-text" width={16} height={16}/>}>Экспорт CSV</Button><Button color="primary" variant="flat" startContent={<Icon icon="lucide:file-spreadsheet" width={16} height={16}/>}>Экспорт Excel</Button></div></div>
                    <div className="p-4 border border-divider rounded-medium"><h4 className="font-medium mb-2">Резервное копирование</h4><p className="text-foreground-500 text-sm mb-3">Создайте резервную копию всех данных системы</p><Button color="primary" variant="flat" startContent={<Icon icon="lucide:download" width={16} height={16}/>}>Создать резервную копию</Button></div>
                    <div className="p-4 border border-danger-200 bg-danger-50 rounded-medium"><h4 className="font-medium text-danger mb-2">Опасная зона</h4><p className="text-danger-700 text-sm mb-3">Эти действия невозможно отменить. Будьте осторожны.</p><Button color="danger" variant="flat" startContent={<Icon icon="lucide:trash-2" width={16} height={16}/>}>Очистить все данные</Button></div>
                </div>
            </CardBody>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button color="primary" size="lg" onPress={handleSave} isLoading={isSaving}>Сохранить все изменения</Button>
      </div>
    </motion.div>
  );
};

export default AdminSettings;