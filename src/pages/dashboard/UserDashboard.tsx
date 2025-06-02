import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../constants/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addDays, addWeeks, endOfWeek, format, isSameDay, startOfWeek, subWeeks } from 'date-fns';


import DatePicker from 'react-datepicker';
import { CalendarHeart } from 'lucide-react';


// checkin response
// {
//     "success": true,
//     "statusCode": 200,
//     "message": "Punched IN successfully",
//     "attendance": {
//         "_id": "68341dd218f1ae28ecb40989",
//         "date": "2025-05-26",
//         "userId": "68341cfea30d4c01f7d86d7e",
//         "__v": 0,
//         "createdAt": "2025-05-26T07:52:50.771Z",
//         "inTime": "2025-05-26T07:52:50.770Z",
//         "updatedAt": "2025-05-26T07:52:50.771Z"
//     }
// }

// {
//   "success": true,
//   "statusCode": 200,
//   "message": "Punched IN successfully",
//   "attendance": {
//     "_id": "6830679518f1ae28ecb402fb",
//     "date": "2025-05-23",
//     "userId": "6821d1602582fe365af0120a",
//     "__v": 0,
//     "createdAt": "2025-05-23T12:18:29.070Z",
//     "inTime": "2025-05-23T12:18:29.068Z",
//     "updatedAt": "2025-05-23T12:18:29.070Z"
//   }
// }




