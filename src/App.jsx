import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { StudentProfile } from './pages/StudentProfile';
import { FeePayments } from './pages/FeePayments';
import { Attendance } from './pages/Attendance';
import { Classes } from './pages/Classes';
import { Teachers } from './pages/Teachers';
import { Reports } from './pages/Reports';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-905 flex text-slate-800 dark:text-slate-205 transition-colors duration-300">
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
  const { currentUser } = useAcademy();

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Secured Shell Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Administrator', 'Teacher', 'Receptionist']} />}>
        <Route element={<Layout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Student Management */}
          <Route element={<ProtectedRoute allowedRoles={['Administrator', 'Receptionist']} />}>
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/fees" element={<FeePayments />} />
          </Route>

          {/* Attendance Management */}
          <Route path="/attendance" element={<Attendance />} />

          {/* Scheduling Classes */}
          <Route element={<ProtectedRoute allowedRoles={['Administrator', 'Teacher']} />}>
            <Route path="/classes" element={<Classes />} />
            <Route path="/reports" element={<Reports />} />
          </Route>

          {/* Core admin directory teachers */}
          <Route element={<ProtectedRoute allowedRoles={['Administrator']} />}>
            <Route path="/teachers" element={<Teachers />} />
          </Route>

          {/* Shared modules */}
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />

          {/* Catch-all relative */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* Fallback Root Router */}
      <Route
        path="/"
        element={
          currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />
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
