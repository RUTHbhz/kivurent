import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import DeliveryLogin from './pages/DeliveryLogin';
import Signup from './pages/Signup';
import OffererDashboard from './pages/OffererDashboard';
import CreateListing from './pages/CreateListing';
import ListingDetails from './pages/ListingDetails';
import DeliveryDashboard from './pages/DeliveryDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DashboardLayout from './components/Layout/DashboardLayout';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }} />
          <Routes>
            {/* Admin Space - Detached */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout role="admin">
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Delivery Space - Detached */}
            <Route path="/delivery/login" element={<DeliveryLogin />} />
            <Route path="/delivery/*" element={
              <ProtectedRoute allowedRoles={['delivery', 'admin']}>
                <DashboardLayout role="delivery">
                  <Routes>
                    <Route path="dashboard" element={<DeliveryDashboard />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Public / Customer / Offerer Space */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/offerer/dashboard" element={
                    <ProtectedRoute allowedRoles={['offerer', 'admin']}>
                      <OffererDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/offerer/create-listing" element={
                    <ProtectedRoute allowedRoles={['offerer', 'admin']}>
                      <CreateListing />
                    </ProtectedRoute>
                  } />
                  <Route path="/listing/:id" element={<ListingDetails />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
