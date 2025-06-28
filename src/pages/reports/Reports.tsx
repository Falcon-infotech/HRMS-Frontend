import React, { useEffect, useState } from 'react';
import { 
  BarChart as BarChartIcon, PieChart as PieChartIcon, 
  TrendingUp, Users, Download, Calendar, DollarSign 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  getDashboardData, getAttendanceAnalytics, getLeaveAnalytics,
  getPayrollAnalytics, getPerformanceAnalytics, getRecruitmentAnalytics 
} from '../../data/analyticsData';
import PageHeader from '../../components/common/PageHeader';
import { BASE_URL } from '../../constants/api';
import axios from 'axios';
import { FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('overview');

  const dashboardData = getDashboardData();
  const attendanceAnalytics = getAttendanceAnalytics();
  const leaveAnalytics = getLeaveAnalytics();
  const payrollAnalytics = getPayrollAnalytics();
  const performanceAnalytics = getPerformanceAnalytics();
  const recruitmentAnalytics = getRecruitmentAnalytics();

  const COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
   type ErrorState = {
    startDate?: string;
    endDate?: string;
    dateOrder?: string;
  };
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<ErrorState>({
  });
  const [loading, setLoading] = useState(false);




  const Validate = () => {
    const newErrors: {
      startDate?: string,
      endDate?: string
      dateOrder?: string
    } = {}

    if (!startDate) {
      newErrors.startDate = "Please select start date"
    }
    if (!endDate) {
      newErrors.endDate = "Please select end date"
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.dateOrder = " End date should be greater than start date"
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0


  }


  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Validate()) return;
    const token = localStorage.getItem('tokenId')
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/attendance/all_user_attendance_report?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
      }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Attendance_Report_${startDate}_to_${endDate}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStartDate("")
      setEndDate("")
      // const url = response.data;
      // const redirectUrl = url.downloadUrl
      // const fullDownloadUrl = `${BASE_URL}${redirectUrl}`;

      // console.log(fullDownloadUrl)
      // window.open(`${BASE_URL}/api/attendance${redirectUrl}`, "_blank")
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
      
    }
  };
  const handleDownloadLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Validate()) return;
    const token = localStorage.getItem('tokenId')
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/leaves/all_user_leave_report?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
      }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Leave_Report_${startDate}_to_${endDate}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStartDate("")
      setEndDate("")
      // const url = response.data;
      // const redirectUrl = url.downloadUrl
      // const fullDownloadUrl = `${BASE_URL}${redirectUrl}`;

      // console.log(fullDownloadUrl)
      // window.open(`${BASE_URL}/api/attendance${redirectUrl}`, "_blank")
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
      
    }
  };
  const handleDownloadOverview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Validate()) return;
    const token = localStorage.getItem('tokenId')
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/report/over_all_report?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
      }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Overall_Report_${startDate}_to_${endDate}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStartDate("")
      setEndDate("")
      // const url = response.data;
      // const redirectUrl = url.downloadUrl
      // const fullDownloadUrl = `${BASE_URL}${redirectUrl}`;

      // console.log(fullDownloadUrl)
      // window.open(`${BASE_URL}/api/attendance${redirectUrl}`, "_blank")
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
      
    }
  };
  const handleDownloadPayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Validate()) return;
    const token = localStorage.getItem('tokenId')
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/report/all_user_payroll_report?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
      }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Payroll_Report_${startDate}_to_${endDate}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStartDate("")
      setEndDate("")
      // const url = response.data;
      // const redirectUrl = url.downloadUrl
      // const fullDownloadUrl = `${BASE_URL}${redirectUrl}`;

      // console.log(fullDownloadUrl)
      // window.open(`${BASE_URL}/api/attendance${redirectUrl}`, "_blank")
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
      
    }
  };

  return (
    <div className="animate-fade-in">
      {/* <PageHeader
        title="Reports & Analytics"
        description="View detailed reports and analytics"
        actions={
          <button className="btn btn-primary flex items-center">
            <Download size={16} className="mr-1" />
            Export Report
          </button>
        }
      /> */}
      
      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <button 
          className={`p-4 rounded-lg border ${
            selectedReport === 'overview'
              ? 'bg-primary-50 border-primary-200 text-primary-700'
              : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
          }`}
          onClick={() => setSelectedReport('overview')}
        >
          <BarChartIcon className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium">Overview</span>
        </button>

        <button 
          className={`p-4 rounded-lg border ${
            selectedReport === 'attendance'
              ? 'bg-primary-50 border-primary-200 text-primary-700'
              : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
          }`}
          onClick={() => setSelectedReport('attendance')}
        >
          <Calendar className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium">Attendance</span>
        </button>

        <button 
          className={`p-4 rounded-lg border ${
            selectedReport === 'leave'
              ? 'bg-primary-50 border-primary-200 text-primary-700'
              : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
          }`}
          onClick={() => setSelectedReport('leave')}
        >
          <Calendar className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium">Leave</span>
        </button>

        <button 
          className={`p-4 rounded-lg border ${
            selectedReport === 'payroll'
              ? 'bg-primary-50 border-primary-200 text-primary-700'
              : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
          }`}
          onClick={() => setSelectedReport('payroll')}
        >
          <DollarSign className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium">Payroll</span>
        </button>

        <button 
          className={`p-4 rounded-lg border ${
            selectedReport === 'performance'
              ? 'bg-primary-50 border-primary-200 text-primary-700'
              : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
          }`}
          onClick={() => setSelectedReport('performance')}
        >
          <TrendingUp className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium">Performance</span>
        </button>

        <button 
          className={`p-4 rounded-lg border ${
            selectedReport === 'recruitment'
              ? 'bg-primary-50 border-primary-200 text-primary-700'
              : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
          }`}
          onClick={() => setSelectedReport('recruitment')}
        >
          <Users className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium">Recruitment</span>
        </button>
      </div>

      {/* Report Content */}
      {selectedReport === 'overview' && (
        <div className="space-y-6">
           <div className="max-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-full mx-auto bg-white p-8 rounded-3xl shadow-xl"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 flex-wrap mb-6">
                    
                    {/* Left Side: Title & Description */}
                    <div>
                      <h1 className="text-2xl font-bold text-neutral-800"> Attendance Reports</h1>
                      <p className="text-neutral-500 mt-1">View detailed reports and analytics</p>
                    </div>

                    {/* Right Side: Form */}
                    <form
                      onSubmit={handleDownloadOverview}
                      className="w-full md:w-auto flex flex-col sm:flex-row flex-wrap items-start sm:items-end gap-4"
                    >
                      <div className="w-full sm:w-auto">
                        <label className="block text-gray-600 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            setErrors((prev) => ({ ...prev, startDate: "", dateOrder: "" }));
                          }}
                          className={`p-3 border rounded-lg w-full sm:w-48 focus:outline-none transition ${
                            errors?.startDate ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                          }`}
                        />
                        {errors?.startDate && <p className="text-red-500 text-sm mt-1">{errors?.startDate}</p>}
                      </div>

                      <div className="w-full sm:w-auto">
                        <label className="block text-gray-600 mb-1">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            setErrors((prev) => ({ ...prev, endDate: "", dateOrder: "" }));
                          }}
                          className={`p-3 border rounded-lg w-full sm:w-48 focus:outline-none transition ${
                            errors?.endDate || errors?.dateOrder ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                          }`}
                        />
                        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                        {errors.dateOrder && <p className="text-red-500 text-sm mt-1">{errors.dateOrder}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 rounded-full border-blue-400 border-t-yellow-500 animate-spin" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <FiDownload className="text-xl" />
                            Export Report
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </motion.div>
</div>
          {/* Employee Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.departmentDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="department" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.genderDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {dashboardData.genderDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Employee Type and Joining Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Employee Type Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.employeeTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {dashboardData.employeeTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Joining Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.joiningSummary}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'attendance' && (
        <div className="space-y-6">
            <div className="max-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-full mx-auto bg-white p-8 rounded-3xl shadow-xl"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 flex-wrap mb-6">
                    
                    {/* Left Side: Title & Description */}
                    <div>
                      <h1 className="text-2xl font-bold text-neutral-800"> Attendance Reports</h1>
                      <p className="text-neutral-500 mt-1">View detailed reports and analytics</p>
                    </div>

                    {/* Right Side: Form */}
                    <form
                      onSubmit={handleDownload}
                      className="w-full md:w-auto flex flex-col sm:flex-row flex-wrap items-start sm:items-end gap-4"
                    >
                      <div className="w-full sm:w-auto">
                        <label className="block text-gray-600 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            setErrors((prev) => ({ ...prev, startDate: "", dateOrder: "" }));
                          }}
                          className={`p-3 border rounded-lg w-full sm:w-48 focus:outline-none transition ${
                            errors?.startDate ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                          }`}
                        />
                        {errors?.startDate && <p className="text-red-500 text-sm mt-1">{errors?.startDate}</p>}
                      </div>

                      <div className="w-full sm:w-auto">
                        <label className="block text-gray-600 mb-1">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            setErrors((prev) => ({ ...prev, endDate: "", dateOrder: "" }));
                          }}
                          className={`p-3 border rounded-lg w-full sm:w-48 focus:outline-none transition ${
                            errors?.endDate || errors?.dateOrder ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                          }`}
                        />
                        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                        {errors.dateOrder && <p className="text-red-500 text-sm mt-1">{errors.dateOrder}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 rounded-full border-blue-400 border-t-yellow-500 animate-spin" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <FiDownload className="text-xl" />
                            Export Report
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </motion.div>
</div>
          {/* Attendance Rate */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Daily Attendance Rate</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceAnalytics.dailyAttendanceRate}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rate" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Department-wise Attendance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceAnalytics.departmentAttendance}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="department" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rate" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Attendance Status Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Attendance Status Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceAnalytics.attendanceByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {attendanceAnalytics.attendanceByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'leave' && (
        <div className="space-y-6">
          {/* Leave Distribution */}
          <div className="max-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-full mx-auto bg-white p-8 rounded-3xl shadow-xl"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 flex-wrap mb-6">
                    
                    {/* Left Side: Title & Description */}
                    <div>
                      <h1 className="text-2xl font-bold text-neutral-800">Leave Reports & Analytics</h1>
                      <p className="text-neutral-500 mt-1">View detailed reports and analytics</p>
                    </div>

                    {/* Right Side: Form */}
                    <form
                      onSubmit={handleDownloadLeave}
                      className="w-full md:w-auto flex flex-col sm:flex-row flex-wrap items-start sm:items-end gap-4"
                    >
                      <div className="w-full sm:w-auto">
                        <label className="block text-gray-600 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            setErrors((prev) => ({ ...prev, startDate: "", dateOrder: "" }));
                          }}
                          className={`p-3 border rounded-lg w-full sm:w-48 focus:outline-none transition ${
                            errors?.startDate ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                          }`}
                        />
                        {errors?.startDate && <p className="text-red-500 text-sm mt-1">{errors?.startDate}</p>}
                      </div>

                      <div className="w-full sm:w-auto">
                        <label className="block text-gray-600 mb-1">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            setErrors((prev) => ({ ...prev, endDate: "", dateOrder: "" }));
                          }}
                          className={`p-3 border rounded-lg w-full sm:w-48 focus:outline-none transition ${
                            errors?.endDate || errors?.dateOrder ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                          }`}
                        />
                        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                        {errors.dateOrder && <p className="text-red-500 text-sm mt-1">{errors.dateOrder}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 rounded-full border-blue-400 border-t-yellow-500 animate-spin" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <FiDownload className="text-xl" />
                            Export Report
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </motion.div>
            </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Leave Type Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaveAnalytics.leavesByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {leaveAnalytics.leavesByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Department-wise Leave Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leaveAnalytics.leavesByDepartment}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="department" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Monthly Leave Trend */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Leave Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leaveAnalytics.leavesByMonth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'payroll' && (
        <div className="space-y-6">
          {/* Payroll Overview */}
           <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-full mx-auto bg-white p-8 rounded-3xl shadow-xl"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 flex-wrap mb-6">
                    
                    {/* Left Side: Title & Description */}
                    <div>
                      <h1 className="text-2xl font-bold text-neutral-800"> Payroll Reports</h1>
                      <p className="text-neutral-500 mt-1">View detailed reports and analytics</p>
                    </div>

                    {/* Right Side: Form */}
                    <form
                      onSubmit={handleDownloadPayroll}
                      className="w-full md:w-auto flex flex-col sm:flex-row flex-wrap items-start sm:items-end gap-4"
                    >
                      <div className="w-full sm:w-auto">
                        <label className="block text-gray-600 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            setErrors((prev) => ({ ...prev, startDate: "", dateOrder: "" }));
                          }}
                          className={`p-3 border rounded-lg w-full sm:w-48 focus:outline-none transition ${
                            errors?.startDate ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                          }`}
                        />
                        {errors?.startDate && <p className="text-red-500 text-sm mt-1">{errors?.startDate}</p>}
                      </div>

                      <div className="w-full sm:w-auto">
                        <label className="block text-gray-600 mb-1">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            setErrors((prev) => ({ ...prev, endDate: "", dateOrder: "" }));
                          }}
                          className={`p-3 border rounded-lg w-full sm:w-48 focus:outline-none transition ${
                            errors?.endDate || errors?.dateOrder ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                          }`}
                        />
                        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                        {errors.dateOrder && <p className="text-red-500 text-sm mt-1">{errors.dateOrder}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 rounded-full border-blue-400 border-t-yellow-500 animate-spin" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <FiDownload className="text-xl" />
                            Export Report
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Payroll Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payrollAnalytics.totalPayroll}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Department-wise Payroll</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payrollAnalytics.departmentPayroll}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="department" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Salary Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Salary Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={payrollAnalytics.salaryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {payrollAnalytics.salaryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'performance' && (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Department-wise Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceAnalytics.averageRatingByDepartment}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="department" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="rating" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceAnalytics.ratingDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {performanceAnalytics.ratingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Goal Completion */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Goal Completion Rate by Department</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceAnalytics.goalCompletionRate}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="department" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'recruitment' && (
        <div className="space-y-6">
          {/* Recruitment Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Applications by Job</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={recruitmentAnalytics.applicationsByJob}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="job" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />

                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Applications by Source</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={recruitmentAnalytics.applicationsBySource}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {recruitmentAnalytics.applicationsBySource.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Hiring Trend */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Hiring Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recruitmentAnalytics.hiringTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;



// import React, { useState } from 'react';
// import { FiDownload } from 'react-icons/fi';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import { BASE_URL } from '../../constants/api';

// const Reports = () => {


  // type ErrorState = {
  //   startDate?: string;
  //   endDate?: string;
  //   dateOrder?: string;
  // };
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  // const [errors, setErrors] = useState<ErrorState>({
  // });
  // const [loading, setLoading] = useState(false);


  // const Validate = () => {
  //   const newErrors: {
  //     startDate?: string,
  //     endDate?: string
  //     dateOrder?: string
  //   } = {}

  //   if (!startDate) {
  //     newErrors.startDate = "Please select start date"
  //   }
  //   if (!endDate) {
  //     newErrors.endDate = "Please select end date"
  //   }

  //   if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
  //     newErrors.dateOrder = " End date should be greater than start date"
  //   }

  //   setErrors(newErrors);

  //   return Object.keys(newErrors).length === 0


  // }


  // const handleDownload = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!Validate()) return;
  //   const token = localStorage.getItem('tokenId')
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       `${BASE_URL}/api/attendance/all_user_attendance_report?startDate=${startDate}&endDate=${endDate}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       responseType: 'blob'
  //     }
  //     );

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute(
  //       "download",
  //       `Attendance_Report_${startDate}_to_${endDate}.xlsx`
  //     );
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     setStartDate("")
  //     setEndDate("")
  //     // const url = response.data;
  //     // const redirectUrl = url.downloadUrl
  //     // const fullDownloadUrl = `${BASE_URL}${redirectUrl}`;

  //     // console.log(fullDownloadUrl)
  //     // window.open(`${BASE_URL}/api/attendance${redirectUrl}`, "_blank")
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false)
      
  //   }
  // };

//   return (
//     <div className="max-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow- xl"
//       >
//         <div className="flex items-center gap-3 mb-6">
//           <FiDownload className="text-blue-600 text-3xl" />
//           <h1 className="text-3xl font-extrabold text-gray-800">Generate  Report</h1>
//         </div>

//         <form onSubmit={handleDownload} className="space-y-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-gray-600 mb-1">Start Date</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => {
//                   setStartDate(e.target.value)
//                   setErrors((prev) => (
//                     { ...prev, startDate: "", dateOrder: "" }
//                   ))
//                 }}
//                 className={`w-full p-3 border rounded-lg focus:outline-none transition ${errors?.startDate ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
//                   }`}
//               />
//               {errors?.startDate && <p className="text-red-500 text-sm mt-1">{errors?.startDate}</p>}
//             </div>
//             <div>
//               <label className="block text-gray-600 mb-1">End Date</label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => {
//                   setEndDate(e.target.value)
//                   setErrors((prev) => ({
//                     ...prev, endDate: "", dateOrder: ""
//                   }))
//                 }}
//                 className={`w-full p-3 border rounded-lg focus:outline-none transition ${errors.endDate || errors.dateOrder ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
//                   }`}
//               />
//               {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
//               {errors.dateOrder && <p className="text-red-500 text-sm mt-1">{errors.dateOrder}</p>}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition transform hover:scale-105 flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className='w-5 h-5 border-2 rounded-full border-blue-400 border-t-yellow-500 animate-spin'>
//                 </div>
//                 <span>Generating...</span>
//               </>
//             ) : (
//               <>
//                 <FiDownload className="text-xl" />
//                 Generate Report
//               </>
//             )}
//           </button>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default Reports;
