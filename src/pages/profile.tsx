import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardBody, Input, Button, Avatar, Divider, Tabs, Tab, Select, SelectItem, Spinner, addToast } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/auth-context';
import { classOptions } from '../data/mock-data';
import apiClient from '../api/apiClient';
import { User } from '../types';

// --- Типы и константы ---
// Расширяем базовый тип User, чтобы включить вложенный профиль
interface UserProfileData {
  phone?: string;
  school?: string;
  student_class?: string;
  parent_name?: string;
  parent_phone?: string;
  avatar?: string;
}

interface UserWithProfile extends User {
  profile: UserProfileData | null;
}

const CONTENT = {
  title: "Профиль",
  subtitle: "Управляйте вашей учетной записью и настройками",
  loading: "Загрузка профиля...",
  personalData: "Личные данные",
  security: "Безопасность",
  edit: "Редактировать",
  cancel: "Отмена",
  save: "Сохранить",
  changePass: "Изменить пароль",
  passChanged: "Пароль был изменен.",
  profileUpdated: "Ваш профиль был обновлен.",
  error: "Ошибка",
  saveError: "Не удалось сохранить профиль.",
  passError: "Не удалось изменить пароль.",
};

const INITIAL_FORM_STATE = {
  first_name: '', last_name: '', email: '', phone: '',
  school: '', student_class: '', parent_name: '', parent_phone: '',
};

const INITIAL_PASSWORD_STATE = {
  old_password: '', new_password: '', new_password_confirm: '',
};

// --- Компоненты ---

const UserProfileCard: React.FC<{ user: UserWithProfile }> = ({ user }) => (
  <Card className="lg:col-span-1">
    <CardBody className="p-6 flex flex-col items-center text-center">
      <Avatar src={user.profile?.avatar || ''} className="w-24 h-24 mb-4" isBordered color="primary" showFallback name={`${user.first_name} ${user.last_name}`} />
      <h2 className="text-xl font-semibold">{user.first_name} {user.last_name}</h2>
      <p className="text-foreground-500 mt-1">ID: MS-2023-{user.id}</p>
      <Divider className="my-4 w-full" />
      <div className="w-full flex flex-col gap-2 text-left">
        <div className="flex items-center gap-2"><Icon icon="lucide:mail" width={16} /><span className="text-foreground-500">{user.email}</span></div>
        <div className="flex items-center gap-2"><Icon icon="lucide:phone" width={16} /><span className="text-foreground-500">{user.profile?.phone || 'Не указан'}</span></div>
        <div className="flex items-center gap-2"><Icon icon="lucide:building" width={16} /><span className="text-foreground-500">{user.profile?.school || 'Не указана'}</span></div>
        <div className="flex items-center gap-2"><Icon icon="lucide:graduation-cap" width={16} /><span className="text-foreground-500">{user.profile?.student_class || 'Не указан'}</span></div>
      </div>
    </CardBody>
  </Card>
);

const PersonalDataForm: React.FC<{ onSave: (data: typeof INITIAL_FORM_STATE) => Promise<void>, initialData: typeof INITIAL_FORM_STATE, isSaving: boolean }> = ({ onSave, initialData, isSaving }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);

  useEffect(() => { setFormData(initialData); }, [initialData]);

  const handleInputChange = (field: keyof typeof formData, value: string) => setFormData(p => ({ ...p, [field]: value }));
  const onCancel = () => { setIsEditing(false); setFormData(initialData); };
  const onSaveClick = () => { onSave(formData).then(() => setIsEditing(false)); };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">{CONTENT.personalData}</h3>
        {!isEditing ? (
          <Button variant="flat" color="primary" startContent={<Icon icon="lucide:edit" />} onPress={() => setIsEditing(true)}>{CONTENT.edit}</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="flat" color="danger" onPress={onCancel}>{CONTENT.cancel}</Button>
            <Button color="primary" onPress={onSaveClick} isLoading={isSaving}>{CONTENT.save}</Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Имя" value={formData.first_name} onValueChange={(v) => handleInputChange('first_name', v)} isReadOnly={!isEditing}/>
        <Input label="Фамилия" value={formData.last_name} onValueChange={(v) => handleInputChange('last_name', v)} isReadOnly={!isEditing}/>
        <Input label="Email" value={formData.email} onValueChange={(v) => handleInputChange('email', v)} isReadOnly={!isEditing} type="email"/>
        <Input label="Телефон" value={formData.phone} onValueChange={(v) => handleInputChange('phone', v)} isReadOnly={!isEditing} type="tel"/>
        <Input label="Школа" value={formData.school} onValueChange={(v) => handleInputChange('school', v)} isReadOnly={!isEditing}/>
        <Select label="Класс" selectedKeys={formData.student_class ? [formData.student_class] : []} onSelectionChange={(keys) => handleInputChange('student_class', Array.from(keys as Set<string>)[0] || '')} isDisabled={!isEditing}>
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
  );
};

