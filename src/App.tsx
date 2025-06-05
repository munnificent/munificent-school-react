// App.tsx
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LandingPage from './pages/landing-page';
import Dashboard from './pages/dashboard';
import MyCourses from './pages/my-courses';
import CourseDetail from './pages/course-detail';
import TestSimulator from './pages/test-simulator';
import Profile from './pages/profile';
import TeacherDashboard from './pages/teacher-dashboard';
import AdminDashboard from './pages/admin-dashboard';
import TeacherStudents from './pages/teacher-students';
import AdminStudents from './pages/admin-students';
import AdminUsers from './pages/admin-users';
import AdminCourses from './pages/admin-courses';
import AdminRequests from './pages/admin-requests';
import AdminSettings from './pages/admin-settings';
import AppLayout from './components/app-layout';
import Login from './pages/login';
import AboutUs from './pages/about-us';
import Courses from './pages/courses';
import Blog from './pages/blog'; // Убедитесь, что это правильный импорт для /src/pages/blog/index.tsx
import BlogDetail from './pages/blog/blog-detail'; // Убедитесь, что это правильный импорт для /src/pages/blog/blog-detail.tsx
import { useAuth } from './contexts/auth-context';

function App() {
  // Получаем isAuthenticated, объект user и isLoading из useAuth()
  const { isAuthenticated, user, isLoading } = useAuth();

  // Индикатор загрузки остается без изменений
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Публичные роуты */}
      <Route exact path="/">
        {isAuthenticated && user ? ( // Проверяем также наличие user
          <Redirect to="/dashboard" />
        ) : (
          <LandingPage />
        )}
      </Route>
      <Route path="/login">
        {isAuthenticated && user ? <Redirect to="/dashboard" /> : <Login />}
      </Route>
      <Route path="/about-us">
        <AboutUs />
      </Route>
      <Route path="/courses">
        <Courses />
      </Route>
      <Route exact path="/blog">
        <Blog />
      </Route>
      <Route path="/blog/:id">
        <BlogDetail />
      </Route>

      {/* Защищенные роуты */}
      <Route> {/* Этот <Route> без path выступает как "обертка" для проверки isAuthenticated */}
        {isAuthenticated && user ? ( // Убеждаемся, что user существует
          // Передаем user.userType в AppLayout
          <AppLayout userType={user.userType}>
            <Switch>
              <Route exact path="/dashboard">
                {/* Используем user.userType для условного рендеринга */}
                {user.userType === 'student' && <Dashboard />}
                {user.userType === 'teacher' && <TeacherDashboard />}
                {user.userType === 'admin' && <AdminDashboard />}
                {/* Можно добавить fallback для случая, если userType не совпал */}
                {user.userType && !['student', 'teacher', 'admin'].includes(user.userType) && (
                    <div>Ошибка: Неизвестный тип пользователя ({user.userType}) для дашборда.</div>
                )}
              </Route>
              <Route exact path="/my-courses">
                <MyCourses />
              </Route>
              <Route path="/my-courses/:id">
                <CourseDetail />
              </Route>
              <Route path="/test-simulator">
                {/* Предполагаем, что доступно студентам, но можно добавить проверку user.userType === 'student' */}
                {user.userType === 'student' ? <TestSimulator /> : <Redirect to="/dashboard" />}
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>

              {/* Роуты для учителя */}
              {user.userType === 'teacher' && (
                <>
                  <Route path="/students"> {/* Общий путь для студентов учителя */}
                    <TeacherStudents />
                  </Route>
                  {/* Другие специфичные роуты для учителя, если они есть под /teacher/... */}
                </>
              )}

              {/* Роуты для администратора */}
              {user.userType === 'admin' && (
                <>
                  <Route path="/users">
                    <AdminUsers />
                  </Route>
                  {/* Путь /courses уже есть как публичный. Для админ-панели курсов у вас admin-courses.tsx */}
                  {/* Если вы хотите отдельный роут для администрирования курсов: */}
                  <Route path="/admin/courses"> {/* Пример: /admin/courses */}
                    <AdminCourses />
                  </Route>
                   <Route path="/admin/students"> {/* Если /students для админа отдельный */}
                    <AdminStudents />
                  </Route>
                  <Route path="/requests">
                    <AdminRequests />
                  </Route>
                  <Route path="/settings">
                    <AdminSettings />
                  </Route>
                </>
              )}
              
              {/* Редирект по умолчанию для аутентифицированных пользователей, если ни один путь не совпал */}
              {/* Этот Redirect должен быть последним внутри Switch для защищенных роутов, если нужен */}
              {/* <Redirect from="*" to="/dashboard" /> */}

            </Switch>
          </AppLayout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      {/* Общий Catch-all redirect, если никакой из вышестоящих роутов не сработал */}
      {/* Убедитесь, что он не конфликтует с логикой защищенных роутов */}
      {/* <Route>
        <Redirect to="/" />
      </Route> */}
    </Switch>
  );
}

export default App;