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
import Blog from './pages/blog';
import BlogDetail from './pages/blog/blog-detail';
import { useAuth } from './contexts/auth-context';

function App() {
  const { isAuthenticated, userType, isLoading } = useAuth();
  
  // Show loading indicator while checking authentication
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
      {/* Public routes - accessible without authentication */}
      <Route exact path="/">
        {isAuthenticated ? (
          <Redirect to="/dashboard" />
        ) : (
          <LandingPage />
        )}
      </Route>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Login />}
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
      
      {/* Protected routes - require authentication */}
      <Route>
        {isAuthenticated ? (
          <AppLayout userType={userType}>
            <Switch>
              <Route exact path="/dashboard">
                {userType === 'student' && <Dashboard />}
                {userType === 'teacher' && <TeacherDashboard />}
                {userType === 'admin' && <AdminDashboard />}
              </Route>
              <Route exact path="/my-courses">
                <MyCourses />
              </Route>
              <Route path="/my-courses/:id">
                <CourseDetail />
              </Route>
              <Route path="/test-simulator">
                <TestSimulator />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route path="/students">
                {userType === 'teacher' && <TeacherStudents />}
                {userType === 'admin' && <AdminStudents />}
              </Route>
              <Route path="/users">
                <AdminUsers />
              </Route>
              <Route path="/courses">
                <AdminCourses />
              </Route>
              <Route path="/requests">
                <AdminRequests />
              </Route>
              <Route path="/settings">
                <AdminSettings />
              </Route>
            </Switch>
          </AppLayout>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      
      {/* Catch-all redirect */}
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

export default App;