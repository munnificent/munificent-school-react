import React, { useContext, useMemo } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AuthContext } from '../contexts/auth-context';
import { User } from '../types';

// --- Конфигурация навигации ---
const APP_PREFIX = '/app';

const NAV_CONFIG = {
  admin: [
    { name: 'Главная', href: `${APP_PREFIX}/admin/dashboard`, icon: 'lucide:home' },
    { name: 'Пользователи', href: `${APP_PREFIX}/admin/users`, icon: 'lucide:users' },
    { name: 'Ученики', href: `${APP_PREFIX}/admin/students`, icon: 'lucide:graduation-cap' },
    { name: 'Курсы', href: `${APP_PREFIX}/admin/courses`, icon: 'lucide:book-open' },
    { name: 'Заявки', href: `${APP_PREFIX}/admin/requests`, icon: 'lucide:file-text' },
    { name: 'Настройки', href: `${APP_PREFIX}/admin/settings`, icon: 'lucide:settings' },
  ],
  teacher: [
    // Маршруты для учителя
  ],
  student: [
    { name: 'Главная', href: `${APP_PREFIX}/dashboard`, icon: 'lucide:home' },
    { name: 'Мои курсы', href: `${APP_PREFIX}/my-courses`, icon: 'lucide:book-open' },
    { name: 'Тесты', href: `${APP_PREFIX}/tests`, icon: 'lucide:file-check' },
  ],
  common: [
    { name: 'Профиль', href: `${APP_PREFIX}/profile`, icon: 'lucide:user-cog' },
  ],
};

// --- Компоненты ---

// Пункт навигации в боковом меню
const NavItem: React.FC<{ href: string; icon: string; name: string; isActive: boolean; }> = ({ href, icon, name, isActive }) => (
  <Link to={href}>
    <Button
      variant={isActive ? "solid" : "light"}
      color={isActive ? "primary" : "default"}
      className="w-full justify-start text-base"
      startContent={<Icon icon={icon} width="20" />}
    >
      {name}
    </Button>
  </Link>
);

// Меню пользователя в шапке
const UserMenu: React.FC<{ user: User | null; onLogout: () => void; }> = ({ user, onLogout }) => {
  const history = useHistory();
  
  if (!user) return null;

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium">{user.first_name} {user.last_name}</p>
            <p className="text-sm text-foreground-500">{user.role}</p>
          </div>
          <Avatar name={`${user.first_name} ${user.last_name}`} src={user.avatar} />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" onAction={(key) => {
        if (key === 'profile') history.push(`${APP_PREFIX}/profile`);
        if (key === 'logout') onLogout();
      }}>
        <DropdownItem key="profile">Профиль</DropdownItem>
        <DropdownItem key="logout" color="danger">Выйти</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};


// Основной layout личного кабинета
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = useMemo(() => {
    const role = user?.role || 'student';
    const roleSpecificItems = NAV_CONFIG[role as keyof typeof NAV_CONFIG] || [];
    return [...roleSpecificItems, ...NAV_CONFIG.common];
  }, [user?.role]);

  return (
    <div className="flex h-screen bg-background">
      {/* Боковое меню */}
      <aside className="w-64 flex-shrink-0 bg-content1 border-r border-divider p-4 flex flex-col justify-between">
        <div>
          <div className="px-4 mb-8">
            <h1 className="text-2xl font-bold text-primary">Munificent</h1>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavItem 
                key={item.name}
                {...item}
                isActive={location.pathname === item.href}
              />
            ))}
          </nav>
        </div>
        <Button
          variant="flat"
          color="danger"
          className="w-full justify-start text-base"
          startContent={<Icon icon="lucide:log-out" width="20" />}
          onPress={logout}
        >
          Выход
        </Button>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 overflow-y-auto">
        <header className="p-4 border-b border-divider flex justify-end items-center">
          <UserMenu user={user} onLogout={logout} />
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;