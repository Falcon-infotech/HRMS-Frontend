import React, { useEffect } from 'react';
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
import UserDashboard from './pages/dashboard/UserDashboard';
import 'react-datepicker/dist/react-datepicker.css';
import LeaveDetails from './components/LeaveDetails';
import Holiday from './pages/Holidays/Holiday';
import AttendanceStatus from './pages/attendance/AttendanceStatus';
import MyLeaveStatus from './pages/leave/MyLeaveStatus';
import SalarySlipForm from './components/SalarySlipDetails';
import PayslipComponent from './components/PaySlip';
import MySlip from './pages/payroll/MySlip';
import axios from 'axios';
import { BASE_URL } from './constants/api';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { setAccessToken } from './constants/axiosInstance';
import { Braces } from 'lucide-react';
import Branch from './components/Branch';
import DeletedUsers from './components/DeletedUsers';
import DailyReport from './components/DailyReport';
import MyReort from './components/MyReort';
import MyReport from './components/MyReort';
import EmployeesDailyReport from './components/EmployeesDailyReport';
import SingleReport from './components/SingleUserReport';

function App() {
  function clearSelectedLocalStorageAt1159PM(timeZone: any) {
    const now = new Date();


    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const [{ value: year }, , { value: month }, , { value: day }] = formatter.formatToParts(now);
    const targetTime = new Date(`${year}-${month}-${day}T23:59:00`);
    const utcTarget = new Date(targetTime.toLocaleString('en-US', { timeZone: 'UTC' }));
    const userTarget = new Date(utcTarget.toLocaleString('en-US', { timeZone }));

    if (now > userTarget) {
      userTarget.setDate(userTarget.getDate() + 1);
    }

    const delay = userTarget.getTime() - now.getTime();

    setTimeout(() => {
      localStorage.removeItem('hrms_notifications');
      localStorage.removeItem('tokenId');
      localStorage.removeItem('userData');
      localStorage.setItem('lastCleared', new Date().toLocaleDateString("en-US", { timeZone }));

      console.log("Selected localStorage items cleared at 11:59 PM:", timeZone);

      clearSelectedLocalStorageAt1159PM(timeZone); // reschedule
    }, delay);
  }

  useEffect(() => {
    const timeZone = "Asia/Kolkata";

    const lastCleared = localStorage.getItem('lastCleared');
    const today = new Date().toLocaleDateString("en-US", { timeZone });

    if (lastCleared !== today) {
      localStorage.removeItem('hrms_notifications');
      localStorage.removeItem('tokenId');
      localStorage.removeItem('userData');
      localStorage.setItem('lastCleared', today);
    }

    clearSelectedLocalStorageAt1159PM(timeZone);
  }, []);
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    if (token) {
      setAccessToken(token)

      // console.log("first",isatuth)
    }
  }, [token])

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
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              <Route path="/home" element={<UserDashboard />} />

              {/* Employee Management
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/employees/:id" element={<EmployeeDetail />} />
              <Route path="/employees/new" element={<EmployeeForm />} />
              <Route path="/employees/edit/:id" element={<EmployeeForm />} />
               */}
              {/* Attendance */}
              {/* <Route path="/attendance" element={<Attendance />} />
              <Route path="/attendance/log" element={<AttendanceLog />} /> */}



              {/* Leave */}
              {/* <Route path="/leave" element={<LeaveManagement />} /> */}
              <Route path="/leave/apply" element={<ApplyLeave />} />

              {/* Payroll */}
              <Route path="/payroll" element={<PayrollDashboard />} />
              <Route path="/payroll/slips" element={<MySlip />} />
              <Route path="/payroll/slip/:id" element={<SalarySlip />} />
              <Route path="/payroll/addSlip/:id" element={<SalarySlipForm type={"add"} />} />
              <Route path="/payroll/updateSlip/:id" element={<SalarySlipForm type={"update"} />} />
              <Route path="/payslip/:id" element={<PayslipComponent />} />

              {/* Performance */}
              <Route path="/performance" element={<Performance />} />
              <Route path="/performance/review/:id" element={<ReviewDetail />} />

              {/* Recruitment */}
              <Route path="/recruitment/jobs" element={<Jobs />} />
              <Route path="/recruitment/candidates" element={<Candidates />} />
              <Route path="/recruitment/schedule" element={<InterviewSchedule />} />

              {/* Reports */}
              <Route path="/reports" element={<Reports />} />
              <Route path="/dailyreports" element={<MyReport />} />
              <Route path="/createTask" element={<DailyReport />} />
              <Route path="/createTask/:id/:taskid" element={<DailyReport />} />

              <Route
                path="/allEmloyeesTask"
                element={
                  <ProtectedRoute requiredRole={['admin']}>
                    <EmployeesDailyReport />

                  </ProtectedRoute>
                }
              />
              <Route
                path="/allEmloyeesTask/:id"
                element={
                  <ProtectedRoute requiredRole={['admin']}>
                    <SingleReport />

                  </ProtectedRoute>
                }
              />

              {/* Settings */}
              {/* <Route path="/settings" element={<Settings />} /> */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/holidays" element={<Holiday />} />
              <Route path="/attendancestatus" element={<AttendanceStatus />} />
              <Route path="/leavestatus" element={<MyLeaveStatus />} />

            </Route>

            <Route element={<ProtectedRoute requiredRole={['admin', 'hr']}><DashboardLayout /></ProtectedRoute>}>
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/employees/:id" element={<EmployeeDetail />} />
              <Route path="/employees/new" element={<EmployeeForm />} />
              <Route path="/employees/edit/:id" element={<EmployeeForm />} />
              <Route
                path="/branch"
                element={
                  <ProtectedRoute requiredRole={['admin']}>
                    <Branch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/deleted"
                element={
                  <ProtectedRoute requiredRole={['admin']}>
                    <DeletedUsers />
                  </ProtectedRoute>
                }
              />

            </Route>

            <Route element={<ProtectedRoute requiredRole={['admin', 'hr']}><DashboardLayout /></ProtectedRoute>}>
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/attendance/log" element={<AttendanceLog />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leave" element={<LeaveManagement />} />
              <Route path="/leave/:id" element={<LeaveDetails />} />


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