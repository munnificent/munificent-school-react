import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/auth-context';
import AppLayout from './components/app-layout';
import { Spinner } from '@heroui/react';

// --- Импорт страниц ---
import LandingPage from './pages/landing-page';
import LoginPage from './pages/login';
import CoursesPage from './pages/courses';
// ... (остальные импорты страниц)
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

const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
      <Spinner size="lg" label="Загрузка..." />
  </div>
);

const AppRoutes: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/app" /> : <LoginPage />}
      </Route>

      {/* Маршруты, которые доступны только авторизованным пользователям */}
      <Route path="/app">
        {isAuthenticated ? (
          <AppLayout>
            <Switch>
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
              {user?.role === 'student' && (
                <>
                  <Route path="/app/dashboard" component={Dashboard} />
                  <Route path="/app/my-courses" component={MyCourses} />
                  <Route path="/app/tests" component={TestSimulator} />
                </>
              )}
              {/* Общие маршруты для всех залогиненных */}
              <Route path="/app/profile" component={Profile} />
              
              {/* Редирект по умолчанию в зависимости от роли */}
              <Redirect to={user?.role === 'admin' ? '/app/admin/dashboard' : '/app/dashboard'} />
            </Switch>
          </AppLayout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      {/* Публичные страницы */}
      <Route path="/">
          {isAuthenticated ? <Redirect to="/app" /> : <LandingPage />}
      </Route>
      {/* Добавьте сюда другие публичные маршруты, если они есть */}
      
    </Switch>
  );
};

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