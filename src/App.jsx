import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { EnrollStudent } from './pages/EnrollStudent';
import { StudentProfile } from './pages/StudentProfile';
import { FeePayments } from './pages/FeePayments';
import { Attendance } from './pages/Attendance';
import { Classes } from './pages/Classes';
import { Teachers } from './pages/Teachers';
import { TeacherProfile } from './pages/TeacherProfile';
import { Reports } from './pages/Reports';
import { Notifications } from './pages/Notifications';
import { Contact } from './pages/Contact';
import { ActivateTeacher } from './pages/ActivateTeacher';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import LoadingScreen from './components/LoadingScreen';

// Role Guard Component
const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser, triggerToast } = useAcademy();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Show unauthorized toast and redirect
    setTimeout(() => {
      triggerToast('Unauthorized Access: Your account role does not have authorization for this panel.', 'error');
    }, 100);
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

// Layout Shell Wrapper
const Layout = () => {
  const { currentUser } = useAcademy();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] dark:bg-[#0F172A] flex text-slate-950 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar Nav */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'md:pl-20' : 'md:pl-64'
          }`}
      >
        <Header isCollapsed={isCollapsed} setIsMobileOpen={setIsMobileOpen} />

        {/* Child Pages workspace */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Toast Alert popups */}
      <Toast />
    </div>
  );
};

export const AppContent = () => {
  const { currentUser, isHydrated } = useAcademy();

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/activate" element={currentUser ? <Navigate to="/dashboard" replace /> : <ActivateTeacher />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route path="/contact" element={<Contact />} />

      {/* Secured Shell Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Administrator', 'Teacher', 'Student']} />}>
        <Route element={<Layout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={
            currentUser?.role === 'Teacher'
              ? <TeacherDashboard />
              : currentUser?.role === 'Student'
                ? <StudentDashboard />
                : <Dashboard />
          } />

          <Route element={<ProtectedRoute allowedRoles={['Administrator']} />}>
            <Route path="/students" element={<Students />} />
            <Route path="/students/enroll" element={<EnrollStudent />} />
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/fees" element={<FeePayments />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/teachers/:id" element={<TeacherProfile />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <AcademyProvider>
        <AppContent />
      </AcademyProvider>
    </Router>
  );
}
