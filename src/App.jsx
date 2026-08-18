import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

// Public pages
import HomePage from './pages/HomePage';
import ServiceCataloguePage from './pages/ServiceCataloguePage';
import GovernmentServicePage from './pages/GovernmentServicePage';

// Auth pages
import LoginPage from './pages/dashboard/LoginPage';
import SignupPage from './pages/dashboard/SignupPage';

// Dashboard pages
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import MesobManagerDashboard from './pages/dashboard/MesobManagerDashboard';
import InstitutionManagerDashboard from './pages/dashboard/InstitutionManagerDashboard';
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard';
import ICTStaffDashboard from './pages/dashboard/ICTStaffDashboard'; // file kept, role renamed to technician
import CitizenDashboard from './pages/dashboard/CitizenDashboard';

// Route guard
import RequireAuth from './components/dashboard/RequireAuth';

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/service-catalogue" element={<ServiceCataloguePage />} />
          <Route path="/government-service" element={<GovernmentServicePage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Dashboards */}
          <Route
            path="/dashboard/super-admin"
            element={
              <RequireAuth allowedRoles={['super_admin']}>
                <SuperAdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/mesob-manager"
            element={
              <RequireAuth allowedRoles={['mesob_manager']}>
                <MesobManagerDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/institution-manager"
            element={
              <RequireAuth allowedRoles={['institution_manager']}>
                <InstitutionManagerDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/employee"
            element={
              <RequireAuth allowedRoles={['employee']}>
                <EmployeeDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/technician"
            element={
              <RequireAuth allowedRoles={['technician']}>
                <ICTStaffDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/citizen"
            element={
              <RequireAuth allowedRoles={['citizen']}>
                <CitizenDashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </AppProvider>
  );
}
