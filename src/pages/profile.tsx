import React, { useState, useEffect } from 'react';
import { Card, CardBody, Input, Button, Avatar, Divider, Tabs, Tab, Select, SelectItem, Spinner, addToast } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/auth-context';
import { classOptions } from '../data/mock-data';
import apiClient from '../api/apiClient';

type FormData = { first_name: string; last_name: string; email: string; phone: string; school: string; student_class: string; parent_name: string; parent_phone: string; };

const Profile: React.FC = () => {
  const { user, isLoading: isAuthLoading, refetchUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState("personal");

  const [formData, setFormData] = useState<FormData>({ first_name: '', last_name: '', email: '', phone: '', school: '', student_class: '', parent_name: '', parent_phone: '' });
  
  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '', new_password_confirm: '' });
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        school: user.profile?.school || '',
        student_class: user.profile?.student_class || '',
        parent_name: user.profile?.parent_name || '',
        parent_phone: user.profile?.parent_phone || ''
      });
    }
  }, [user]);
  
  const handleInputChange = (field: keyof FormData, value: string) => setFormData(prev => ({ ...prev, [field]: value }));
  const handlePasswordChange = (field: keyof typeof passwordData, value: string) => setPasswordData(prev => ({ ...prev, [field]: value }));
  
  const handleSaveProfile = async () => {
    setIsSaving(true);
    const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        profile: { phone: formData.phone, school: formData.school, student_class: formData.student_class, parent_name: formData.parent_name, parent_phone: formData.parent_phone }
    };
    try {
      await apiClient.patch('/users/me/', payload);
      addToast({ title: "Успешно!", description: "Ваш профиль был обновлен.", color: "success" });
      await refetchUser();
      setIsEditing(false);
    } catch (error) {
      addToast({ title: "Ошибка", description: "Не удалось сохранить профиль.", color: "danger" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
      setIsPasswordSaving(true);
      try {
          await apiClient.post('/users/change-password/', passwordData);
          addToast({ title: "Успешно!", description: "Пароль был изменен.", color: "success" });
          setPasswordData({ old_password: '', new_password: '', new_password_confirm: '' });
      } catch (error: any) {
          const errorData = error.response?.data;
          const errorMessage = Object.values(errorData).flat().join(' ') || "Не удалось изменить пароль.";
          addToast({ title: "Ошибка", description: errorMessage, color: "danger" });
      } finally {
          setIsPasswordSaving(false);
      }
  };

  if (isAuthLoading || !user) return <div className="flex justify-center items-center h-96"><Spinner size="lg" label="Загрузка профиля..." /></div>;
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Профиль</h1>
        <p className="text-foreground-500 mt-2">Управляйте вашей учетной записью и настройками</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardBody className="p-6 flex flex-col items-center text-center">
            <Avatar src={user.profile?.photo_url || ''} className="w-24 h-24 mb-4" isBordered color="primary" showFallback name={`${user.first_name} ${user.last_name}`} />
            <h2 className="text-xl font-semibold">{user.first_name} {user.last_name}</h2>
            <p className="text-foreground-500 mt-1">ID: MS-2023-{user.id}</p>
            <Divider className="my-4 w-full" />
            <div className="w-full flex flex-col gap-2 text-left">
              <div className="flex items-center gap-2"><Icon icon="lucide:mail" width={16} /><span className="text-foreground-500">{user.email}</span></div>
              <div className="flex items-center gap-2"><Icon icon="lucide:phone" width={16} /><span className="text-foreground-500">{formData.phone || 'Не указан'}</span></div>
              <div className="flex items-center gap-2"><Icon icon="lucide:building" width={16} /><span className="text-foreground-500">{formData.school || 'Не указана'}</span></div>
              <div className="flex items-center gap-2"><Icon icon="lucide:graduation-cap" width={16} /><span className="text-foreground-500">{formData.student_class || 'Не указан'}</span></div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardBody className="p-0">
            <Tabs selectedKey={selectedTab} onSelectionChange={setSelectedTab as any} className="w-full" variant="underlined">
              
              {/* ВОССТАНОВЛЕННАЯ ВКЛАДКА */}
              <Tab key="personal" title="Личные данные">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Личные данные</h3>
                    {!isEditing ? (
                      <Button variant="flat" color="primary" startContent={<Icon icon="lucide:edit" width={16} height={16} />} onPress={() => setIsEditing(true)}>
                        Редактировать
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="flat" color="danger" onPress={() => setIsEditing(false)}>Отмена</Button>
                        <Button color="primary" onPress={handleSaveProfile} isLoading={isSaving}>Сохранить</Button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Имя" value={formData.first_name} onValueChange={(v) => handleInputChange('first_name', v)} isReadOnly={!isEditing}/>
                    <Input label="Фамилия" value={formData.last_name} onValueChange={(v) => handleInputChange('last_name', v)} isReadOnly={!isEditing}/>
                    <Input label="Email" value={formData.email} onValueChange={(v) => handleInputChange('email', v)} isReadOnly={!isEditing} type="email"/>
                    <Input label="Телефон" value={formData.phone} onValueChange={(v) => handleInputChange('phone', v)} isReadOnly={!isEditing} type="tel"/>
                    <Input label="Школа" value={formData.school} onValueChange={(v) => handleInputChange('school', v)} isReadOnly={!isEditing}/>
                    <Select label="Класс" selectedKeys={formData.student_class ? new Set([formData.student_class]) : new Set()} onSelectionChange={(keys) => handleInputChange('student_class', Array.from(keys as Set<string>)[0] || '')} isDisabled={!isEditing}>
                      {classOptions.map((option) => (<SelectItem key={option}>{option}</SelectItem>))}
                    </Select>
                  </div>
                  <Divider className="my-6" />
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Информация о родителе/опекуне</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="ФИО родителя" value={formData.parent_name} onValueChange={(v) => handleInputChange('parent_name', v)} isReadOnly={!isEditing}/>
                      <Input label="Телефон родителя" value={formData.parent_phone} onValueChange={(v) => handleInputChange('parent_phone', v)} isReadOnly={!isEditing} type="tel"/>
                    </div>
                  </div>
                </div>
              </Tab>
              
              <Tab key="security" title="Безопасность">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Изменение пароля</h3>
                  <div className="flex flex-col gap-4 max-w-md">
                    <Input label="Текущий пароль" type="password" placeholder="Введите текущий пароль" value={passwordData.old_password} onValueChange={(v) => handlePasswordChange('old_password', v)} />
                    <Input label="Новый пароль" type="password" placeholder="Введите новый пароль" value={passwordData.new_password} onValueChange={(v) => handlePasswordChange('new_password', v)} />
                    <Input label="Подтверждение пароля" type="password" placeholder="Подтвердите новый пароль" value={passwordData.new_password_confirm} onValueChange={(v) => handlePasswordChange('new_password_confirm', v)} />
                    <div className="mt-2">
                      <Button color="primary" onPress={handleChangePassword} isLoading={isPasswordSaving}>Изменить пароль</Button>
                    </div>
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
