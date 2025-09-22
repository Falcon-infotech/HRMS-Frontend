import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Calendar, FileText, DollarSign, Award, Briefcase,
  BarChart2, ArrowRight, TrendingUp, TrendingDown, Clock,
  CheckCircle, XCircle, AlertCircle, MoreVertical, Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { getDashboardData } from '../../data/analyticsData';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import axios from "../../constants/axiosInstance.ts"
import { BASE_URL } from '../../constants/api';
import { departments } from '../../data/employeeData';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState(getDashboardData());
  const [count, setCount] = useState<number | null>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [todayattendanceData, setTodayAttendanceData] = useState<any[]>([]);
  const [activeMetric, setActiveMetric] = useState('attendance');
  const [timeRange, setTimeRange] = useState('week');

  const COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const { user, count: counts } = useSelector((state: RootState) => state.auth)
  const [holidays, setHolidays] = useState([])
  const [todayStats, setTodayStats] = useState(0);
  const [departmentChartData, setDepartmentChartData] = useState([]);
  const [todayTotalattencepie, setTodayTotalattencepie] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  //   let toda = new Date()
  //   let start = new Date(toda)
  //   let end = new Date(toda)

  //   start.setDate(toda.getDate()+1 - start.getDay())
  // console.log(start)
  // Sample data for charts
  const performanceData = [
    { day: 'Mon', productivity: 85, attendance: 92 },
    { day: 'Tue', productivity: 78, attendance: 89 },
    { day: 'Wed', productivity: 90, attendance: 94 },
    { day: 'Thu', productivity: 82, attendance: 87 },
    { day: 'Fri', productivity: 88, attendance: 91 },
    { day: 'Sat', productivity: 76, attendance: 84 },
    { day: 'Sun', productivity: 70, attendance: 79 },
  ];

  useEffect(() => {
    const handlefetch = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${BASE_URL}/api/employee`, {})
        const data = response.data
        setCount(data.data.totalRecords)
        const departmentCount = data?.data?.users?.reduce((acc: any, ele: any) => {
          const dept = ele.department;
          acc[dept] = (acc[dept] || 0) + 1;
          return acc;
        }, {});

        const chartData: any = Object.entries(departmentCount).map(
          ([department, count]) => ({ department, count })
        );

        setDepartmentChartData(chartData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false)
      }
    }
    handlefetch()
  }, [])

  useEffect(() => {
    const todayAttendance = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/attendance/all_users_today_attendance`,)
        const data = response.data.data
        setTodayAttendanceData(data);
      } catch (error) {
        console.error('Error fetching today\'s attendance:', error);
      }
    }
    todayAttendance();
  }, [])

  const fetchHolidays = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/holidays/all_holidays`, {});
      const data = await response.data;
      setHolidays(data.data || [])
    } catch (error) {
      console.error('Error fetching holidays', error);
    }
  }

  useEffect(() => {
    fetchHolidays();
  }, [])

  useEffect(() => {
    const todayAttendace = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/attendance/all_users_today_attendance`, {});
        const data = response.data;
        // console.log(data)
        setTodayStats(data.data.filter((item: any) => item.status == "Present").length);

        const pieChartData = data.data.reduce((acc: any, ele: any) => {
          const count = ele.status;
          acc[count] = (acc[count] || 0) + 1
          return acc;
        }, {})

        // console.log(pieChartData)


        const present = pieChartData['Present'] || 0
        const halfday = pieChartData['Half Day'] || 0
        const absentCount = Math.max(0, count! - (present + halfday));
        pieChartData.Absent = absentCount
        const pie: any = Object.entries(pieChartData).map(([status, count]) => ({
          status,
          count
        }));
        setTodayTotalattencepie(pie)
      } catch (error) {
        console.error('Error fetching today attendance', error);
      }
    };

    todayAttendace();
  }, [count]);

  const today = new Date();
  const upcomingHolidays = holidays?.filter(holiday => {
    const date = new Date(holiday?.date);
    return date > today;
  });
  // console.log(upcomingHolidays[0]?.date)

  const diff = () => {
    if (!upcomingHolidays[0]?.date) return null;

    const today = new Date();
    const holiday = new Date(upcomingHolidays[0].date);

    // Clear the time portion to avoid partial day issues
    today.setHours(0, 0, 0, 0);
    holiday.setHours(0, 0, 0, 0);

    const diffMs = holiday.getTime() - today.getTime(); // difference in milliseconds
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7); // full weeks only

    return diffWeeks;
  };

  // console.log(diff());



  // Filter attendance data based on search query
  const filteredAttendanceData = todayattendanceData.filter(item =>
    item.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const OverviewCard = ({
    title,
    value,
    icon: Icon,
    change,
    changeType = 'positive',
    link,
    loading = false
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    link: string;
    loading?: boolean;
  }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          )}

          {change && (
            <div className={`flex items-center mt-2 text-sm ${changeType === 'positive' ? 'text-green-600' :
              changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
              }`}>
              {changeType === 'positive' ? <TrendingUp size={16} className="mr-1" /> :
                changeType === 'negative' ? <TrendingDown size={16} className="mr-1" /> : null}
              <span>{change}</span>
            </div>
          )}
        </div>

        <div className="rounded-xl p-3 bg-blue-50 text-blue-600">
          <Icon size={22} />
        </div>
      </div>

      <Link to={link} className="inline-flex items-center text-blue-600 font-medium text-sm mt-4 hover:text-blue-700 transition-colors">
        View details <ArrowRight size={16} className="ml-1" />
      </Link>
    </div>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    let badgeClass = '';
    let icon = null;

    switch (status) {
      case 'Present':
        badgeClass = 'bg-green-100 text-green-800';
        icon = <CheckCircle size={14} className="mr-1" />;
        break;
      case 'Absent':
        badgeClass = 'bg-red-100 text-red-800';
        icon = <XCircle size={14} className="mr-1" />;
        break;
      case 'Half-day':
        badgeClass = 'bg-yellow-100 text-yellow-800';
        icon = <AlertCircle size={14} className="mr-1" />;
        break;
      case 'Leave':
        badgeClass = 'bg-blue-100 text-blue-800';
        icon = <Clock size={14} className="mr-1" />;
        break;
      default:
        badgeClass = 'bg-gray-100 text-gray-800';
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
        {icon} {status}
      </span>
    );
  };

  return (
    <div className="animate-fade-in pb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold ">Dashboard Overview</h1>
            <p className="text-blue-100 mt-2">Welcome back, {user?.name || user?.first_name} 👋  </p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-sm text-blue-100">Today is </span>
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <OverviewCard
          title="Total Employees"
          value={count || 0}
          icon={Users}
          change="+5% from last month"
          changeType="positive"
          link="/employees"
          loading={loading}
        />
        <OverviewCard
          title="Attendance Today"
          value={count! > 0 ? `${Math.round((todayStats / count!) * 100)}%` : '0%'}
          icon={Calendar}
          change={count! > 0 ? `${todayStats}/${count} present` : 'No data'}
          changeType="positive"
          link="/attendance"
        />
        <OverviewCard
          title="Productivity"
          value="89%"
          icon={TrendingUp}
          change="+2% from yesterday"
          changeType="positive"
          link="/performance"
        />
        <OverviewCard
          title="Upcoming Holidays"
          value={upcomingHolidays.length}
          icon={Award}
          change={`Next holiday in ${diff()} weeks`}
          changeType="positive"
          link="/holidays"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Department Distribution</h3>
            <button className="text-gray-400 hover:text-gray-600 ">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: '#f5f5f5' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar
                  dataKey="count"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Attendance Overview</h3>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 text-xs rounded-full ${timeRange === 'week' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setTimeRange('week')}
              >
                Today
                {/* Week */}
              </button>
              {/* <button 
                className={`px-3 py-1 text-xs rounded-full ${timeRange === 'month' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setTimeRange('month')}
              >
                Month
              </button> */}
            </div>
          </div>
          <div className="h-72">
            {!loading && count !== undefined && todayTotalattencepie.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={todayTotalattencepie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="status"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {todayTotalattencepie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} employees`, 'Count']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ paddingLeft: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-gray-400">Loading attendance data...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Chart and Today's Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Performance Trend</h3>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 text-xs rounded-full ${activeMetric === 'attendance' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveMetric('attendance')}
              >
                Attendance
              </button>
              <button
                className={`px-3 py-1 text-xs rounded-full ${activeMetric === 'productivity' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveMetric('productivity')}
              >
                Productivity
              </button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey={activeMetric === 'attendance' ? 'attendance' : 'productivity'}
                  stroke={activeMetric === 'attendance' ? '#4f46e5' : '#0d9488'}
                  fill={activeMetric === 'attendance' ? 'url(#colorAttendance)' : 'url(#colorProductivity)'}
                  activeDot={{ r: 1 }}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Today's Attendance</h3>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="bg-green-500 w-3 h-3 rounded-full mr-2"></span>
              <span className="mr-4">{todayStats} Present</span>
              <span className="bg-red-500 w-3 h-3 rounded-full mr-2"></span>
              <span>{count ? count - todayStats : 0} Absent</span>
            </div>
          </div>
          <div className="h-72 overflow-y-auto p-2">
            {filteredAttendanceData.length > 0 ? (
              filteredAttendanceData.map((item) => {
                const { user, date, status } = item;
                const email = user.email;
                const emailFirstLetter = email?.charAt(0).toUpperCase();

                return (
                  <div
                    key={user.userId}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm mr-3">
                        {emailFirstLetter}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{email}</p>
                        <p className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <StatusBadge status={status} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <p>No attendance records found</p>
                  <p className="text-sm mt-1">Try adjusting your search</p>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-100 text-center">
            <Link to="/attendance/log" className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center">
              View all attendance records <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming Holidays */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Holidays</h3>
          <Link to="/holidays" className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center">
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingHolidays.slice(0, 3).map((event: any, index) => {
            const dateObj = new Date(event?.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();
            const year = dateObj.getFullYear();

            return (
              <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex flex-col items-center justify-center h-14 w-14 rounded-lg bg-blue-50 text-blue-600 mr-4">
                    <span className="text-xs font-medium uppercase">{month}</span>
                    <span className="text-lg font-bold">{day}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{event?.reason}</p>
                    <p className="text-sm text-gray-500 mt-1">{year}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {upcomingHolidays.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-400">
              <Award size={40} className="mx-auto mb-2 opacity-50" />
              <p>No upcoming holidays</p>
            </div>
          )}
        </div>
      </div>



    </div>
  );
}

export default Dashboard;