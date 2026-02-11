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
import './index.css';

// Enhanced Home Page Component
const Home = () => (
  <div className="animate-fade-in">
    <div className="py-12 md:py-20 flex flex-col md:flex-row items-center justify-between">
      <div className="md:w-1/2 mb-10 md:mb-0">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Louez n'importe quoi, <br />
          <span className="gradient-text">n'importe quand</span> à Goma.
        </h1>
        <p className="text-xl text-text-muted mb-8 max-w-xl">
          KivuRent connecte les propriétaires de biens avec ceux qui en ont besoin. Simple, sécurisé et local.
        </p>
        <div className="flex space-x-4">
          <button className="btn-primary px-8 py-4 text-lg">Explorer le marketplace</button>
          <button className="glass px-8 py-4 text-lg hover:bg-white/10 transition-colors">En savoir plus</button>
        </div>
      </div>
      <div className="md:w-1/2 flex justify-center">
        <div className="relative w-80 h-80">
          <div className="absolute inset-0 bg-primary blur-[100px] opacity-20 rounded-full"></div>
          <div className="glass w-full h-full relative z-10 flex items-center justify-center">
            <div className="text-8xl">🏠</div>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Nouveautés</h2>
          <p className="text-text-muted">Les derniers objets mis en location à Goma.</p>
        </div>
        <div className="flex gap-2">
          <button className="glass px-4 py-2 text-sm rounded-full bg-primary/20 border-primary text-primary">Tout</button>
          <button className="glass px-4 py-2 text-sm rounded-full hover:bg-white/5">Électronique</button>
          <button className="glass px-4 py-2 text-sm rounded-full hover:bg-white/5">Outillage</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <a href={`/listing/${i}`} key={i} className="glass overflow-hidden group hover:scale-[1.02] transition-transform block">
            <div className="h-48 bg-white/5 relative">
              <div className="absolute inset-0 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                {i === 1 ? '📷' : i === 2 ? '🔨' : '⛺'}
              </div>
              <div className="absolute top-3 right-3 glass px-2 py-1 text-xs font-bold text-primary">Nouveau</div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                {i === 1 ? 'Appareil Photo Sony' : i === 2 ? 'Perceuse Bosch' : 'Tente de Camping'}
              </h3>
              <p className="text-text-muted text-sm mb-4">Location disponible dès aujourd'hui à Goma, Quartier Himbi.</p>
              <div className="flex justify-between items-center">
                <span className="text-primary font-bold text-xl">{i === 1 ? '25$' : i === 2 ? '10$' : '15$'} <span className="text-xs text-text-muted">/ jour</span></span>
                <span className="text-sm font-medium text-text-muted">Détails →</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>


  </div>
);

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
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/delivery/login" element={<DeliveryLogin />} />
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
              <Route path="/delivery/dashboard" element={
                <ProtectedRoute allowedRoles={['delivery', 'admin']}>
                  <DeliveryDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
