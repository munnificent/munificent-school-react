import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/auth-context';
import AppLayout from './components/app-layout';
import { Spinner } from '@heroui/react';

// --- Импорт страниц ---
import LandingPage from './pages/landing-page';
import LoginPage from './pages/login';
import CoursesPage from './pages/courses';
import BlogPage from './pages/blog/index'; 
import AboutUsPage from './pages/about-us'; 
import Dashboard from './pages/dashboard';
import MyCourses from './pages/my-courses';
import TestSimulator from './pages/test-simulator';
import Profile from './pages/profile';
import AdminDashboard from './pages/admin-dashboard';
import AdminUsers from './pages/admin-users';
import AdminStudents from './pages/admin-students';
import AdminCourses from './pages/admin-courses';
import AdminRequests from './pages/admin-requests';
import AdminSettings from './pages/admin-settings';

// --- Компонент экрана загрузки ---
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <Spinner size="lg" label="Загрузка..." />
  </div>
);

// --- Основной компонент с маршрутами ---
const AppRoutes: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Вспомогательный компонент для защиты маршрутов
  const PrivateRoute: React.FC<{ children: React.ReactNode; path: string; exact?: boolean; }> = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render={() =>
          isAuthenticated ? (
            children
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    );
  };

  return (
    <Switch>
      {/* Страница входа */}
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/app" /> : <LoginPage />}
      </Route>

      {/* --- Приватные маршруты (личный кабинет) --- */}
      <PrivateRoute path="/app">
        <AppLayout>
          <Switch>
            {/* Маршруты для администратора */}
            {user?.role === 'admin' && (
              <>
                <Route path="/app/admin/dashboard" component={AdminDashboard} />
                <Route path="/app/admin/users" component={AdminUsers} />
                <Route path="/app/admin/students" component={AdminStudents} />
                <Route path="/app/admin/courses" component={AdminCourses} />
                <Route path="/app/admin/requests" component={AdminRequests} />
                <Route path="/app/admin/settings" component={AdminSettings} />
              </>
            )}

            {/* Маршруты для студента */}
            {user?.role === 'student' && (
              <>
                <Route path="/app/dashboard" component={Dashboard} />
                <Route path="/app/my-courses" component={MyCourses} />
                <Route path="/app/tests" component={TestSimulator} />
              </>
            )}
            
            {/* Общие маршруты для всех авторизованных пользователей */}
            <Route path="/app/profile" component={Profile} />
            
            {/* Перенаправление по умолчанию при входе в /app */}
            <Redirect to={user?.role === 'admin' ? '/app/admin/dashboard' : '/app/dashboard'} />
          </Switch>
        </AppLayout>
      </PrivateRoute>

      {/* --- Публичные маршруты --- */}
      <Route path="/courses" component={CoursesPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/about-us" component={AboutUsPage} />
      <Route path="/" exact component={LandingPage} />

    </Switch>
  );
};

// --- Главный компонент приложения ---
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;