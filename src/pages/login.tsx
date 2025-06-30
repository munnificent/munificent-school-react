import React from 'react';
import { useHistory, Link as RouteLink, useLocation } from 'react-router-dom';
import { Card, CardBody, Input, Button, Link, Divider } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/auth-context';
import { addToast } from '@heroui/react';
import RequestFormModal from '../components/request-form-modal';

const Login: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { login } = useAuth();
  const history = useHistory();
  const location = useLocation<{ from: Location }>();

  const getRedirectPath = (role: string) => {
    switch (role) {
      case 'admin':
        return '/app/admin/dashboard';
      case 'teacher':
        return '/app/teacher/dashboard';
      case 'student':
      default:
        return '/app/dashboard';
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Пожалуйста, заполните все поля');
      return;
    }
    setIsLoggingIn(true);
    setErrorMessage('');
    try {
      const user = await login(username, password);
      if (user) {
        addToast({
          title: "Успешный вход!",
          description: "Добро пожаловать в личный кабинет.",
          color: "success",
        });
        const { from } = location.state || { from: { pathname: getRedirectPath(user.role) } };
        history.push(from.pathname);
      } else {
        setErrorMessage('Неверное имя пользователя или пароль.');
        addToast({ title: "Ошибка входа", description: "Пожалуйста, проверьте введенные данные.", color: "danger" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage('Произошла ошибка при входе. Попробуйте снова.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-8">
            <Link as={RouteLink} to="/" className="inline-block">
              <div className="flex items-center justify-center gap-2">
                <Icon icon="lucide:graduation-cap" width={40} height={40} className="text-primary" />
                <span className="font-bold text-2xl">Munificent School</span>
              </div>
            </Link>
            <h1 className="mt-6 text-3xl font-bold">Вход в личный кабинет</h1>
            <p className="mt-2 text-foreground-500">Введите свои данные для входа в систему</p>
          </div>
          <Card>
            <CardBody className="p-6">
              {errorMessage && (<div className="mb-4 p-3 bg-danger-50 border border-danger-200 text-danger rounded-lg text-sm">{errorMessage}</div>)}
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <Input label="Имя пользователя" value={username} onValueChange={setUsername} isRequired />
                <Input label="Пароль" value={password} onValueChange={setPassword} type="password" isRequired />
                <Button type="submit" color="primary" fullWidth isLoading={isLoggingIn}>Войти</Button>
              </form>
              
              <Divider className="my-6" />
              
              <div className="text-center text-sm">
                <span className="text-foreground-500">Еще нет аккаунта? </span>
                <Link color="primary" href="#" onPress={() => setIsModalOpen(true)}>Оставить заявку</Link>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
      <RequestFormModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default Login;