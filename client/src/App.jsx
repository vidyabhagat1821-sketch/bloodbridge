import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { HospitalDashboard } from './pages/HospitalDashboard';
import { EmergencyRequestsPage } from './pages/EmergencyRequestsPage';
import { InteractiveMapPage } from './pages/InteractiveMapPage';
import { RAGAssistantPage } from './pages/RAGAssistantPage';
import { KnowledgeManagementPage } from './pages/KnowledgeManagementPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-crimson-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/requests" element={<EmergencyRequestsPage />} />
                  <Route path="/map" element={<InteractiveMapPage />} />
                  <Route path="/assistant" element={<RAGAssistantPage />} />
                  <Route path="/knowledge-admin" element={<KnowledgeManagementPage />} />

                  {/* Protected routes */}
                  <Route
                    path="/donor/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['donor']}>
                        <DonorDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hospital/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['hospital']}>
                        <HospitalDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <ProtectedRoute>
                        <NotificationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
