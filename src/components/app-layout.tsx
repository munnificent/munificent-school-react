import React from 'react';
import { Link as RouteLink, useLocation, useHistory } from 'react-router-dom';
import { Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/auth-context';

interface AppLayoutProps {
  children: React.ReactNode;
  userType?: string | null;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, userType }) => {
  const location = useLocation();
  const history = useHistory();
  const { logout } = useAuth();
  
  // Define navigation items based on user type
  const navItems = React.useMemo(() => {
    const baseItems = [
      { path: '/dashboard', label: 'Главная', icon: 'lucide:home' }
    ];
    
    switch (userType) {
      case 'student':
        return [
          ...baseItems,
          { path: '/my-courses', label: 'Мои курсы', icon: 'lucide:book-open' },
          { path: '/test-simulator', label: 'Тесты ЕНТ', icon: 'lucide:clipboard-check' },
          { path: '/profile', label: 'Профиль', icon: 'lucide:user' }
        ];
      case 'teacher':
        return [
          ...baseItems,
          { path: '/my-courses', label: 'Мои курсы', icon: 'lucide:book-open' },
          { path: '/students', label: 'Ученики', icon: 'lucide:users' },
          { path: '/profile', label: 'Профиль', icon: 'lucide:user' }
        ];
      case 'admin':
        return [
          ...baseItems,
          { path: '/users', label: 'Пользователи', icon: 'lucide:users' },
          { path: '/courses', label: 'Курсы', icon: 'lucide:book-open' },
          { path: '/requests', label: 'Заявки', icon: 'lucide:clipboard' },
          { path: '/settings', label: 'Настройки', icon: 'lucide:settings' }
        ];
      default:
        return baseItems;
    }
  }, [userType]);
  
  const handleLogout = () => {
    try {
      logout();
      history.push('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-content1 border-r border-divider hidden md:flex flex-col">
        <div className="p-4 border-b border-divider flex items-center gap-2">
          <Icon icon="lucide:graduation-cap" width={32} height={32} className="text-primary" />
          <span className="font-bold text-xl">Munificent</span>
        </div>
        
        <nav className="flex-1 py-6 px-4">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link 
                    as={RouteLink} 
                    to={item.path}
                    className={`flex items-center gap-2 p-3 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-foreground hover:bg-content2'
                    }`}
                  >
                    <Icon icon={item.icon} width={20} height={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-divider">
          <Button 
            variant="flat" 
            color="danger"
            fullWidth
            onPress={handleLogout}
            startContent={<Icon icon="lucide:log-out" width={18} height={18} />}
          >
            Выход
          </Button>
        </div>
      </aside>
      
      {/* Mobile navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-content1 border-t border-divider md:hidden z-50">
        <div className="flex justify-around p-2">
          {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                as={RouteLink}
                to={item.path}
                className={`flex flex-col items-center p-2 ${
                  isActive ? 'text-primary' : 'text-foreground-500'
                }`}
              >
                <Icon icon={item.icon} width={24} height={24} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Add logout button to mobile navigation */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center p-2 text-danger"
          >
            <Icon icon="lucide:log-out" width={24} height={24} />
            <span className="text-xs mt-1">Выход</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;