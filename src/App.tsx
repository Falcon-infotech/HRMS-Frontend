import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layout
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeDetail from './pages/employees/EmployeeDetail';
import EmployeeForm from './pages/employees/EmployeeForm';
import Attendance from './pages/attendance/Attendance';
import AttendanceLog from './pages/attendance/AttendanceLog';
import LeaveManagement from './pages/leave/LeaveManagement';
import ApplyLeave from './pages/leave/ApplyLeave';
import PayrollDashboard from './pages/payroll/PayrollDashboard';
import SalarySlip from './pages/payroll/SalarySlip';
import Performance from './pages/performance/Performance';
import ReviewDetail from './pages/performance/ReviewDetail';
import Jobs from './pages/recruitment/Jobs';
import Candidates from './pages/recruitment/Candidates';
import InterviewSchedule from './pages/recruitment/InterviewSchedule';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';

// Guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Dashboard Routes - Protected */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Employee Management
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/employees/:id" element={<EmployeeDetail />} />
              <Route path="/employees/new" element={<EmployeeForm />} />
              <Route path="/employees/edit/:id" element={<EmployeeForm />} />
               */}
              {/* Attendance */}
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/attendance/log" element={<AttendanceLog />} />

              {/* Leave */}
              <Route path="/leave" element={<LeaveManagement />} />
              <Route path="/leave/apply" element={<ApplyLeave />} />

              {/* Payroll */}
              <Route path="/payroll" element={<PayrollDashboard />} />
              <Route path="/payroll/slip/:id" element={<SalarySlip />} />

              {/* Performance */}
              <Route path="/performance" element={<Performance />} />
              <Route path="/performance/review/:id" element={<ReviewDetail />} />

              {/* Recruitment */}
              <Route path="/recruitment/jobs" element={<Jobs />} />
              <Route path="/recruitment/candidates" element={<Candidates />} />
              <Route path="/recruitment/schedule" element={<InterviewSchedule />} />

              {/* Reports */}
              <Route path="/reports" element={<Reports />} />

              {/* Settings */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route element={<ProtectedRoute requiredRoles={['admin', 'hr']}><DashboardLayout /></ProtectedRoute>}>
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/employees/:id" element={<EmployeeDetail />} />
              <Route path="/employees/new" element={<EmployeeForm />} />
              <Route path="/employees/edit/:id" element={<EmployeeForm />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App