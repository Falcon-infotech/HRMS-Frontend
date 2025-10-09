import axios from '../../constants/axiosInstance';
import { addDays, addWeeks, endOfWeek, format, isSameDay, startOfWeek, subWeeks } from 'date-fns';
import { CalendarHeart } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { BASE_URL, timeZone } from '../../constants/api';
import Calendar from '../../components/Calendar';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';

const AttendanceStatus = () => {

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [elapsed, setElapsed] = useState('00:00:00');
    const [selected, setSelected] = useState(null);

    const [attendanceData, setAttendanceData] = useState<any>({});

    const { user: userDetails } = useSelector((state: RootState) => state.auth);
    const joiningDate = userDetails?.joining_date ? new Date(userDetails.joining_date) : null;
    const today = new Date();


    const [user, setUser] = useState<any>(null);

    function extractHourAndMinute(isoString) {
        const date = new Date(isoString);
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    const getStatusColor = (status, isBorder = false) => {
        switch (status) {
            case 'Absent':
                return isBorder ? 'text-red-500 border border-red-300 bg-red-50' : 'bg-red-400';
            case 'Weekend':
                return isBorder ? 'text-yellow-600 border border-yellow-400 bg-yellow-50' : 'bg-yellow-400';
            case 'Active':
            case 'Present':
                return isBorder ? 'text-green-600 border border-green-400 bg-green-50' : 'bg-green-400';
            case 'Leave':
                return isBorder ? 'text-red-500 border border-red-300 bg-red-50' : 'bg-orange-500';
            case 'Half Day':
                return isBorder ? 'text-purple-500 border border-gray-300 bg-gray-100' : 'bg-gray-300';
            default:
                return isBorder ? 'text-red-500 border border-red-300 bg-red-50' : 'bg-red-400';

        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/attendance/login_user_attendance_history`,);
                console.log(res.data?.data)
                setUser(res.data.data);
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };
        fetchUser();
    }, [])


    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/attendance/login_user_attendance_history`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
                    }
                });
                const records = res.data?.data || [];
                // console.log(records, "records")

                const mapped: Record<string, { status: string; duration: string; location?: string; inTime: string; outTime: string; checkIn: string; checkOut: string }> = {};
                records.forEach((record: any) => {
                    mapped[record.date] = {
                        status: record.status,
                        duration: record.duration || '00:00',
                        checkIn: record.location?.checkIn?.displayName || 'Unknown',
                        checkOut: record.location?.checkOut?.displayName || 'Unknown',
                        inTime: record.inTime,
                        outTime: record.outTime
                    }
                });
                setAttendanceData(mapped);
            } catch (err) {
                console.error('Error fetching attendance', err);
            }
        };

        fetchAttendance();
    }, []);


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


    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));


    const [activeTab, setActiveTab] = useState('Weeekly Attendance');


    const menuItems = [
        "Weeekly Attendance",
        "Monthly Attendance",
    ];


    const [todayChekout, setTodayCheckout] = useState(null);

    const fetchStatus = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/attendance/single_user_today_attendance`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
                }
            });

            // console.log(res.data?.attendance?.location.displayName, "location")
            setTodayCheckout(res.data.attendance)


        } catch (error) {
            console.error('Failed to fetch status', error);
        }
    };



    useEffect(() => {
        fetchStatus()
    }, [])


    const formatter = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        hour12: true
    });
    // const customFormattedDateTime = formatter.format(now);
    // console.log(customFormattedDateTime);

    return (
        <>
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
            {
                activeTab === 'Weeekly Attendance' && (
                    <>
                        <div className="max-w-7xl mx-auto p-4 bg-white rounded shadow">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={handlePrevWeek}
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 sm:text-sm text-nowrap text-xs"
                                >
                                    ← Prev
                                </button>

                                <div className="font-semibold text-xs sm:text-lg cursor-pointer relative flex gap-4"><span onClick={() => setShowCalendar(!showCalendar)}><CalendarHeart /></span>
                                    <span>
                                        {format(weekStart, 'dd MMM')} – {format(weekEnd, 'dd MMM yyyy')}
                                    </span>

                                    {showCalendar && (
                                        <div className="absolute z-10 mt-2">
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
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 sm:text-sm text-nowrap text-xs"
                                >
                                    Next →
                                </button>
                            </div>

                            {/* Week Grid */}
                            <div className="grid grid-cols-7 gap-2 text-center text-sm">
                                {days.map((day, index) => (
                                    <div
                                        key={index}
                                        className={`sm:p-3 p-1 rounded-lg cursor-pointer 
                                    ${isSameDay(day, new Date()) ? 'border border-blue-500' : ''}
                                    bg-blue-100 text-blue-800 hover:bg-blue-200`}
                                    >
                                        <div className="font-semibold">{format(day, 'EEE')}</div>
                                        <div>{format(day, 'dd')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="  bg-white p-4 rounded-lg shadow mt-6 flex items-center justify-between">
                            <p className="text-gray-600 text-lg m-2">
                                General [ 09:00 AM - 6:00 PM ]
                            </p>

                            <div className="flex items-center gap-2">
                                {/* Check-in Badge */}
                                {/* <div className="flex flex-col bg-green-500 text-white px-4 py-2 rounded-lg shadow">
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
                                </div> */}

                                {/* Clock Icon Button */}
                                {/* <button className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-green-500 -mx-5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m4-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button> */}
                            </div>
                        </div>
                        {/* Weekly Attendance Summary (Styled Row Cards) */}
                        <div className="overflow-x-auto w-full mt-6 rounded-xl bg-gray-50 shadow-md">
                            <div className="min-w-[600px] space-y-4 p-4">

                                {/* Header */}
                                <div className="flex items-center justify-between text-sm sm:text-md font-semibold text-sky-500 whitespace-nowrap">
                                    <div className="w-16">Day</div>
                                    <div className="w-12 text-center">Date</div>
                                    <div className="w-24 text-center">Check-in</div>
                                    <div className="w-24 text-center">Check-out</div>
                                    <div className="w-24 text-center">Status</div>
                                    <div className="w-28 text-center">Hours Worked</div>
                                </div>

                                {/* Rows */}
                                {days.map((day, index) => {
                                    const isToday = isSameDay(day, new Date());
                                    const record = user?.find(
                                        (rec: any) => rec.date === format(day, 'yyyy-MM-dd')
                                    ) || {};

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setSelected(format(day, 'yyyy-MM-dd'))}
                                            className={`flex flex-col bg-white rounded-lg px-4 py-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${isToday || selected === format(day, 'yyyy-MM-dd') ? 'border-2 border-blue-500' : ''
                                                }`}
                                        >
                                            {/* Row Content */}
                                            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-800">
                                                <div className="w-16 font-medium">{format(day, 'EEE')}</div>
                                                <div className="w-12 h-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                                                    {format(day, 'dd')}
                                                </div>
                                                <div className="w-24 text-center">
                                                    {record.inTime
                                                        ? `${new Date(record.inTime).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })} ${timeZone(userDetails.timeZone)}`
                                                        : "--"}

                                                </div>
                                                {record.outTime
                                                        ? `${new Date(record.outTime).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })} ${timeZone(userDetails.timeZone)}`
                                                        : "--"}
                                                <div className="w-24 text-center">{record?.status ?? '--'}</div>
                                                <div className="w-28 text-center text-green-600">{record?.duration ?? '00:00'}</div>
                                            </div>

                                            {/* Status Line */}
                                            {joiningDate && day >= joiningDate && day <= today && (
                                                <div className="flex items-center justify-between mt-3 px-1 relative">
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full" />
                                                    {/* <div className={`flex-1 h-0.5 mx-2 ${getStatusColor(record?.status)}`} /> */}

                                                    <div className="flex-1 mx-2 h-1 relative overflow-hidden rounded-full">
                                                        <div
                                                            className={`absolute inset-0 ${isToday && todayChekout?.inTime && !todayChekout?.outTime
                                                                ? 'animate-dash bg-[linear-gradient(to_right,gray_50%_50%,transparent_0)] bg-repeat-x [background-size:20px_1px] ltr'
                                                                : 'bg-gray-300'
                                                                }`}
                                                        />
                                                    </div>

                                                    <span className="w-2 h-2 bg-gray-400 rounded-full" />
                                                    <span className={`absolute left-1/2 -translate-x-1/2 -top-2.5 text-[11px] px-2 py-1 rounded-full border ${getStatusColor(record?.status, true)}`}>
                                                        {record?.status ?? 'Absent'}
                                                    </span>
                                                </div>
                                            )}


                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </>
                )
            }


            {activeTab === "Monthly Attendance" && <div>
                <div className='font-bold mt-20 ' >
                    <h1 className='text-3xl text-center'>Monthly Attendance</h1>
                </div>
                <div className='mt-10 w-full border'>
                    <Calendar attendanceData={attendanceData} />

                </div>

            </div>}
        </>
    )
}

export default AttendanceStatus