import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronDown, Bell, User, Home, Users, Calendar, FileText,
  DollarSign, Award, Briefcase, BarChart2, Settings, LogOut, Search, Sun, Moon,
  LogOutIcon,
  PartyPopper,
  CalendarCheck,
  LocateIcon,
  UserX
} from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import NotificationDrawer from '../components/common/NotificationDrawer';
import { logout } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import axios from '../constants/axiosInstance';
import { BASE_URL } from '../constants/api';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // const { user } = useAuth();
  const { user } = useSelector((state: RootState) => state.auth)

  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const { notifications } = useNotification();
  // const unreadNotifications = notifications.filter(n => !n.read).length;

  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const dispatch = useDispatch()
  useEffect(() => {
    const unread = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/notifications`);
        const data = response.data.data;
        // console.log(data.filter(n => !n.isRead).length)
        setUnreadNotifications(data.filter(n => !n.isRead).length)
      } catch (error) {
        console.log(error);
      } finally {
      }
    }
    unread()


    let timer = setInterval(() => {
      unread()

    }, 1000 * 60 * 5);


    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // console.log(user?.role)
  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    {
      name: 'Employees',
      href: '/employees',
      icon: Users,
      children: [
        { name: 'All Employees', href: '/employees' },
        { name: 'Add Employee', href: '/employees/new' },
        {
          name: 'Deleted Employees',
          href: '/deleted',
          icon: UserX,
        }
        ,
      ]
    },


    {
      name: 'Attendance',
      href: '/attendance',
      icon: Calendar,
      children: [
        { name: 'Daily Status', href: '/attendance' },
        { name: 'Attendance Log', href: '/attendance/log' },
        { name: 'Home', href: '/home' }
      ]
    },
    { name: 'AttendanceStatus', href: '/attendancestatus', icon: CalendarCheck },

    {
      name: 'Leave',
      href: '/leave',
      icon: FileText,
      children: [
        { name: 'Leave Dashboard', href: '/leave' },
        { name: 'Apply Leave', href: '/leave/apply' },
        { name: 'My Leave Status', href: '/leavestatus' },
      ]
    },
    { name: 'Holidays', href: '/holidays', icon: PartyPopper },
    { name: 'Branch', href: '/branch', icon: LocateIcon },

    {
      name: 'Payroll', href: '/payroll', icon: DollarSign, children: [
        { name: 'Payroll Dashboard', href: '/payroll' },
        { name: 'My Salary Slips', href: '/payroll/slips' },
        // { name: 'Generate Payslip', href: '/payroll/generate' }
      ]
    },
    // { name: 'Performance', href: '/performance', icon: Award },
    // {
    //   name: 'Recruitment',
    //   href: '/recruitment/jobs',
    //   icon: Briefcase,
    //   children: [
    //     { name: 'Job Postings', href: '/recruitment/jobs' },
    //     { name: 'Candidates', href: '/recruitment/candidates' },
    //     { name: 'Interview Schedule', href: '/recruitment/schedule' }
    //   ]
    // },
    { name: 'Reports', href: '/reports', icon: BarChart2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };


  const filteredNavigation =
    // navigation.filter(item => {
    // if (user?.role === "employee" && item.name === "Employees") {
    //   return false;
    // } else if (user?.role === "employee" && item.name === "Attendance") {
    //   return false;
    // } else if (user?.role === "employee" && item.name === "Recruitment") {
    //   return false;
    // } else if (user?.role === "employee" && item.name === "Recruitment") {
    //   return false;
    // }
    // return true;

    navigation
      .filter(item => {
        if (user?.role === "employee") {
          const restrictedSections = ["Employees", "Attendance", "Recruitment", "Reports", "Performance", "Settings", "Branch", "Deleted Employees"];
          return !restrictedSections.includes(item.name);
        }
        if (user?.role === "hr") {
          const restrictedSections = ["Branch", "Deleted Employees"];
          return !restrictedSections.includes(item.name);
        }

        return true;


      }).map(item => {
        if (user?.role === "employee" && item.name === "Dashboard") {
          return {
            ...item, name: 'Home', href: '/home'
          }

        }

        if (user?.role === "employee" && item.name === "Leave" && item.children) {
          return {
            ...item,
            children: item.children.filter(child => child.name !== "Leave Dashboard")
          };
        }
        if (user?.role === "employee" && item.name === "Payroll" && item.children) {
          return {
            ...item,
            children: item.children.filter(child => child.name !== "Payroll Dashboard")
          };
        }

        return item
      })




  return (
    <div className="min-h-screen bg-neutral-50 lg:flex overflow-x-hidden">

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-800 bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:shadow-none lg:transform-none lg:relative lg:flex lg:flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-primary-600">HRMS</h1>
            </div>
          </div>
          <button
            className="lg:hidden rounded-md p-2 text-neutral-500 hover:bg-neutral-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {filteredNavigation.map((item) =>
              !item.children ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                  }}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${location.pathname === item.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${location.pathname === item.href
                      ? 'text-primary-600'
                      : 'text-neutral-500'
                      }`}
                  />
                  {item.name}
                </a>
              ) : (
                <div key={item.name}>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md justify-between ${location.pathname.startsWith(item.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={`mr-3 flex-shrink-0 h-5 w-5 ${location.pathname.startsWith(item.href)
                          ? 'text-primary-600'
                          : 'text-neutral-500'
                          }`}
                      />
                      {item.name}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${openDropdowns[item.name] ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openDropdowns[item.name] && (
                    <div className="pl-10 py-1 space-y-1">
                      {item.children.map((child) => (
                        <a
                          key={child.name}
                          href={child.href}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(child.href);
                          }}
                          className={`block px-2 py-1.5 text-sm rounded-md ${location.pathname === child.href
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-neutral-600 hover:bg-neutral-100'
                            }`}
                        >
                          {child.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </nav>
        </div>

        {sidebarOpen && <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">

              <span className="text-primary-600 font-medium">{user?.name?.[0] || user?.first_name[0]}</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-800">{user?.name || user.first_name}</p>
              <p className="text-xs text-neutral-500">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(logout())}
            className="mt-4 flex items-center text-sm text-neutral-600 hover:text-neutral-900 w-full py-2"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>}
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-auto">
        {/* Mobile Header */}
        <header className="sticky top-0 z-10 bg-white shadow">
          <div className="flex justify-between items-center px-4 h-16">
            <div className="flex items-center lg:hidden">
              <button
                className="p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              <h1 className="ml-2 text-lg font-semibold text-primary-600">HRMS</h1>
            </div>

            <div className="hidden md:flex items-center flex-1 px-4 lg:max-w-lg">
              {/* <div className="w-full relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                />
              </div> */}
            </div>

            <div className="flex items-center md:ml-6">
              {/* Mobile search toggle */}
              <button
                className="md:hidden p-2 rounded-md text-neutral-600 hover:bg-neutral-100 mr-2"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              >
                <Search size={20} />
              </button>

              {/* Notifications */}
              <button
                className="p-2 rounded-md text-neutral-600 hover:bg-neutral-100 relative"
                onClick={() => setNotificationOpen(true)}
              >
                <Bell size={22} style={{

                }} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-1 block h-[18px] w-[22px]  rounded-full bg-error-500 text-[11px] text-white font-bold">{unreadNotifications}</span>
                )}
              </button>

              {/* Theme toggle */}
              {/* <button
                className="max-md:hidden ml-2 p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button> */}

              {/* User Menu */}
              {/* <div className=" md:ml-3 md:flex md:items-center">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <Link to={'/profile'}><span className="text-primary-600 font-medium">{user?.name?.[0] || user?.first_name[0]}</span></Link>
                </div>
              </div> */}


              <div className="relative md:ml-3" ref={menuRef}>
                <div
                  className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center cursor-pointer"
                  onClick={() => setOpen(!open)}
                >
                  <span className="text-primary-600 font-medium">
                    {user?.name?.[0] || user?.first_name?.[0]}
                  </span>
                </div>

                {open && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      <p className='flex gap-4'><span><User className='text-sky-500' /></span>
                        Profile</p>
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setOpen(false);
                        dispatch(logout())
                      }}
                    >
                      <p className='flex gap-4'> <span><LogOutIcon className='text-sky-500' /></span>
                        Logout</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {mobileSearchOpen && (
            <div className="p-2 border-t border-neutral-200 md:hidden">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                />
              </div>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;