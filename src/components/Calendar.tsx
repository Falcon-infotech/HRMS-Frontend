// Calendar.tsx
import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

const Calendar = ({ attendanceData }:any) => {

  console.log(attendanceData)
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const { user } = useSelector((state: RootState) => state.auth);
  const joiningDate = user?.joining_date ? new Date(user?.joining_date) : null;


  // drawer component
  const [selectedDate, setSelectedDate] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // console.log(attendanceData)
  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 sm:text-sm text-nowrap text-xs">  ← Prev </button>
      <h2 className="text-xl font-bold text-gray-800">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 sm:text-sm text-nowrap text-xs">  Next →</button>
    </div>
  );


  const handleCellClick = (day: Date, record) => {
    setSelectedDate({
      day,
      ...record
    });
    setDrawerOpen(true);
    // console.log("clicked")
  };

  // useEffect(() => {
  //   // console.log(selectedDate, "selectedDate")
  // })

  const renderDays = () => {
    const days = [];
    const date = new Date();
    const weekStart = startOfWeek(date);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="  text-sm sm:text-base lg:text-lg font-medium text-center text-gray-500 uppercase">
          {format(addDays(weekStart, i), 'EEE')}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2 ">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, today);
        const formattedDate = format(day, 'yyyy-MM-dd');
        const record = attendanceData?.[formattedDate];
        const status = record?.status;
        const duration = record?.duration;
        const isSunday = day.getDay() === 0;

        const getStatusColor = (status: string) => {
          switch (status) {
            case 'Present':
              return 'text-green-600';
            case 'Absent':
              return 'text-red-500';
            case 'Leave':
              return 'text-yellow-500';
            case 'Half Day':
              return 'text-blue-500';
            default:
              return 'text-gray-400';
          }
        };

        days.push(
          <div
            key={cloneDay.toString()}
            onClick={() => handleCellClick(cloneDay, record)}
            className={`sm:h-20 h-12 p-1 border rounded-lg flex flex-col items-center justify-start relative
               ${isToday ? 'bg-blue-100 text-blue-600 font-semibold' : isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                ${isSunday ? 'bg-red-100' : ''}`}
          >
            <div className="text-sm sm:text-base lg:text-lg">{format(cloneDay, 'd')}</div>
            <div className="absolute bottom-1 flex flex-col items-center text-nowrap leading-tight">
              {/* Status */}
              <div
                className={`text-[11px] max-sm:text-[7px] font-medium ${getStatusColor(status || (day <= today && !isSunday ? 'Absent' : ''))}`}
              >
                {joiningDate && day >= joiningDate && day <= today
                  ? status || (isSunday ? '' : 'Absent')
                  : ''}

              </div>

              {/* Duration */}
              <div
                className={`text-[10px] max-sm:text-[6px] ${getStatusColor(status || (day <= today && !isSunday ? 'Absent' : ''))}`}
              >
                {day <= today ? (duration ? duration.slice(0, 5) : (isSunday ? '' : '')) : ''}
              </div>
            </div>

          </div>
        );

        day = addDays(day, 1); // ✅ move to the next day
      }

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );

      days = [];
    }


    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      {drawerOpen && selectedDate && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Bottom Drawer */}
          {drawerOpen && (
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
                        {format(selectedDate.day, 'EEEE, MMMM d, yyyy')}
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
                  <div className="space-y-6 text-gray-700 max-w-md mx-auto">
                    {/* Status & Duration */}
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div className="flex items-start gap-3">
                        <FaCheckCircle
                          className={`mt-1 text-lg ${selectedDate.status === 'Present'
                              ? 'text-green-500'
                              : selectedDate.status === 'Half Day'
                                ? 'text-blue-500'
                                : selectedDate.status === 'Leave'
                                  ? 'text-yellow-500'
                                  : selectedDate.status === 'Absent'
                                    ? 'text-red-500'
                                    : 'text-gray-400'
                            }`}
                        />
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="font-medium text-base">{selectedDate.status || 'No Data'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FaClock className="mt-1 text-blue-500 text-lg" />
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium text-base">{selectedDate.duration || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Check-In & Check-Out */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Check-In */}
                      <div className="flex items-start gap-3 p-4 rounded">
                        <FaMapMarkerAlt className="text-rose-500 text-lg mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Check-In</p>
                          <p className="text-balance text-gray-500 font-semibold mt-1">Time:</p>
                          <p className="text-base text-gray-800 font-medium">
                            {selectedDate.inTime ? format(new Date(selectedDate.inTime), 'hh:mm a') : '-'}
                          </p>
                          <p className="text-balance text-gray-500 font-semibold mt-2">Location:</p>
                          <p className="text-sm text-gray-700">
                            {selectedDate.checkIn || 'Location not available'}
                          </p>
                        </div>
                      </div>

                      {/* Check-Out */}
                      <div className="flex items-start gap-3 p-4 rounded">
                        <FaMapMarkerAlt className="text-rose-500 text-lg mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Check-Out</p>
                          <p className="text-balance text-gray-500 font-semibold mt-1">Time:</p>
                          <p className="text-base text-gray-800 font-medium">
                            {selectedDate.outTime ? format(new Date(selectedDate.outTime), 'hh:mm a') : '-'}
                          </p>
                          <p className="text-balance text-gray-500 font-semibold mt-2">Location:</p>
                          <p className="text-sm text-gray-700">
                            {selectedDate.checkOut || 'Location not available'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </>
      )}




    </div>
  );
};

export default Calendar;
