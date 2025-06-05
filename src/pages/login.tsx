// src/pages/login.tsx
import React from 'react';
import { useHistory, Link as RouteLink } from 'react-router-dom'; // Redirect удален, так как App.tsx управляет редиректом isAuthenticated
import { Card, CardBody, Input, Button, Link, Divider, addToast } from '@heroui/react'; // CardHeader удален, так как не используется
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/auth-context';
import RequestFormModal from '../components/request-form-modal';

// Компонент с демо-учетными данными остается без изменений
const DemoCredentials = () => {
  return (
    <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
      <h3 className="text-sm font-semibold text-primary mb-2">Демо учетные записи</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-white rounded border border-primary-100">
          <p className="font-medium">Ученик</p>
          <p>Логин: student</p>
          <p>Пароль: 123456</p>
        </div>
        <div className="p-2 bg-white rounded border border-primary-100">
          <p className="font-medium">Преподаватель</p>
          <p>Логин: teacher</p>
          <p>Пароль: 123456</p>
        </div>
        <div className="p-2 bg-white rounded border border-primary-100">
          <p className="font-medium">Администратор</p>
          <p>Логин: admin</p>
          <p>Пароль: 123456</p>
        </div>
      </div>
    </div>
  );
};

const Login: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoggingIn, setIsLoggingIn] = React.useState(false); // Переименовано из auth.isLoading для ясности
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { isAuthenticated, login, user } = useAuth(); // Добавили user для потенциального использования userType при редиректе
  const history = useHistory();

  // React.useEffect для редиректа, если пользователь уже аутентифицирован, остается,
  // но основная логика редиректа после входа теперь будет в App.tsx или здесь, в handleLogin.
  React.useEffect(() => {
    if (isAuthenticated) {
      // Вместо history.push('/') можно сделать более умный редирект,
      // но App.tsx уже должен справляться с этим при изменении isAuthenticated
      // Если App.tsx не перехватывает, можно добавить логику здесь:
      if (user) {
        switch (user.userType) {
          case 'student':
            history.push('/dashboard'); // или специфичный путь студента
            break;
          case 'teacher':
            history.push('/teacher/dashboard');
            break;
          case 'admin':
            history.push('/admin/dashboard');
            break;
          default:
            history.push('/dashboard'); // Общий дашборд или главная для аутентифицированных
            break;
        }
      } else {
        history.push('/dashboard'); // Общий редирект, если user еще не успел обновиться
      }
    }
  }, [isAuthenticated, user, history]);

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Пожалуйста, заполните все поля');
      addToast({ title: "Ошибка валидации", description: "Пожалуйста, заполните все поля.", color: "danger" });
      return;
    }

    setIsLoggingIn(true);
    setErrorMessage('');

    try {
      const success = await login(username, password);
      if (success) {
        addToast({
          title: "Успешный вход",
          description: "Добро пожаловать!", // Сообщение о перенаправлении можно убрать, так как оно произойдет автоматически
          color: "success",
        });
        // Редирект теперь обрабатывается useEffect выше или в App.tsx
        // history.push('/'); // Можно оставить, если нужен явный редирект на общую страницу после логина
      } else {
        // Ошибка уже должна быть обработана в authContext и выведена в консоль authService
        // Здесь мы устанавливаем сообщение для UI
        setErrorMessage('Неверное имя пользователя или пароль.');
        addToast({ title: "Ошибка входа", description: "Неверное имя пользователя или пароль.", color: "danger" });
      }
    } catch (error: any) {
      console.error("Login page error:", error);
      const message = error.message || 'Произошла ошибка при входе. Попробуйте снова.';
      setErrorMessage(message);
      addToast({ title: "Ошибка входа", description: message, color: "danger" });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // handleKeyPress остается без изменений

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <Link as={RouteLink} to="/" className="inline-block">
              <div className="flex items-center justify-center gap-2">
                <Icon icon="lucide:graduation-cap" width={40} height={40} className="text-primary" />
                <span className="font-bold text-2xl">Munificent School</span>
              </div>
            </Link>
            {/* Заголовки остаются без изменений */}
            <h1 className="mt-6 text-3xl font-bold">Вход в личный кабинет</h1>
            <p className="mt-2 text-foreground-500">Введите свои данные для входа в систему</p>
          </div>
          
          <Card>
            <CardBody className="p-6">
              {errorMessage && (
                <div className="mb-4 p-3 bg-danger-50 border border-danger-200 text-danger rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}
              
              <DemoCredentials />
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <Input
                  label="Имя пользователя"
                  placeholder="Введите имя пользователя"
                  value={username}
                  onValueChange={setUsername}
                  isRequired
                  autoComplete="username"
                />
                
                <Input
                  label="Пароль"
                  placeholder="Введите пароль"
                  value={password}
                  onValueChange={setPassword}
                  type="password"
                  isRequired
                  autoComplete="current-password"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                
                {/* Остальная часть формы без изменений */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-divider text-primary focus:ring-primary"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm">
                      Запомнить меня
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <Link color="primary" href="#">
                      Забыли пароль?
                    </Link>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  color="primary"
                  fullWidth
                  isLoading={isLoggingIn} // Используем локальное состояние isLoggingIn
                >
                  Войти
                </Button>
              </form>
              
              <Divider className="my-4" />
              
              <div className="text-center text-sm">
                <span className="text-foreground-500">Еще нет аккаунта? </span>
                <Link 
                  color="primary" 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsModalOpen(true);
                  }}
                >
                  Оставить заявку
                </Link>
              </div>
              
              <div className="mt-6 text-center">
                <Link as={RouteLink} to="/" color="foreground" className="text-sm">
                  <Icon icon="lucide:arrow-left" className="inline mr-1" width={14} height={14} />
                  Вернуться на главную
                </Link>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
      
      <RequestFormModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default Login;