const UserDashboard = () => {
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

  const [elapsed, setElapsed] = useState('00:00:00');
  const [activeTab, setActiveTab] = useState('Activities');

  const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const userDetails = useSelector((state: RootState) => state.auth.user)

  const [attendanceData, setAttendanceData] = useState({});

  //
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handlePrevWeek = () => {
    setSelectedDate(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => addWeeks(prev, 1));
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  //
  const indianHolidays2025 = [
    { date: '2025-01-01', name: 'New Year\'s Day' },
    { date: '2025-01-14', name: 'Makar Sankranti / Pongal' },
    { date: '2025-01-26', name: 'Republic Day' },
    { date: '2025-03-01', name: 'Maha Shivratri' },
    { date: '2025-03-17', name: 'Holi' },
    { date: '2025-03-30', name: 'Good Friday' },
    { date: '2025-04-10', name: 'Ram Navami' },
    { date: '2025-04-13', name: 'Mahavir Jayanti' },
    { date: '2025-04-14', name: 'Dr. Ambedkar Jayanti' },
    { date: '2025-04-18', name: 'Good Friday' },
    { date: '2025-05-01', name: 'Labour Day / Maharashtra Day' },
    { date: '2025-05-12', name: 'Buddha Purnima' },
    { date: '2025-06-06', name: 'Bakrid / Eid al-Adha' },
    { date: '2025-07-30', name: 'Muharram' },
    { date: '2025-08-15', name: 'Independence Day' },
    { date: '2025-08-17', name: 'Parsi New Year (Navroz)' },
    { date: '2025-08-27', name: 'Janmashtami' },
    { date: '2025-10-02', name: 'Gandhi Jayanti' },
    { date: '2025-10-02', name: 'Mahatma Gandhi Jayanti' },
    { date: '2025-10-21', name: 'Dussehra / Vijaya Dashami' },
    { date: '2025-10-31', name: 'Diwali / Deepavali' },
    { date: '2025-11-01', name: 'Govardhan Puja' },
    { date: '2025-11-03', name: 'Bhai Dooj' },
    { date: '2025-11-06', name: 'Chhath Puja' },
    { date: '2025-12-25', name: 'Christmas Day' }
  ];
  const today = new Date();
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear();
  const holidatsThisMonth = indianHolidays2025.filter(holiday => {
    const date = new Date(holiday.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })


  const getCurrentWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();

    startOfWeek.setDate(today.getDate() - dayOfWeek);

    const week = [...Array(7)].map((_, idx) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + idx);
      const dateStr = date.toISOString().split('T')[0]; // "YYYY-MM-DD"

      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isTodayOrPast = date <= today
      let status = '—';
      let color = 'text-gray-400';

      if (!isTodayOrPast) {
        status = '';
      } else if (attendanceData[dateStr]) {
        status = attendanceData[dateStr];
        color =
          status === 'Present'
            ? 'text-green-600'
            : status === 'Absent'
              ? 'text-red-500'
              : 'text-gray-400';
      } else if (isWeekend) {
        status = 'Weekend';
        color = 'text-orange-500';
      } else {
        status = '-';
        color = 'text-green-600';
      }

      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: date.getDate().toString().padStart(2, '0'),
        fullDate: date,
        status,
        color,
        highlight: date.toDateString() === today.toDateString(),

      };
    });

    return week;
  };
  useEffect(() => {
    console.log(
      "first",
      format(weekStart, 'dd-MM-yyyy'),
      format(weekEnd, 'dd-MM-yyyy')
    );
  })


  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/attendance/single_user_attendance_history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
          }
        });
        const records = res.data?.data?.records || [];

        const mapped = {};
        records.forEach((record) => {
          mapped[record.date] = record.status;
        });
        setAttendanceData(mapped);
      } catch (err) {
        console.error('Error fetching attendance', err);
      }
    };

    fetchAttendance();
  }, []);

  const weekData = getCurrentWeekDates();


  // const weekRange = `${weekData[0]?.fullDate?.toLocaleDateString('en-GB', {
  //   day: '2-digit',
  //   month: 'short',
  //   year: 'numeric',
  // })} - ${weekData[6]?.fullDate?.toLocaleDateString('en-GB', {
  //   day: '2-digit',
  //   month: 'short',
  //   year: 'numeric',
  // })}`;

  const calculateLateBy = (inTime) => {
    if (!inTime) return '--';
    const sep = inTime.split(" ")[0]

    const [hours, minutes] = sep.split(':').map(Number);
    console.log(hours, minutes)
    const inDate = new Date();
    inDate.setHours(hours, minutes);

    const expected = new Date();
    expected.setHours(9, 0); // 09:00 AM

    if (inDate <= expected) return '00:00';

    const diffMs = inDate - expected;
    const diffMins = Math.floor(diffMs / 60000);
    const h = Math.floor(diffMins / 60);
    const m = diffMins % 60;

    return `${h}h ${m}m`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/attendance/single_user_attendance_history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
          }
        });
        console.log(res.data.data.records)
        setUser(res.data.data.records);
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    fetchUser();
  }, [])




  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';






  useEffect(() => {
    const fetchStatus = async () => {
      console.log("starrt")
      try {
        const res = await axios.get(`${BASE_URL}/api/attendance/single_user_today_attendance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
          }
        });
        // console.log(res)
        if (res.data.attendance.inTime) {
          setCheckInTime(res.data.attendance.inTime);
        }
        if (res.data.attendance.outTime) {
          setCheckOutTime(res.data.attendance.outTime);

          setHasCheckedOut(true);
        }
      } catch (error) {
        console.error('Failed to fetch status', error);
      }
    };
    fetchStatus();
  }, []);



  useEffect(() => {
    let timer: any;

    if (checkInTime && !hasCheckedOut) {
      const startTime = new Date(checkInTime);
      timer = setInterval(() => {
        const now = new Date();
        const elapsedTime = new Date(now.getTime() - startTime.getTime());
        const hours = String(elapsedTime.getUTCHours()).padStart(2, '0');
        const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
        const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');
        setElapsed(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    } else if (checkInTime && checkOutTime) {
      const startTime = new Date(checkInTime);
      const endTime = new Date(checkOutTime);
      const elapsedTime = new Date(endTime.getTime() - startTime.getTime());
      const hours = String(elapsedTime.getUTCHours()).padStart(2, '0');
      const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
      const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');
      setElapsed(`${hours}:${minutes}:${seconds}`);
    }

    return () => clearInterval(timer);
  }, [checkInTime, hasCheckedOut, checkOutTime]);



  const handleCheckIn = async () => {

    const token = localStorage.getItem('tokenId');
    console.log(token)
    try {
      const response = await axios.post(`${BASE_URL}/api/attendance/check_in`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setCheckInTime(response.data.attendance.inTime);
      toast.success('Checked in successfully');
    } catch (error) {
      toast.error('Error checking in');

    }
  };

  const handleCheckOut = async () => {
    const token = localStorage.getItem('tokenId');
    try {
      await axios.post(
        `${BASE_URL}/api/attendance/check_out`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHasCheckedOut(true);
      toast.success('Checked out successfully');
    } catch (error) {
      toast.error('Error checking out');
    }
  };

  const menuItems = [
    "Activities",
    "Attendance",
    "Time Logs",
    "All-Holidays",
  ];


  const ActivitiesTab = () => {
    return (
      <div className="space-y-6">

        {/* Greeting Section */}
        <div className="flex justify-between items-center p-6 bg-white rounded-xl shadow">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Good Morning <span className="text-blue-600">{userDetails?.name || capitalize(userDetails?.first_name) + " " + capitalize(userDetails?.last_name)}</span></h2>
            <p className="text-gray-500">Have a productive day!</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
            ☀️
          </div>
        </div>
        <div className="bg-gray-50 mt-4 p-4 rounded-lg overflow-x-auto">

          {/* Work Schedule */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span>📅</span> Work Schedule
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {weekData[0]?.fullDate.toLocaleDateString('en-GB')} -{' '}
              {weekData[6]?.fullDate.toLocaleDateString('en-GB')}
            </p>

            <div className="bg-gray-50 mt-4 p-4 rounded-lg overflow-x-auto">
              <div className="text-gray-600 mb-2">General: 09:00 AM - 6:00 PM</div>
              <div className="grid grid-cols-7 min-w-[700px] text-center text-sm font-medium text-gray-700 gap-2">
                {weekData.map((item) => (
                  <div key={item.fullDate.toISOString()} className="space-y-1 min-w-[90px]">
                    <div className="text-gray-500">{item.day}</div>
                    <div
                      className={`text-base font-semibold ${item.highlight
                        ? 'text-white bg-blue-500 rounded-full px-2 py-1'
                        : item.color
                        }`}
                    >
                      {item.dateNum}
                    </div>
                    <div className={`text-xs ${item.color}`}>{item.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Holidays */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span>🏖️</span> Holidays This Month
          </h3>

          <div className="flex flex-wrap gap-4 mt-4">
            {holidatsThisMonth.length > 0 ? (
              holidatsThisMonth.map((holiday) => {
                const dateObj = new Date(holiday.date);
                const day = dateObj.getDate();
                const month = dateObj.toLocaleString('default', { month: 'short' });
                const weekday = dateObj.toLocaleString('default', { weekday: 'long' });

                return (
                  <div
                    key={holiday.date}
                    className="border border-blue-500 text-blue-600 rounded-lg p-4 w-full sm:w-1/3"
                  >
                    <p className="font-semibold">{holiday.name}</p>
                    <p className="text-sm text-gray-500">
                      {`${day} - ${month}, ${weekday}`}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No holidays this month.</p>
            )}
          </div>
        </div>

        {/* Reminder */}
        {!checkInTime && <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <div className="text-yellow-500 text-2xl">⏰</div>
          <div className="text-sm text-gray-700">
            <strong>You are yet to submit your time logs today!</strong>
          </div>
        </div>}
      </div>
    );
  };


  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-full mx-auto border rounded-xl shadow-lg bg-white">

      {/* Left Card */}
      <div className="lg:w-1/3 w-full flex flex-col items-center justify-center border p-6 rounded-xl bg-gray-50">
        <div className="flex flex-col items-center gap-4 text-center">

          {/* Avatar */}
          <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md">
            <img
              src="https://contacts.zoho.in/file?ID=60028830319&fs=thumb"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-bold">{userDetails?.name || capitalize(userDetails?.first_name) + " " + capitalize(userDetails?.last_name)}</h1>


            <p className="text-sm text-gray-400">{userDetails?.email}</p>
            <p className="text-lg text-gray-600 mt-1 font-bold">{userDetails?.role}</p>
            {!checkInTime && (
              <p className="text-red-500 font-semibold mt-2">Yet to check In </p>
            )}
          </div>

          {/* Time Block */}
          <div className="flex justify-center gap-2 mt-4">
            {elapsed.split(':').map((value, index) => (
              <React.Fragment key={index}>
                <div className="bg-gray-200 w-14 h-14 rounded-xl flex items-center justify-center text-xl font-mono shadow-inner">
                  {value}
                </div>
                {index < 2 && <span className="text-2xl text-gray-500 flex items-center">:</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Button */}
          <div className="mt-6">
            {!checkInTime ? (
              <button
                onClick={handleCheckIn}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition duration-300"
              >
                Check In
              </button>
            ) : (
              <button
                onClick={handleCheckOut}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow transition duration-300"
              >
                Check Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel (Empty) */}
      <div className="flex-1 border rounded-xl bg-gray-50 p-4">
        {/* Tabs */}
        <div className="flex flex-wrap border-b mb-4">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`px-4 py-2 text-sm md:text-base font-medium transition border-b-2 ${activeTab === item
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-blue-500 hover:border-blue-300'
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Activities' && (
          <ActivitiesTab />
        )
        }
        {
          // activeTab === 'Attendance' && (
          //   <div className="p-6">
          //     <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          //       <span className="text-blue-600">🗓️</span> Attendance Records (Last 7 Days)
          //     </h2>

          //     <div className="bg-gray-50 border rounded-lg overflow-hidden">
          //       {/* Header */}
          //       <div className="grid grid-cols-3 bg-gray-100 text-gray-600 text-sm font-semibold p-3 border-b">
          //         <span>Day</span>
          //         <span>Shift</span>
          //         <span>Status</span>
          //       </div>

          //       {/* Attendance Rows */}
          //       {Object.entries(attendanceData)
          //         .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB)) // chronological order
          //         .slice(0, 7)
          //         .map(([date, status]) => {
          //           const day = new Date(date);
          //           const formattedDay = day.toLocaleDateString(undefined, {
          //             weekday: 'short',
          //             day: 'numeric',
          //           });

          //           const isPresent = status === 'Present';
          //           const isAbsent = status === 'Absent';
          //           const isWeekend = status === 'Weekend';

          //           return (
          //             <div key={date} className="grid grid-cols-3 items-center text-sm border-b last:border-0 hover:bg-gray-50 transition">
          //               {/* Date */}
          //               <div className="py-3 px-4 text-gray-700 font-medium">
          //                 <div className="text-xs">{formattedDay}</div>
          //                 <div className="text-xs text-gray-400">{day.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</div>
          //               </div>

          //               {/* Shift */}
          //               <div className="py-3 px-4">
          //                 <div className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">General</div>
          //                 <div className="text-xs text-gray-500 mt-1">09:00 AM - 6:00 PM</div>
          //               </div>

          //               {/* Status */}
          //               <div className="py-3 px-4">
          //                 <div
          //                   className={`
          //             text-xs font-semibold inline-block px-2 py-1 rounded-full 
          //             ${isPresent && 'bg-green-100 text-green-700'}
          //             ${isAbsent && 'bg-red-100 text-red-600'}
          //             ${isWeekend && 'bg-orange-100 text-orange-600'}
          //           `}
          //                 >
          //                   {isWeekend ? 'Weekend' : status}
          //                 </div>
          //                 {isAbsent && (
          //                   <div className="text-lg text-gray-500 mt-1">No check-in - No check-out</div>
          //                 )}
          //                 {isWeekend && (
          //                   <div className="text-lg text-gray-500 mt-1">No check-in - No check-out</div>
          //                 )}
          //               </div>
          //             </div>
          //           );
          //         })}
          //     </div>
          //   </div>
          // )


          activeTab === "Attendance" && (
            <>
              <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePrevWeek}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                  >
                    ← Prev
                  </button>

                  <div className="font-semibold text-lg cursor-pointer relative flex gap-4"><span onClick={() => setShowCalendar(!showCalendar)}><CalendarHeart /></span>
                    <span>
                      {format(weekStart, 'dd MMM')} – {format(weekEnd, 'dd MMM yyyy')}
                    </span>

                    {showCalendar && (
                      <div className="absolute z-10 mt-2 ">
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDateChange}
                          inline
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleNextWeek}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                  >
                    Next →
                  </button>
                </div>

                {/* Week Grid */}
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg cursor-pointer 
              ${isSameDay(day, new Date()) ? 'border border-blue-500' : ''}
              bg-blue-100 text-blue-800 hover:bg-blue-200`}
                    >
                      <div className="font-semibold">{format(day, 'EEE')}</div>
                      <div>{format(day, 'dd')}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full bg-white p-4 rounded-lg shadow mt-6 flex items-center justify-between">
                <p className="text-gray-600 text-lg m-2">
                  General [ 09:00 AM - 6:00 PM ]
                </p>

                <div className="flex items-center gap-2">
                  {/* Check-in Badge */}
                  <div className="flex flex-col bg-green-500 text-white px-4 py-2 rounded-lg shadow">
                    <span className="text-sm font-bold">Check-in</span>
                    <div className="flex items-center text-white font-boldmono text-lg font-bold">
                      {elapsed.split(':').map((value, index) => (
                        <React.Fragment key={index}>
                          <span>{value}</span>
                          {index < 2 && <span className="mx-1 text-white">:</span>}
                        </React.Fragment>
                      ))}
                      <span className="ml-1 text-sm font-bold">Hrs</span>
                    </div>
                  </div>

                  {/* Clock Icon Button */}
                  <button className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-green-500 -mx-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m4-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Weekly Attendance Summary (Styled Row Cards) */}
              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between px-4 text-md font-semibold text-sky-500 text-nowrap">
                  <div className="w-16">Day</div>
                  <div className="w-9 text-center">Date</div>
                  <div className="w-20 text-center">Check-in</div>
                  <div className="w-20 text-center">Check-out</div>
                  <div className="w-20 text-center">Late By</div>
                  <div className="w-24 text-center">Hours Worked</div>
                </div>
                {days.map((day, index) => {
                  const isToday = isSameDay(day, new Date());
                  const isWeekend = format(day, 'EEE') === 'Sun' || format(day, 'EEE') === 'Sat';
                  const record = user.find(
                    (rec) => rec.date === format(day, 'yyyy-MM-dd')
                  ) || [];

                  // console.log("user", user)

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between bg-white shadow rounded-lg px-4 py-3 ${isToday ? 'border-2 border-blue-500' : ''
                        }`}
                    >
                      {/* Day Name */}
                      <div className="text-sm font-medium w-16 text-gray-800">
                        {format(day, 'EEE')}
                      </div>

                      {/* Date in Circle */}
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-800">
                        {format(day, 'dd')}
                      </div>

                      {/* Check-out */}
                      <div className="text-xs text-gray-600 w-20 text-center">
                        {record?.inTime ?? '--'}
                      </div>
                      {/* Check-in */}
                      <div className="text-xs text-gray-600 w-20 text-center">
                        {record?.outTime ?? '--'}
                      </div>

                      <div className="text-xs text-red-500 w-20 text-center">
                        {record ? calculateLateBy(record.inTime) : '--'}
                      </div>

                      <div className="text-xs text-green-600 w-24 text-center">
                        {record?.duration ?? '00:00'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )
        }

        {
          activeTab === "All-Holidays" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-blue-600">🎉</span> All Holidays
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {indianHolidays2025.map((holiday) => {
                  const dateObj = new Date(holiday.date);
                  const day = dateObj.getDate();
                  const month = dateObj.toLocaleString('default', { month: 'short' });
                  const weekday = dateObj.toLocaleString('default', { weekday: 'long' });

                  return (
                    <div
                      key={holiday.date}
                      className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition duration-300"
                    >
                      <p className="text-gray-500 text-sm mb-1">
                        {`${day} - ${month}, ${weekday}`}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-800">{holiday.name}</h3>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        }
        {
          activeTab === 'Time Logs' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-blue-600">🕒</span> Time Logs
              </h2>
              <p className="text-gray-500">No time logs available yet.</p>
            </div>
          )
        }


      </div>
    </div>
  );
};

export default UserDashboard;
