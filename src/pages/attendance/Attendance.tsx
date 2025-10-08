import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, X, Clock, AlertCircle, CloudCog, View } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, getMonth, getYear, addMonths, subMonths, set } from 'date-fns';
import { generateCalendarDays, attendanceData, getEmployeeAttendance } from '../../data/attendanceData';
import employeesData from '../../data/employeeData';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../constants/axiosInstance';
import { BASE_URL, timeZone } from '../../constants/api';
import { FaCalendarAlt, FaCheckCircle, FaMapMarkerAlt, FaTimesCircle } from 'react-icons/fa';
import { FaClock, FaRegCalendarMinus } from 'react-icons/fa6';
import { all } from 'axios';
import Loading from '../../components/Loading';
import { useSelector } from 'react-redux';

const Attendance: React.FC = () => {
  const { user } = useSelector((state)=>state.auth)
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState(user?.role === 'employee' ? user.id : '');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedUserAttendance, setSelectedUserAttendance] = useState([]);
  const [attendanceByDate, setAttendanceByDate] = useState<any[]>([]);
  const [attendanceDataSingle, setAttendanceDataSingle] = useState<any[]>([]);
  const [allUserLoading, setAllUserLoading] = useState(false);
  const handleMonthChange = (offset: number) => {
    if (offset > 0) {
      setCurrentMonth(addMonths(currentMonth, 1));
    } else {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };
  // today all user attendance data
  const [todayattendanceData, setTodayAttendanceData] = useState<any[]>([]);
  const [allattendanceData, setAllAttendanceData] = useState<any[]>([]);
  const [dailyAttendance, setDailyAttendance] = useState<any[]>([]);// for calender daily attendance data

  useEffect(() => {
    if (!selectedDate) return;
    const formatted = format(selectedDate, 'yyyy-MM-dd')
    const handleFetch = async () => {
      setAllUserLoading(true);
      try {
        if (!selectedEmployee) {
          const response = await axios.get(
            `${BASE_URL}/api/attendance/all_users_attendance_by_date?date=${formatted}`
          );
          const data = response.data.data;
          // console.log(data, "all user by date")
          // no location data is coming from backend
          setAttendanceByDate(data);
        }
      } catch (error) {
        console.error("Error fetching attendance by date:", error);
      } finally {
        setAllUserLoading(false);
      }
    };

    handleFetch();
  }, [selectedDate]);




  useEffect(() => {
    const todayAttendance = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/attendance/all_users_today_attendance`,)
        const data = response.data.data
        console.log(data)
        setTodayAttendanceData(data);
      } catch (error) {
        console.error('Error fetching today\'s attendance:', error);
      }
    }
    todayAttendance();     

  }, [])




  // useEffect(() => {
  //   const allUserAttendanceHistory = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/api/attendance/all_user_attendance_history`,);
  //       const data = response.data.data;
  //       // console.log(data, "attendcatotaldata")
  //       setAllAttendanceData(data);
  //     } catch (error) {
  //       console.error('Error fetching all user attendance history:', error);

  //     }
  //   }
  //   allUserAttendanceHistory();
  // }, [])


  useEffect(() => {
    if (!selectedEmployee) {
      setSelectedUserAttendance([]);
      return;
    }

    const fetchSingleEmployeeAttendance = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/attendance/single_user_attendance_history/${selectedEmployee}`,)
        const data = response.data.data
        setSelectedUserAttendance(data || []);
      } catch (error) {
        console.error('Error fetching single employee attendance:', error);
      }
    }


    // console.log(selectedEmployee, "selectedEmployee")
    // const user = allattendanceData.find(user => user.empId === selectedEmployee);


    // console.log(user)
    // if (user && Array.isArray(user.attendanceHistory)) {
    //   setSelectedUserAttendance(user.attendanceHistory);
    //   console.log("✅ Attendance Found for:", user.empId);
    // } else {
    //   setSelectedUserAttendance([]);
    //   console.log("❌ No attendance history found for:", selectedEmployee);
    // }

    fetchSingleEmployeeAttendance();
  }, [selectedEmployee]);




  const [allUsers, setAllUsers] = useState<any[]>([]);
  useEffect(() => {
    const fetchAllUsers = async (): Promise<any> => {
      try {
        const response = await axios.get(`${BASE_URL}/api/employee/list`,);
        const data = response.data
        setAllUsers(data.data.users)
        // console.log(data.data.users)
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    }
    fetchAllUsers();
  }, [])




  const thatday = (date) => {
    const dateStr = format(new Date(date), 'yyyy-MM-dd');

    const day = allattendanceData?.flatMap((item) => {
      return item?.attendanceHistory
        ?.filter((record) => record.date === dateStr)
        ?.map((record) => ({
          date: record.date,
          employeeId: item.userId,
          employeeName: item.userName || '-',
          email: item.userEmail || '-',
          phone: item.userPhone || '-',
          role: item.role || '-',
          designation: item.designation || '-',
          status: record.status,
          checkIn: record.inTime || '-',
          checkOut: record.outTime || '-',
          workHours: record.duration || '-',
          notes: record.notes || '-',
          location: record.location || '-',
        }));
    }) || [];

    return day;
  };

  // useEffect(() => {
  //   const fetchAttendanceData = async () => {
  //     try {
  //       const res = await axios.get(`${BASE_URL}/api/attendance/all_user_attendance_history`,);
  //       // console.log(res.data.data)
  //       setAllAttendanceData(res.data.data);
  //     } catch (error) {
  //       console.error("Failed to fetch attendance data:", error);
  //     }
  //   };

  //   fetchAttendanceData();
  // }, []);



  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(new Date());
    const selectedId = e.target.value;
    setSelectedEmployee(selectedId);

  }



  function extractHourAndMinute(isoString) {
    if (!isoString) return '--';

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '--';

    const hours = String(date.getHours()).padStart(2, '0');      // local time
    const minutes = String(date.getMinutes()).padStart(2, '0');  // local time
    return `${hours}:${minutes}`;
  }


  // useEffect(() => {
  //   if (selectedDate && allattendanceData.length > 0) {
  //     const filtered = thatday(selectedDate);
  //     // console.log(filtered, " filtered")
  //     setDailyAttendance(filtered);
  //   }
  // }, [selectedDate, allattendanceData]);

  // Example usage:
  // const current = thatday("2025-05-31");
  // console.log("current", current);



  // Get employee attendance data
  const getAttendanceForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    // let filteredAttendance;

    // if (selectedEmployee) {
    //   filteredAttendance = attendanceData.find(record =>
    //     record.employeeId === selectedEmployee && record.date === dateStr
    //   );
    // } else {
    //   filteredAttendance = attendanceData.filter(record => record.date === dateStr);
    // }

    // return filteredAttendance;



  };

  // Custom calendar tile content
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const dateStr = format(date, 'yyyy-MM-dd');
    const today = new Date();

    let status = '';

    if (selectedEmployee) {
      // Single employee selected
      const record = selectedUserAttendance.find((rec) => rec.date === dateStr);
      status = record?.status?.toLowerCase() || '';
      if (status === 'half day') status = 'half-day';
    } else {
      // No employee selected → check if any status exists on this date from allattendanceData
      const dayRecords = allattendanceData
        .flatMap((user) => user.attendanceHistory || [])
        .filter((rec) => rec.date === dateStr);

      if (dayRecords.length > 0) {
        const present = dayRecords.some((r) => r.status.toLowerCase() === 'present');
        const halfDay = dayRecords.some((r) => r.status.toLowerCase() === 'half day');
        const absent = dayRecords.some((r) => r.status.toLowerCase() === 'absent');
        const leave = dayRecords.some((r) => r.status.toLowerCase() === 'leave');

        if (present) status = 'present';
        else if (halfDay) status = 'half-day';
        else if (leave) status = 'leave';
        else if (absent) status = 'absent';
      } else if (date > today) {
        status = 'future';
      }
    }

    const statusStyles: Record<string, string> = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      'half-day': 'bg-yellow-100 text-yellow-800',
      weekend: 'bg-neutral-100 text-neutral-500',
      holiday: 'bg-blue-100 text-blue-800',
      leave: 'bg-purple-100 text-purple-800',
      future: 'bg-neutral-50 text-neutral-400',
    };

    const className = statusStyles[status] || '';

    return (
      <div className={`h-full w-full ${className} rounded-full flex items-center justify-center`}>
        {String(date.getDate())}
      </div>
    );
  };



  // Get the selected date's attendance data
  const selectedDateAttendance = getAttendanceForDate(selectedDate);

  // Calculate attendance stats for the month
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const monthStartStr = format(monthStart, 'yyyy-MM-dd');
  const monthEndStr = format(monthEnd, 'yyyy-MM-dd');

  let monthlyAttendance;

  if (selectedEmployee) {
    monthlyAttendance = employeesData
      .filter(emp => emp.id === selectedEmployee)
      .map(employee => {
        // Get employee's attendance records for the month
        const records = getEmployeeAttendance(employee.id).filter(record =>
          record.date >= monthStartStr && record.date <= monthEndStr
        );

        const workdays = records.filter(record =>
          record.status !== 'weekend' && record.status !== 'holiday'
        ).length;

        const presentDays = records.filter(record =>
          record.status === 'present'
        ).length;

        const halfDays = records.filter(record =>
          record.status === 'half-day'
        ).length;

        const absentDays = records.filter(record =>
          record.status === 'absent'
        ).length;

        const leaveDays = records.filter(record =>
          record.status === 'leave'
        ).length;

        const attendanceRate = workdays > 0
          ? Math.round(((presentDays + halfDays * 0.5) / workdays) * 100)
          : 0;

        return {
          id: employee.id,
          name: `${employee.firstName} ${employee.lastName}`,
          department: employee.department,
          workdays,
          presentDays,
          halfDays,
          absentDays,
          leaveDays,
          attendanceRate,
        };
      });
  } else {
    // Overall attendance stats
    const allRecords = attendanceData.filter(record =>
      record.date >= monthStartStr && record.date <= monthEndStr
    );

    const workdays = new Set(
      allRecords
        .filter(record => record.status !== 'weekend' && record.status !== 'holiday')
        .map(record => record.date)
    ).size;

    const employees = employeesData.filter(emp => emp.status !== 'inactive').length;
    const totalWorkEntries = employees * workdays;

    const presentCount = allRecords.filter(record => record.status === 'present').length;
    const halfDayCount = allRecords.filter(record => record.status === 'half-day').length;
    const absentCount = allRecords.filter(record => record.status === 'absent').length;
    const leaveCount = allRecords.filter(record => record.status === 'leave').length;

    const overallAttendanceRate = totalWorkEntries > 0
      ? Math.round(((presentCount + halfDayCount * 0.5) / totalWorkEntries) * 100)
      : 0;

    monthlyAttendance = [{
      name: 'Overall',
      workdays,
      presentDays: presentCount,
      halfDays: halfDayCount,
      absentDays: absentCount,
      leaveDays: leaveCount,
      attendanceRate: overallAttendanceRate,
    }];
  }




  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Attendance</h1>
            <p className="text-blue-100 mt-2">Manage and track employee attendance</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="mt-4 md:mt-0 flex gap-2">
          <Link to="/attendance/log" className="btn btn-primary flex gap-5">
            <View/> View Attendance Log
          </Link>
        </div>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Attendance</h1>
          <p className="text-neutral-500 mt-1">Manage and track employee attendance</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Link to="/attendance/log" className="btn btn-primary">
            View Attendance Log
          </Link>
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Calendar and Filters */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden mb-6">
            <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
              <div className="flex items-center">
                <CalendarIcon size={18} className="text-primary-600 mr-2" />
                <h2 className="text-lg font-semibold">Attendance Calendar</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-1 rounded hover:bg-neutral-100"
                  onClick={() => handleMonthChange(-1)}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-medium">
                  {format(currentMonth, 'MMMM yyyy')}
                </span>
                <button
                  className="p-1 rounded hover:bg-neutral-100"
                  onClick={() => handleMonthChange(1)}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="border-b border-neutral-200 p-4 ">
              <div className="md:w-1/2">
                <label htmlFor="employeeSelect" className="form-label">Select Employee</label>
                <select

                  id="employeeSelect"
                  className="form-select"
                  value={selectedEmployee}
                  onChange={handleChange}
                  disabled={user?.role === 'employee'}

                >
                  <option value="">All Employees</option>
                  {allUsers.map(employee => (
                    <option key={employee._id} value={employee._id}>
                      {employee?.first_name} {employee?.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6">
              {selectedEmployee && <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-100 rounded-full mr-2"></div>
                    <span className="text-xs text-neutral-600">Present</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-100 rounded-full mr-2"></div>
                    <span className="text-xs text-neutral-600">Half Day</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-100 rounded-full mr-2"></div>
                    <span className="text-xs text-neutral-600">Absent</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-100 rounded-full mr-2"></div>
                    <span className="text-xs text-neutral-600">Holiday</span>
                  </div>
                </div>
              </div>}

              <div className="attendance-calendar">
                <Calendar
                  className="CustomAttendance-calendar"
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileContent={tileContent}
                  tileClassName="h-12 w-12 flex items-center justify-center"
                  activeStartDate={currentMonth}
                  onActiveStartDateChange={({ activeStartDate }) => {
                    if (activeStartDate) setCurrentMonth(activeStartDate);
                  }}
                />

              </div>
            </div>
          </div>

          {/* Attendance Details */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 max-h-[600px] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')} Details
              </h3>
            </div>

            {selectedEmployee === '' ?
              (
                allUserLoading ? (
                  <div className="text-center py-6">
                    <Loading text="Loading..." />
                  </div>
                ) :
                  Array.isArray(attendanceByDate) && attendanceByDate.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Status</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Working Hours</th>
                          </tr>
                        </thead>
                        <tbody className="w-full">
                          {allUserLoading ? (
                            <tr>
                              <td colSpan={5} className="text-center py-6">
                                <Loading text="Loading..." />
                              </td>
                            </tr>
                          ) : (
                            attendanceByDate?.map((record, index) => (
                              <tr
                                key={index}
                                onClick={() => {
                                  setAttendanceDataSingle(record);
                                  setDrawerOpen(true);
                                }}
                                className="cursor-pointer hover:bg-neutral-50"
                              >
                                <td>{record?.user?.firstName} {record?.user?.lastName}</td>
                                <td>
                                  <span
                                    className={`badge ${record?.status === 'Present' ? 'badge-success' :
                                      record?.status === 'Absent' ? 'badge-danger' :
                                        record?.status === 'Half-day' ? 'badge-warning' :
                                          record?.status === 'Leave' ? 'badge-info' :
                                            'bg-neutral-100 text-neutral-800'
                                      }`}
                                  >
                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                  </span>
                                </td>
                                <td>{record.inTime ? (extractHourAndMinute(record?.inTime) + (" ") + timeZone(user?.timeZone))  : '--'} </td>
                                <td>{record.outTime ? (extractHourAndMinute(record?.outTime) + (" ") + timeZone(user?.timeZone))  : '--'} </td>
                                {/* <td>{record.outTime ? extractHourAndMinute(record?.outTime) : '--'}</td> */}
                                {/* <td>{record.date ? record?.date : '--'}</td> */}
                                <td>{record.duration ? `${record.duration} hrs` : '--'}</td>
                              </tr>
                            ))
                          )}
                        </tbody>

                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle size={48} className="mx-auto text-neutral-300 mb-2" />
                      <h4 className="text-lg font-medium text-neutral-700">No attendance records found</h4>
                      <p className="text-neutral-500 mt-1">There are no attendance records for this date.</p>
                    </div>
                  )
              ) : (
//---------------------------------------------
               
                  <>
                    {selectedUserAttendance.some(record => record.date === format(selectedDate, 'yyyy-MM-dd')) ? (
                      <div className="overflow-x-auto">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Employee</th>
                              <th>Status</th>
                              <th>Check In</th>
                              <th>Check Out</th>
                              <th>Working Hours</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedUserAttendance
                              .filter(record => record.date === format(selectedDate, 'yyyy-MM-dd'))
                              .map(record => (
                                <tr
                                  key={record._id || `${record.employeeId}-${record.date}`}
                                  onClick={() => {
                                    setAttendanceDataSingle(record);
                                    setDrawerOpen(true);
                                  }}
                                  className="cursor-pointer hover:bg-neutral-50"
                                >
                                  <td>
                                    {allUsers.length > 0
                                      ? (allUsers.find((user) => user._id === selectedEmployee)?.first_name || '') +
                                      " " +
                                      (allUsers.find((user) => user._id === selectedEmployee)?.last_name || '')
                                      : ""}
                                  </td>

                                  <td>
                                    <span
                                      className={`badge ${record.status === 'Present'
                                        ? 'badge-success'
                                        : record.status === 'Absent'
                                          ? 'badge-danger'
                                          : record.status === 'Half-day'
                                            ? 'badge-warning'
                                            : record.status === 'Leave'
                                              ? 'badge-info'
                                              : 'bg-neutral-100 text-neutral-800'
                                        }`}
                                    >
                                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                    </span>
                                  </td>
                                  <td>{record.inTime ? extractHourAndMinute(record.inTime) : '--'}</td>
                                  <td>{record.outTime ? extractHourAndMinute(record.outTime) : '--'}</td>
                                  <td>{record.duration ? `${record.duration} hrs` : '--'}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (

                      <div className="text-center py-12">
                        <AlertCircle size={48} className="mx-auto text-neutral-300 mb-2" />
                        <h4 className="text-lg font-medium text-neutral-700">No attendance records found</h4>
                        <p className="text-neutral-500 mt-1">There are no attendance records for this date.{format(selectedDate, "yyyy-mm-dd")}</p>
                      </div>
                    )}
                  </>

             
              )}
          </div>
        </div>

        {/* Right Column: Stats */}
        <div className=''>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Summary</h3>
            <div className="space-y-6">
              {monthlyAttendance?.map((attendance, index) => (
                <div key={index}>
                  <h4 className="text-base font-medium text-neutral-800 mb-2">{attendance.name}</h4>
                  <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Attendance Rate</span>
                      <span className="text-sm font-medium">{attendance.attendanceRate}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${attendance.attendanceRate >= 90 ? 'bg-green-500' :
                          attendance.attendanceRate >= 75 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                        style={{ width: `${attendance.attendanceRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <div className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        <span className="text-sm">Present</span>
                      </div>
                      <span className="text-sm font-medium">{attendance.presentDays} days</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                      <div className="flex items-center">
                        <Clock size={16} className="text-yellow-500 mr-2" />
                        <span className="text-sm">Half Day</span>
                      </div>
                      <span className="text-sm font-medium">{attendance.halfDays} days</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <div className="flex items-center">
                        <X size={16} className="text-red-500 mr-2" />
                        <span className="text-sm">Absent</span>
                      </div>
                      <span className="text-sm font-medium">{attendance.absentDays} days</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                      <div className="flex items-center">
                        <CalendarIcon size={16} className="text-purple-500 mr-2" />
                        <span className="text-sm">Leave</span>
                      </div>
                      <span className="text-sm font-medium">{attendance.leaveDays} days</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-neutral-50 rounded">
                      <div className="flex items-center">
                        <CalendarIcon size={16} className="text-neutral-500 mr-2" />
                        <span className="text-sm">Working Days</span>
                      </div>
                      <span className="text-sm font-medium">{attendance.workdays} days</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Today's Attendance</h3>
            <div className="space-y-3">
              {/* {employeesData.slice(0, 5).map(employee => {
                const today = format(new Date(), 'yyyy-MM-dd');
                const record = attendanceData.find(rec =>
                  rec.employeeId === employee.id && rec.date === today
                );

                return (
                  <div key={employee.id} className="flex items-center justify-between p-2 border-b border-neutral-100">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden bg-neutral-100 mr-3">
                        {employee.avatar ? (
                          <img src={employee.avatar} alt={employee.firstName} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs font-medium">{employee.firstName[0]}{employee.lastName[0]}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{employee.firstName} {employee.lastName}</p>
                        <p className="text-xs text-neutral-500">{employee.department}</p>
                      </div>
                    </div>
                    <div>
                      {record ? (
                        <span className={`badge ${record.status === 'present' ? 'badge-success' :
                            record.status === 'absent' ? 'badge-danger' :
                              record.status === 'half-day' ? 'badge-warning' :
                                record.status === 'leave' ? 'badge-info' : 'bg-neutral-100 text-neutral-800'
                          }`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      ) : (
                        <span className="badge bg-neutral-100 text-neutral-600">Not Marked</span>
                      )}
                    </div>
                  </div>
                );
              })} */}


              {todayattendanceData.slice(0, 5).map((item) => {
                // console.log(item)
                const { user, date, inTime, status } = item;
                const email = user.email;
                const emailFirstLetter = email?.charAt(0).toUpperCase();
                // const status = todayStatus?.toLowerCase();

                return (
                  <div
                    key={user.userId}
                    className="flex items-center justify-between p-2 border-b border-neutral-100 min-w-[300px]"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden bg-neutral-200 mr-3 text-sm font-medium text-white bg-blue-500">
                        {emailFirstLetter}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{email}</p>
                        <p className="text-xs text-neutral-500">{new Date(date).toDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`badge ${status === 'Present'
                          ? 'bg-green-100 text-green-800'
                          : status === 'Absent'
                            ? 'bg-red-100 text-red-800'
                            : status === 'Half-day'
                              ? 'bg-yellow-100 text-yellow-800'
                              : status === 'Leave'
                                ? 'bg-blue-100 text-blue-800'
                                : status === 'Holiday'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-neutral-100 text-neutral-800'
                          } px-2 py-1 rounded text-xs font-medium`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })}

            </div>


            <div className="mt-4 text-center">
              <Link to="/attendance/log" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All Employees
              </Link>
            </div>
          </div>
        </div>
        {drawerOpen && attendanceDataSingle ? (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Center Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg h-auto max-h-[80%] overflow-y-auto animate-fadeIn relative">

                {/* Header */}
                <div className="flex flex-col items-center mb-6 border-b pb-2 text-center">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaCalendarAlt className="text-blue-600 text-lg" />
                    <h3 className="text-xl font-semibold">
                      {attendanceDataSingle?.date && format(attendanceDataSingle?.date, 'EEEE, MMMM d, yyyy')}
                    </h3>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                {attendanceDataSingle?.status === "Absent" || attendanceDataSingle?.status === "Leave" ? (
                  <div className="text-center text-gray-700 space-y-4">
                    {attendanceDataSingle.status === "Absent" ? (
                      <>
                        <FaTimesCircle className="text-4xl text-red-500 mx-auto" />
                        <p className="text-xl font-semibold">Marked Absent</p>
                        <p className="text-gray-500">No check-in or check-out was recorded for this date.</p>
                      </>
                    ) : (
                      <>
                        <FaRegCalendarMinus className="text-4xl text-yellow-500 mx-auto" />
                        <p className="text-xl font-semibold">On Leave</p>
                        <p className="text-gray-500">You were on approved leave for this date.</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 text-gray-700 max-w-md mx-auto">
                    {/* Status & Duration */}
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div className="flex items-start gap-3">
                        <FaCheckCircle
                          className={`mt-1 text-lg ${attendanceDataSingle.status === 'Present'
                            ? 'text-green-500'
                            : attendanceDataSingle.status === 'Half Day'
                              ? 'text-blue-500'
                              : attendanceDataSingle.status === 'Leave'
                                ? 'text-yellow-500'
                                : 'text-gray-400'
                            }`}
                        />
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="font-medium text-base">{attendanceDataSingle.status || 'No Data'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FaClock className="mt-1 text-blue-500 text-lg" />
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium text-base">{attendanceDataSingle.workHours || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Check-In & Check-Out */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-start gap-3 p-4 rounded">
                        <FaMapMarkerAlt className="text-rose-500 text-lg mt-1 w-20" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Check-In</p>
                          <p className="text-balance text-gray-500 font-semibold mt-1">Time:</p>
                          <p className="text-base text-gray-800 font-medium">
                            {attendanceDataSingle?.inTime
                              ? format(new Date(attendanceDataSingle?.inTime), 'hh:mm a')
                              : '-'}
                          </p>
                          <p className="text-balance text-gray-500 font-semibold mt-2">Location:</p>
                          <p className="text-sm text-gray-700">
                            {attendanceDataSingle?.location?.checkIn?.address || 'Location not available'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded">
                        <FaMapMarkerAlt className="text-rose-500 text-lg mt-1 w-20" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Check-Out</p>
                          <p className="text-balance text-gray-500 font-semibold mt-1">Time:</p>
                          <p className="text-base text-gray-800 font-medium">
                            {attendanceDataSingle.outTime && attendanceDataSingle.outTime !== "-"
                              ? format(new Date(attendanceDataSingle.outTime), 'hh:mm a')
                              : '-'}
                          </p>
                          <p className="text-balance text-gray-500 font-semibold mt-2">Location:</p>
                          <p className="text-sm text-gray-700">
                            {attendanceDataSingle?.location?.checkOut?.address || 'Location not available'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}


      </div>
      {/* 
      <style jsx>{`
        .attendance-calendar .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        
        .attendance-calendar .react-calendar__tile {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        
        .attendance-calendar .react-calendar__tile--now {
          background: none;
        }
        
        .attendance-calendar .react-calendar__tile--now abbr {
          text-decoration: none;
          font-weight: bold;
        }
        
        .attendance-calendar .react-calendar__tile:enabled:hover,
        .attendance-calendar .react-calendar__tile:enabled:focus {
          background: none;
        }
        
        .attendance-calendar .react-calendar__tile--active:enabled {
          background: none;
          color: inherit;
        }
        
        .attendance-calendar .react-calendar__tile--active:enabled abbr {
          text-decoration: none;
          font-weight: bold;
        }
        
        .attendance-calendar .react-calendar__month-view__days__day--weekend {
          color: inherit;
        }
      `}</style>
    </div>
  );
}; */}


      <style>{`
  .attendance-calendar .react-calendar {
    width: 100%;
    border: none;
    font-family: inherit;
  }

  .attendance-calendar .react-calendar__tile {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .attendance-calendar .react-calendar__tile--now {
    background: none;
  }

  .attendance-calendar .react-calendar__tile--now abbr {
    text-decoration: none;
    font-weight: bold;
  }

  .attendance-calendar .react-calendar__tile:enabled:hover,
  .attendance-calendar .react-calendar__tile:enabled:focus {
    background: none;
  }

  .attendance-calendar .react-calendar__tile--active:enabled {
    background: none;
    color: inherit;
  }

  .attendance-calendar .react-calendar__tile--active:enabled abbr {
    text-decoration: none;
    font-weight: bold;
  }

  .attendance-calendar .react-calendar__month-view__days__day--weekend {
    color: inherit;
  }
`}</style>
    </div>
  );
}

export default Attendance;