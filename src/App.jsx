import React, { useState, useEffect, useContext, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { MainLayout, AuthLayout } from './components/layout';
import GlobalLoading from './components/common/GlobalLoading';
import SplashLoader from './components/common/SplashLoader';
import { AppContext } from './context/AppContext';
import { SplashScreen } from '@capacitor/splash-screen';
import Toast from './components/ui/Toast';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Appointments = lazy(() => import('./pages/Appointments'));
const AddAppointment = lazy(() => import('./pages/AddAppointment'));
const Inventory = lazy(() => import('./pages/Inventory'));
const AddInventory = lazy(() => import('./pages/AddInventory'));
const Clients = lazy(() => import('./pages/Clients'));
const AddClient = lazy(() => import('./pages/AddClient'));
const Employees = lazy(() => import('./pages/Employees'));
const AddEmployee = lazy(() => import('./pages/AddEmployee'));
const Services = lazy(() => import('./pages/Services'));
const AddService = lazy(() => import('./pages/AddService'));
const About = lazy(() => import('./pages/About'));
const Notifications = lazy(() => import('./pages/Notifications'));
import './App.css';

function App() {
  const { user } = useContext(AppContext);
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
    // Esconde a Splash Screen nativa do Android assim que o App monta
    // O SplashLoader (nossa cópia em HTML) já estará visível se necessário
    const hideSplash = async () => {
      try {
        await SplashScreen.hide();
      } catch (err) {
        console.log("SplashScreen plugin não rodando no browser");
      }
    };
    hideSplash();
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
      <Toast />
      <Suspense fallback={<SplashLoader />}>
        <Routes>
          {/* Rotas Públicas */}
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
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
      </Suspense>
    </>
  );
}

export default App;
