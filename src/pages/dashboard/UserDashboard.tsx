import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../constants/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Loading from '../../components/Loading';



const UserDashboard = () => {
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

  const [elapsed, setElapsed] = useState('00:00:00');
  const [activeTab, setActiveTab] = useState('Activities');
  // const [selected, setSelected] = useState(null);


  const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const userDetails = useSelector((state: RootState) => state.auth.user)

  const [attendanceData, setAttendanceData] = useState<any>({});
  const [checkinLoading, setCheckinLoading] = useState(false);
  //
  // const [selectedDate, setSelectedDate] = useState(new Date());
  // const [showCalendar, setShowCalendar] = useState(false);
  const [holidays, setHolidays] = useState<any[]>([]);


  // const [isFormOpen, setIsFormOpen] = useState(false);
  // const [isEditMode, setIsEditMode] = useState(false);
  // const [selectedHoliday, setSelectedHoliday] = useState(null);




  // const { user: Users } = useSelector((state: RootState) => state.auth);
  // const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday
  // const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
  // const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // const handlePrevWeek = () => {
  //   setSelectedDate(prev => subWeeks(prev, 1));
  // };

  // const handleNextWeek = () => {
  //   setSelectedDate(prev => addWeeks(prev, 1));
  // };

  // const handleDateChange = (date: Date) => {
  //   setSelectedDate(date);
  //   setShowCalendar(false);
  // };

  //

  const fetchHolidays = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/holidays/all_holidays`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
        }
      });


      const data = await response.json();
      // console.log(data.data)
      setHolidays(data.data || [])
    } catch (error) {
      console.error('Error fetching holidays', error);
    }
  }

  // const handleDeleteHoliday = async (id: string) => {
  //   try {
  //     await axios.delete(`${BASE_URL}/api/holidays/delete_holiday/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
  //       }
  //     });
  //     fetchHolidays();
  //   } catch (error) {
  //     console.error("Error deleting holiday:", error);
  //   }
  // };

  useEffect(() => {
    fetchHolidays();
  }, [])
  const today = new Date();
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear();
  const holidatsThisMonth = holidays.filter(holiday => {
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
  // useEffect(() => {
  //   console.log(
  //     "first",
  //     format(weekStart, 'dd-MM-yyyy'),
  //     format(weekEnd, 'dd-MM-yyyy')
  //   );
  // })


  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/attendance/single_user_attendance_history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
          }
        });
        const records = res.data?.data?.attendance || [];
        // console.log(records, "records")

        const mapped: any = {};
        records.forEach((record: any) => {
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

  // const getStatusColor = (status, isBorder = false) => {
  //   switch (status) {
  //     case 'Absent':
  //       return isBorder ? 'text-red-500 border border-red-300 bg-red-50' : 'bg-red-400';
  //     case 'Weekend':
  //       return isBorder ? 'text-yellow-600 border border-yellow-400 bg-yellow-50' : 'bg-yellow-400';
  //     case 'Active':
  //     case 'Present':
  //       return isBorder ? 'text-green-600 border border-green-400 bg-green-50' : 'bg-green-400';
  //     case 'Leave':
  //       return isBorder ? 'text-red-500 border border-red-300 bg-red-50' : 'bg-red-400';
  //     default:
  //       return isBorder ? 'text-purple-500 border border-gray-300 bg-gray-100' : 'bg-gray-300';
  //   }
  // };



  // const weekRange = `${weekData[0]?.fullDate?.toLocaleDateString('en-GB', {
  //   day: '2-digit',
  //   month: 'short',
  //   year: 'numeric',
  // })} - ${weekData[6]?.fullDate?.toLocaleDateString('en-GB', {
  //   day: '2-digit',
  //   month: 'short',
  //   year: 'numeric',
  // })}`;

  // const calculateLateBy = (inTime) => {
  //   console.log(inTime)
  //   if (!inTime) return '--';
  //   const sep = inTime.split(" ")[0]

  //   const [hours, minutes] = sep.split(':').map(Number);
  //   console.log(hours, minutes)
  //   const inDate = new Date();
  //   inDate.setHours(hours, minutes);

  //   const expected = new Date();
  //   expected.setHours(9, 0); // 09:00 AM

  //   if (inDate <= expected) return '00:00';

  //   const diffMs = inDate - expected;
  //   const diffMins = Math.floor(diffMs / 60000);
  //   const h = Math.floor(diffMins / 60);
  //   const m = diffMins % 60;

  //   return `${h}h ${m}m`;
  // };
  // function extractHourAndMinute(isoString) {
  //   const date = new Date(isoString);
  //   const hours = String(date.getUTCHours()).padStart(2, '0');
  //   const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  //   return `${hours}:${minutes}`;
  // }
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/attendance/single_user_attendance_history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
          }
        });
        // console.log(res.data.data)
        setUser(res.data.data.attendance);
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    fetchUser();
  }, [])



  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';



  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [isOnLeave, setIsOnLeave] = useState(false);
  const fetchStatus = async () => {
    setIsStatusLoading(true);

    try {
      const res = await axios.get(`${BASE_URL}/api/attendance/single_user_today_attendance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
        }
      });

      // console.log(res.data.attendance)
      if (res.data?.attendance?.status === "Leave") {
        setIsOnLeave(true)
      }
      if (res?.data?.attendance?.inTime) {
        setCheckInTime(res.data?.attendance?.inTime);
        localStorage.setItem('lastCheckInTime', res.data?.attendance?.inTime);
      }
      if (res?.data?.attendance?.outTime) {
        setCheckOutTime(res.data.attendance?.outTime);
        setHasCheckedOut(true);
      }
    } catch (error) {
      console.error('Failed to fetch status', error);
      const storedCheckIn = localStorage.getItem('lastCheckInTime');
      if (storedCheckIn) {
        setCheckInTime(storedCheckIn);
      }
    } finally {
      setIsStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);



  useEffect(() => {
    let timer: any;

    const updateElapsedTime = () => {
      if (checkInTime && !hasCheckedOut) {
        const startTime = new Date(checkInTime);
        const now = new Date();
        const elapsedTime = new Date(now.getTime() - startTime.getTime());
        const hours = String(elapsedTime.getUTCHours()).padStart(2, '0');
        const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
        const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');
        setElapsed(`${hours}:${minutes}:${seconds}`);
      } else if (checkInTime && checkOutTime) {
        const startTime = new Date(checkInTime);
        const endTime = new Date(checkOutTime);
        const elapsedTime = new Date(endTime.getTime() - startTime.getTime());
        const hours = String(elapsedTime.getUTCHours()).padStart(2, '0');
        const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
        const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');
        setElapsed(`${hours}:${minutes}:${seconds}`);
      }
    };

    // 🟢 Immediately calculate once, even before interval starts
    updateElapsedTime();

    if (checkInTime && !hasCheckedOut) {
      timer = setInterval(updateElapsedTime, 1000);
    }

    return () => clearInterval(timer);
  }, [checkInTime, hasCheckedOut, checkOutTime]);


  // made changes here for attendence statas update

  const handleCheckIn = async () => {

    const token = localStorage.getItem('tokenId');

    try {
      setCheckinLoading(true)
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
      const payload = {
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      };
      const response = await axios.post(`${BASE_URL}/api/attendance/check_in`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      // console.log(response.data)
      const inTime = response.data?.attendance?.inTime;

      setCheckInTime(inTime);
      localStorage.setItem('lastCheckInTime', inTime);
      // setCheckInTime(response.data.attendance.inTime);
      toast.success('Checked in successfully');
      fetchStatus();
    } catch (error: any) {
      console.log(error)
      toast.error('Error checking in', error);
    } finally {
      setCheckinLoading(false)
    }
  };

  const handleCheckOut = async () => {
    const token = localStorage.getItem('tokenId');
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
      const payload = {
        location: {

          latitude: position.coords.latitude,
          longitude: position.coords.longitude,

        }
      };
      await axios.post(
        `${BASE_URL}/api/attendance/check_out`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHasCheckedOut(true);
      localStorage.removeItem('lastCheckInTime');
      toast.success('Checked out successfully');
    } catch (error) {
      toast.error('Error checking out');
    }
  };
  //  useEffect(() => {
  //         navigator.geolocation.getCurrentPosition(
  //             (position) => {
  //                 console.log("Latitude:", position.coords.latitude);
  //                 console.log("Longitude:", position.coords.longitude);
  //             },
  //             (error) => {
  //                 console.error("Location error:", error.message);
  //             }
  //         );

  //     }, [])
  // const menuItems = [
  //   "Activities",
  //   "Attendance",
  //   // "Time Logs",
  //   // "All-Holidays",
  //   "Monthly-Attendance"
  // ];


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
                    <p className="font-semibold">{holiday.reason}</p>
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
    <>
      {
        isStatusLoading ? <div> <Loading text={"Loading..."} /></div> : <>
          <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-full mx-auto border rounded-xl shadow-lg bg-white">

            <div className="lg:w-1/3 w-full flex flex-col items-center justify-center border p-6 rounded-xl bg-gray-50">
              <div className="flex flex-col items-center gap-4 text-center">

                <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md">
                  <img
                    src="https://contacts.zoho.in/file?ID=60028830319&fs=thumb"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h1 className="text-2xl font-bold">{userDetails?.name || capitalize(userDetails?.first_name) + " " + capitalize(userDetails?.last_name)}</h1>


                  <p className="text-sm text-gray-400">{userDetails?.email}</p>
                  <p className="text-lg text-gray-600 mt-1 font-bold">{userDetails?.designation}</p>
                  {!checkInTime && (
                    <p className="text-red-500 font-semibold mt-2">Yet to check In </p>
                  )}
                </div>

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

                <div className="mt-6 text-center">
                  {isOnLeave ? (
                    <>
                      <p className="text-red-500 font-semibold mb-3">You are on leave today. Check-in is disabled.</p>
                      <button
                        className="bg-gray-400 text-white px-6 py-2 rounded-lg shadow cursor-not-allowed"
                        disabled
                      >
                        Check In 
                      </button>
                    </>
                  ) : (
                    !checkInTime ? (
                      <button
                        onClick={handleCheckIn}
                        className="bg-green-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition duration-300"
                        disabled={checkinLoading}
                      >
                        {checkinLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 rounded-full border-blue-400 border-t-yellow-500 animate-spin" />
                            <span>Checking-In...</span>
                          </div>
                        ) : (
                          "Check In"
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleCheckOut}
                        className={`${hasCheckedOut ? "bg-blue-500" : "bg-red-500"} hover:bg-blue-400 text-white px-6 py-2 rounded-lg shadow transition duration-300`}
                        disabled={hasCheckedOut}
                      >
                        {hasCheckedOut ? 'Checked Out' : 'Check Out'}
                      </button>
                    )
                  )}
                </div>

              </div>
            </div>

            <div className="flex-1 border rounded-xl bg-gray-50 p-4">
              <div className="flex flex-wrap border-b mb-4">
                {["Activities"].map((item) => (
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

              {activeTab === 'Activities' && (
                <ActivitiesTab />
              )
              }


            </div>
          </div>
        </>
      }
    </>
  );
};

export default UserDashboard;