const SecurityForm: React.FC = () => {
    const [passwordData, setPasswordData] = useState(INITIAL_PASSWORD_STATE);
    const [isSaving, setIsSaving] = useState(false);

    const handlePasswordChange = (field: keyof typeof passwordData, value: string) => setPasswordData(p => ({ ...p, [field]: value }));
    const onSave = async () => {
        setIsSaving(true);
        try {
            await apiClient.post('/users/change-password/', passwordData);
            addToast({ title: "Успешно!", description: CONTENT.passChanged, color: "success" });
            setPasswordData(INITIAL_PASSWORD_STATE);
        } catch (error: any) {
            const errorData = error.response?.data;
            const errorMessage = Object.values(errorData).flat().join(' ') || CONTENT.passError;
            addToast({ title: CONTENT.error, description: errorMessage, color: "danger" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-6">{CONTENT.changePass}</h3>
            <div className="flex flex-col gap-4 max-w-md">
                <Input label="Текущий пароль" type="password" value={passwordData.old_password} onValueChange={(v) => handlePasswordChange('old_password', v)} />
                <Input label="Новый пароль" type="password" value={passwordData.new_password} onValueChange={(v) => handlePasswordChange('new_password', v)} />
                <Input label="Подтверждение пароля" type="password" value={passwordData.new_password_confirm} onValueChange={(v) => handlePasswordChange('new_password_confirm', v)} />
                <div className="mt-2">
                    <Button color="primary" onPress={onSave} isLoading={isSaving}>{CONTENT.changePass}</Button>
                </div>
            </div>
        </div>
    );
};

const Profile: React.FC = () => {
  const { user, isLoading: isAuthLoading, refetchUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Используем useMemo, чтобы избежать лишних пересчетов
  const initialData = useMemo(() => {
    const profile = (user as UserWithProfile)?.profile || {};
    return { ...INITIAL_FORM_STATE, ...user, ...profile };
  }, [user]);

  const handleSaveProfile = useCallback(async (formData: typeof INITIAL_FORM_STATE) => {
    setIsSaving(true);
    const { first_name, last_name, email, ...profileData } = formData;
    const payload = { first_name, last_name, email, profile: profileData };
    try {
      await apiClient.patch('/users/me/', payload);
      addToast({ title: "Успешно!", description: CONTENT.profileUpdated, color: "success" });
      await refetchUser();
    } catch (error) {
      addToast({ title: CONTENT.error, description: CONTENT.saveError, color: "danger" });
    } finally {
      setIsSaving(false);
    }
  }, [refetchUser]);

  if (isAuthLoading || !user) {
    return <div className="flex justify-center items-center h-96"><Spinner size="lg" label={CONTENT.loading} /></div>;
  }
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{CONTENT.title}</h1>
        <p className="text-foreground-500 mt-2">{CONTENT.subtitle}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserProfileCard user={user as UserWithProfile} />
        
        <Card className="lg:col-span-2">
          <CardBody className="p-0">
            <Tabs fullWidth variant="underlined">
              <Tab key="personal" title={CONTENT.personalData}>
                <PersonalDataForm onSave={handleSaveProfile} initialData={initialData} isSaving={isSaving} />
              </Tab>
              <Tab key="security" title={CONTENT.security}>
                <SecurityForm />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};

export default Profile;