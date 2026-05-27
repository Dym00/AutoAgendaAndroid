import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { MainLayout, AuthLayout } from './components/layout';
import GlobalLoading from './components/common/GlobalLoading';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import AddAppointment from './pages/AddAppointment';
import Inventory from './pages/Inventory';
import AddInventory from './pages/AddInventory';
import Clients from './pages/Clients';
import AddClient from './pages/AddClient';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import Services from './pages/Services';
import AddService from './pages/AddService';
import About from './pages/About';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleStop = () => setIsLoading(false);

    window.addEventListener('global-loading-start', handleStart);
    window.addEventListener('global-loading-stop', handleStop);

    return () => {
      window.removeEventListener('global-loading-start', handleStart);
      window.removeEventListener('global-loading-stop', handleStop);
    };
  }, []);

  useEffect(() => {
    let listener = null;
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (location.pathname === '/dashboard' || location.pathname === '/login' || location.pathname === '/') {
        CapacitorApp.exitApp();
      } else if (canGoBack) {
        navigate(-1);
      } else {
        CapacitorApp.exitApp();
      }
    }).then(handle => {
      listener = handle;
    });

    return () => {
      if (listener) listener.remove();
    };
  }, [location, navigate]);

  return (
    <>
      {isLoading && <GlobalLoading />}
      <Routes>
      {/* Rotas Públicas */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Rotas Privadas (com Navbar) */}
      <Route element={<MainLayout title="AUTOAGENDA" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="clients" element={<Clients />} />
        <Route path="employees" element={<Employees />} />
        <Route path="services" element={<Services />} />
        <Route path="profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Rotas Privadas (sem Navbar - Sub-telas de navegação profunda) */}
      <Route element={<AuthLayout />}>
        <Route path="/appointments/new" element={<AddAppointment />} />
        <Route path="appointments/add" element={<AddAppointment />} />
        <Route path="appointments/edit/:id" element={<AddAppointment />} />
        
        <Route path="/inventory/new" element={<AddInventory />} />
        <Route path="inventory/add" element={<AddInventory />} />
        <Route path="inventory/edit/:id" element={<AddInventory />} />
        
        <Route path="clients/add" element={<AddClient />} />
        <Route path="clients/edit/:id" element={<AddClient />} />
        
        <Route path="employees/add" element={<AddEmployee />} />
        <Route path="employees/edit/:id" element={<AddEmployee />} />
        
        <Route path="services/add" element={<AddService />} />
        <Route path="services/edit/:id" element={<AddService />} />

        <Route path="/notifications" element={<Notifications />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
