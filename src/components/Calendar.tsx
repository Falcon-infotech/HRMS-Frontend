// Calendar.tsx
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';

const Calendar = ({ attendanceData }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const { user } = useSelector((state: RootState) => state.auth);
  const joiningDate = user?.joining_date ? new Date(user.joining_date) : null;

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
    </div>
  );
};

export default Calendar;
