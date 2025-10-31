import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Memberships from './pages/Memberships';
import Sessions from './pages/Sessions';
import Bookings from './pages/Bookings';
import Payments from './pages/Payments';
import AdminDashboard from './pages/AdminDashboard';
import AdminBranches from './pages/AdminBranches';
import AdminStudios from './pages/AdminStudios';
import AdminSessions from './pages/AdminSessions';
import AdminCoupons from './pages/AdminCoupons';
import AdminReports from './pages/AdminReports';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/memberships"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Memberships />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Sessions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Payments />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Navbar />
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/branches"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Navbar />
                  <AdminBranches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/studios"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Navbar />
                  <AdminStudios />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sessions"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Navbar />
                  <AdminSessions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/coupons"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Navbar />
                  <AdminCoupons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Navbar />
                  <AdminReports />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="not-found">
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/login">Go to Login</a>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
