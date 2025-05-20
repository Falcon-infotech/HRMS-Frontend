import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Calendar, FileText, DollarSign, Award, Briefcase,
  BarChart2, ArrowRight, TrendingUp, TrendingDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { getDashboardData } from '../../data/analyticsData';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';




// const Home = () => <div className="p-4">🏠 Home Content</div>;
// const Profile = () => <div className="p-4">👤 Profile Content</div>;
// const Settings = () => <div className="p-4">⚙️ Settings Content</div>;
const Dashboard: React.FC = () => {
  // const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(getDashboardData());
  const [activteTab, setActiveTab] = useState('home');
  const [count, setCount] = useState(0);
  //  const renderTabContent = () => {
  //     switch (activeTab) {
  //       case 'home':
  //         return <Home />;
  //       case 'profile':
  //         return <Profile />;
  //       case 'settings':
  //         return <Settings />;
  //       default:
  //         return null;
  //     }
  //   };
  const COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const { user } = useSelector((state: RootState) => state.auth)
  console.log(user)

  useEffect(()=>{
    const handlefetch=async()=>{
      try {
        const tokon= localStorage.getItem('tokenId')
      const response=await axios.get(`${BASE_URL}/api/employee`,{
        headers:{
          Authorization:`Bearer ${tokon}`
          }
      })
      const data=response.data
      // console.log(data.data.users.role)
      setCount(data.data.count)
    } catch (error) {
       console.error(error);
    }
    }
   handlefetch() 
  },[])

  const OverviewCard = ({
    title,
    value,
    icon: Icon,
    change,
    changeType = 'positive',
    link
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    link: string;
  }) => (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-neutral-500">{title}</h3>
          <p className="text-2xl font-semibold mt-2">{value}</p>

          {change && (
            <div className={`flex items-center mt-2 text-sm ${changeType === 'positive' ? 'text-success-500' :
                changeType === 'negative' ? 'text-error-500' : 'text-neutral-500'
              }`}>
              {changeType === 'positive' ? <TrendingUp size={16} className="mr-1" /> :
                changeType === 'negative' ? <TrendingDown size={16} className="mr-1" /> : null}
              <span>{change}</span>
            </div>
          )}
        </div>

        <div className="rounded-full p-3 bg-primary-50 text-primary-600">
          <Icon size={20} />
        </div>
      </div>

      <Link to={link} className="block text-primary-600 font-medium text-sm mt-4 flex items-center">
        View details <ArrowRight size={16} className="ml-1" />
      </Link>
    </div>
  );
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
          <p className="text-black-500 mt-1 font-extrabold">Welcome back, {user?.name || user?.first_name}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-sm text-neutral-500">Today is </span>
          <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <OverviewCard
          title="Total Employees"
          value={count}
          icon={Users}
          change="+4% from last month"
          changeType="positive"
          link="/employees"
        />
        <OverviewCard
          title="Attendance Today"
          value={`${Math.round((dashboardData.activeEmployees / dashboardData.totalEmployees) * 100)}%`}
          icon={Calendar}
          change="+2% from yesterday"
          changeType="positive"
          link="/attendance"
        />
        <OverviewCard
          title="Leave Requests"
          value={dashboardData.leaveStats.pending}
          icon={FileText}
          change="3 new requests"
          changeType="neutral"
          link="/leave"
        />
        <OverviewCard
          title="Open Positions"
          value="7"
          icon={Briefcase}
          change="+2 from last month"
          changeType="positive"
          link="/recruitment/jobs"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Employee Distribution by Department</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData.departmentDistribution}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
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

        {/* Attendance Overview */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.attendanceSummary}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {dashboardData.attendanceSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity and Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Link to="#" className="text-primary-600 text-sm font-medium">View all</Link>
          </div>
          <div className="space-y-4">
            {[
              {
                icon: <Calendar className="text-primary-600" size={16} />,
                title: 'Michael Chen requested leave',
                time: '2 hours ago',
                status: 'Pending approval'
              },
              {
                icon: <Users className="text-success-500" size={16} />,
                title: 'New employee Jennifer Morgan joined',
                time: '1 day ago',
                status: 'HR onboarding'
              },
              {
                icon: <Award className="text-warning-500" size={16} />,
                title: 'Performance review cycle starting',
                time: '2 days ago',
                status: 'Upcoming'
              },
              {
                icon: <DollarSign className="text-primary-600" size={16} />,
                title: 'May 2025 payroll processed',
                time: '3 days ago',
                status: 'Completed'
              },
              {
                icon: <Briefcase className="text-accent-500" size={16} />,
                title: 'New job posting: Data Analyst',
                time: '4 days ago',
                status: 'Open'
              }
            ].map((item, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center mr-3">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">{item.title}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-neutral-500">{item.time}</span>
                    <span className="mx-2 text-neutral-300">•</span>
                    <span className="text-xs font-medium text-neutral-600">{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <Link to="#" className="text-primary-600 text-sm font-medium">View calendar</Link>
          </div>
          <div className="space-y-4">
            {[
              {
                date: { day: '15', month: 'MAY' },
                title: 'Company all-hands meeting',
                time: '10:00 AM - 11:30 AM',
                location: 'Main Conference Room'
              },
              {
                date: { day: '18', month: 'MAY' },
                title: 'New hire orientation',
                time: '9:00 AM - 1:00 PM',
                location: 'Training Room'
              },
              {
                date: { day: '20', month: 'MAY' },
                title: 'Product team sprint planning',
                time: '2:00 PM - 4:00 PM',
                location: 'Meeting Room B'
              },
              {
                date: { day: '25', month: 'MAY' },
                title: 'Employee birthday celebration',
                time: '4:00 PM - 5:00 PM',
                location: 'Break Room'
              },
              {
                date: { day: '28', month: 'MAY' },
                title: 'Quarterly performance reviews due',
                time: 'All day',
                location: 'Online'
              }
            ].map((event, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 flex flex-col items-center justify-center h-14 w-14 rounded bg-primary-50 text-primary-600 mr-3">
                  <span className="text-xs font-medium">{event.date.month}</span>
                  <span className="text-lg font-bold">{event.date.day}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">{event.title}</p>
                  <p className="text-xs text-neutral-500 mt-1">{event.time}</p>
                  <p className="text-xs text-neutral-500">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <div className="max-w-md mx-auto mt-10">
      <div className="flex border-b border-gray-300">
        <button
          className={`flex-1 p-2 ${
            activeTab === 'home' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button
          className={`flex-1 p-2 ${
            activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`flex-1 p-2 ${
            activeTab === 'settings' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>
      <div className="border border-t-0 border-gray-300">
        {renderTabContent()}
      </div>
    </div> */}


    </div>
  );
};

export default Dashboard;