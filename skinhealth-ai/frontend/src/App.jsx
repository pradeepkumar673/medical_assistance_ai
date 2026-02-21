import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingOrRedirect from './components/LandingOrRedirect';
import Login from './components/Login';
import Register from './components/Register';
import UserLayout from './components/UserLayout';
import UserDashboard from './components/UserDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AnalysisResult from './components/AnalysisResult';
import ConsultationRequest from './components/ConsultationRequest';
import Payment from './components/Payment';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{ className: 'rounded-xl' }} />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<LandingOrRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRole="user">
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />
          </Route>
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis/:id"
            element={
              <ProtectedRoute allowedRole="user">
                <AnalysisResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consult/:analysisId"
            element={
              <ProtectedRoute allowedRole="user">
                <ConsultationRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRole="user">
                <Payment />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;