import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, X, Clock, AlertCircle } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, getMonth, getYear, addMonths, subMonths } from 'date-fns';
import { generateCalendarDays, attendanceData, getEmployeeAttendance } from '../../data/attendanceData';
import employeesData from '../../data/employeeData';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState(user?.role === 'employee' ? user.id : '');

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
    const todayAttendance = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/attendance/all_users_today_attendance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenId')}`
          }
        })
        const data = response.data.data
        // console.log(data[0])
        setTodayAttendanceData(data);
      } catch (error) {
        console.error('Error fetching today\'s attendance:', error);
      }
    }
    todayAttendance();

  }, [])

  useEffect(() => {
    const allUserAttendanceHistory = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/attendance/all_user_attendance_history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenId')}`
          }
        });
        const data = response.data.data;
        setAllAttendanceData(data);
      } catch (error) {
        console.error('Error fetching all user attendance history:', error);

      }
    }
    allUserAttendanceHistory();
  }, [])


  useEffect(() => {
    if (selectedDate && allattendanceData.length > 0) {
      const filtered = thatday(selectedDate);
      setDailyAttendance(filtered);
    }
  }, [selectedDate, allattendanceData]);



  const thatday = (date) => {
    const dateStr = format(new Date(date), 'yyyy-MM-dd');

    const day = allattendanceData?.flatMap((item) => {
      return item?.attendance
        ?.filter((record) => record.date === dateStr)
        ?.map((record) => ({
          date: record.date,
          employeeId: item.user._id,
          employeeName: `${item.user.first_name} ${item.user.last_name}`,
          email: item.user.email,
          phone: item.user.phone,
          role: item.user.role,
          designation: item.user.designation,
          status: record.status,
          checkIn: record.inTime || '-',
          checkOut: record.outTime || '-',
          workHours: record.duration || '-',
          notes: record.notes || '-',
        }));
    }) || [];

    return day;
  };

  // Example usage:
  // const current = thatday("2025-05-31");
  // console.log("current", current);



  // Get employee attendance data
  const getAttendanceForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    let filteredAttendance;

    if (selectedEmployee) {
      filteredAttendance = attendanceData.find(record =>
        record.employeeId === selectedEmployee && record.date === dateStr
      );
    } else {
      filteredAttendance = attendanceData.filter(record => record.date === dateStr);
    }

    return filteredAttendance;
  };

  // Custom calendar tile content
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let status;

    if (selectedEmployee) {
      const record = attendanceData.find(rec =>
        rec.employeeId === selectedEmployee && rec.date === dateStr
      );
      status = record?.status;
    } else {
      // General attendance status (based on percentage of present employees)
      const dayRecords = attendanceData.filter(rec => rec.date === dateStr);
      if (dayRecords.length > 0) {
        const presentCount = dayRecords.filter(rec => rec.status === 'present' || rec.status === 'half-day').length;
        const ratio = presentCount / dayRecords.length;

        if (isWeekend) {
          status = 'weekend';
        } else if (dayRecords[0].status === 'holiday') {
          status = 'holiday';
        } else if (ratio > 0.9) {
          status = 'present';
        } else if (ratio > 0.7) {
          status = 'half-day';
        } else {
          status = 'absent';
        }
      } else if (isWeekend) {
        status = 'weekend';
      }
    }

    // Apply styles based on status
    let className = '';

    switch (status) {
      case 'present':
        className = 'bg-green-100 text-green-800';
        break;
      case 'absent':
        className = 'bg-red-100 text-red-800';
        break;
      case 'half-day':
        className = 'bg-yellow-100 text-yellow-800';
        break;
      case 'weekend':
        className = 'bg-neutral-100 text-neutral-500';
        break;
      case 'holiday':
        className = 'bg-blue-100 text-blue-800';
        break;
      case 'leave':
        className = 'bg-purple-100 text-purple-800';
        break;
      default:
        const today = new Date();
        if (date > today) {
          className = 'bg-neutral-50 text-neutral-400';
        }
    }

    return (
      <div className={`h-full w-full ${className} rounded-full flex items-center justify-center`}>
        {String(date.getDate())}
      </div>
    );
  };

  // Get the selected date's attendance data
  // const selectedDateAttendance = getAttendanceForDate(selectedDate);

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Attendance</h1>
          <p className="text-neutral-500 mt-1">Manage and track employee attendance</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Link to="/attendance/log" className="btn btn-primary">
            View Attendance Log
          </Link>
        </div>
      </div>

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

            <div className="border-b border-neutral-200 p-4">
              <div className="md:w-1/2">
                <label htmlFor="employeeSelect" className="form-label">Select Employee</label>
                <select
                  id="employeeSelect"
                  className="form-select"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  disabled={user?.role === 'employee'}
                >
                  <option value="">All Employees</option>
                  {employeesData.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName} ({employee.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between mb-4">
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
              </div>

              <div className="attendance-calendar">
                <Calendar
                  className='CustomAttendance-calendar'
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileContent={tileContent}
                  tileClassName="h-12 w-12 flex items-center justify-center"
                  activeStartDate={currentMonth}
                  onActiveStartDateChange={({ activeStartDate }) => activeStartDate && setCurrentMonth(activeStartDate)}
                />
              </div>
            </div>
          </div>

          {/* Attendance Details */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')} Details
              </h3>
            </div>

            {Array.isArray(dailyAttendance) ? (
              // Multiple employees for the selected date
              dailyAttendance.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Status</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Working Hours</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyAttendance.map((record) => (
                        <tr key={record.id}>
                          <td>{record.employeeName}</td>
                          <td>
                            <span className={`badge ${record.status === 'present' ? 'badge-success' :
                              record.status === 'absent' ? 'badge-danger' :
                                record.status === 'half-day' ? 'badge-warning' :
                                  record.status === 'leave' ? 'badge-info' : 'bg-neutral-100 text-neutral-800'
                              }`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </td>
                          <td>{record.checkIn || '-'}</td>
                          <td>{record.checkOut || '-'}</td>
                          <td>{record.workHours ? `${record.workHours} hrs` : '-'}</td>
                          <td>{record.notes || '-'}</td>
                        </tr>
                      ))}
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
              // Single employee record
              selectedDateAttendance ? (
                <div className="bg-neutral-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-700 mb-1">Status</h4>
                      <span className={`badge ${selectedDateAttendance.status === 'present' ? 'badge-success' :
                        selectedDateAttendance.status === 'absent' ? 'badge-danger' :
                          selectedDateAttendance.status === 'half-day' ? 'badge-warning' :
                            selectedDateAttendance.status === 'leave' ? 'badge-info' : 'bg-neutral-100 text-neutral-800'
                        }`}>
                        {selectedDateAttendance.status.charAt(0).toUpperCase() + selectedDateAttendance.status.slice(1)}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-neutral-700 mb-1">Check In</h4>
                      <div className="flex items-center">
                        <Clock size={16} className="text-neutral-500 mr-2" />
                        <span className="text-lg">{selectedDateAttendance.checkIn || 'N/A'}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-neutral-700 mb-1">Check Out</h4>
                      <div className="flex items-center">
                        <Clock size={16} className="text-neutral-500 mr-2" />
                        <span className="text-lg">{selectedDateAttendance.checkOut || 'N/A'}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-neutral-700 mb-1">Working Hours</h4>
                      <span className="text-lg">
                        {selectedDateAttendance.workHours ? `${selectedDateAttendance.workHours} hours` : 'N/A'}
                      </span>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-neutral-700 mb-1">Notes</h4>
                      <p className="text-neutral-600">{selectedDateAttendance.notes || 'No notes'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle size={48} className="mx-auto text-neutral-300 mb-2" />
                  <h4 className="text-lg font-medium text-neutral-700">No attendance records found</h4>
                  <p className="text-neutral-500 mt-1">There are no attendance records for this date.</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Right Column: Stats */}
        <div>
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

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
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
                const { user, date, inTime, todayStatus } = item;
                const email = user.email;
                const emailFirstLetter = email?.charAt(0).toUpperCase();
                const status = todayStatus?.toLowerCase();

                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 border-b border-neutral-100"
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
                        className={`badge ${status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : status === 'absent'
                            ? 'bg-red-100 text-red-800'
                            : status === 'half-day'
                              ? 'bg-yellow-100 text-yellow-800'
                              : status === 'leave'
                                ? 'bg-blue-100 text-blue-800'
                                : status === 'holiday'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-neutral-100 text-neutral-800'
                          } px-2 py-1 rounded text-xs font-medium`}
                      >
                        {todayStatus}
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
      </div>

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
};

export default Attendance;