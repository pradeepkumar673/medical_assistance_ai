import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AnalysisResult from './components/AnalysisResult';
import ConsultationRequest from './components/ConsultationRequest';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
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
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;