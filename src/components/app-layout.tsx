import React, { useContext } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AuthContext } from "../contexts/auth-context";

// Префикс для всех приватных маршрутов
const APP_PREFIX = '/app';

const adminNavItems = [
  { name: 'Главная', href: `${APP_PREFIX}/admin/dashboard`, icon: 'lucide:home' },
  { name: 'Пользователи', href: `${APP_PREFIX}/admin/users`, icon: 'lucide:users' },
  { name: 'Ученики', href: `${APP_PREFIX}/admin/students`, icon: 'lucide:graduation-cap' },
  { name: 'Курсы', href: `${APP_PREFIX}/admin/courses`, icon: 'lucide:book-open' },
  { name: 'Заявки', href: `${APP_PREFIX}/admin/requests`, icon: 'lucide:file-text' },
  { name: 'Настройки', href: `${APP_PREFIX}/admin/settings`, icon: 'lucide:settings' },
];

const teacherNavItems = [
  // Добавьте маршруты для учителя, если они появятся
];

const studentNavItems = [
  { name: 'Главная', href: `${APP_PREFIX}/dashboard`, icon: 'lucide:home' },
  { name: 'Мои курсы', href: `${APP_PREFIX}/my-courses`, icon: 'lucide:book-open' },
  { name: 'Тесты', href: `${APP_PREFIX}/tests`, icon: 'lucide:file-check' },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const history = useHistory();

  const getNavItems = () => {
    let items = [];
    switch (user?.role) {
      case "admin":
        items = adminNavItems;
        break;
      case "teacher":
        items = teacherNavItems;
        break;
      case "student":
        items = studentNavItems;
        break;
    }
    // Добавляем профиль в конец для всех
    return [...items, { name: 'Профиль', href: `${APP_PREFIX}/profile`, icon: 'lucide:user-cog' }];
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 flex-shrink-0 bg-content1 border-r border-divider p-4 flex flex-col justify-between">
        <div>
          <div className="px-4 mb-8">
            <h1 className="text-2xl font-bold text-primary">Munificent</h1>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={location.pathname === item.href ? "solid" : "light"}
                  color={location.pathname === item.href ? "primary" : "default"}
                  className="w-full justify-start text-base"
                  startContent={<Icon icon={item.icon} width="20" />}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <Button
            variant="flat"
            color="danger"
            className="w-full justify-start text-base"
            startContent={<Icon icon="lucide:log-out" width="20" />}
            onPress={logout}
          >
            Выход
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="p-4 border-b border-divider flex justify-end items-center">
            <Dropdown>
              <DropdownTrigger>
                <button className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                        <p className="text-sm text-foreground-500">{user?.role}</p>
                    </div>
                    <Avatar name={`${user?.first_name} ${user?.last_name}`} src={user?.avatar} />
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions">
                <DropdownItem key="profile" onPress={() => history.push(`${APP_PREFIX}/profile`)}>Профиль</DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={logout}>Выйти</DropdownItem>
              </DropdownMenu>
            </Dropdown>
        </header>
        <div className="p-6">
            {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;