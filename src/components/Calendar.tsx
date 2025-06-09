// Calendar.tsx
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';

const Calendar = ({ attendanceData }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();


  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="text-gray-600 hover:text-gray-800">&lt;</button>
      <h2 className="text-xl font-bold text-gray-800">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="text-gray-600 hover:text-gray-800">&gt;</button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const date = new Date();
    const weekStart = startOfWeek(date);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-sm font-medium text-center text-gray-500 uppercase">
          {format(addDays(weekStart, i), 'EEE')}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
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
        const status = attendanceData?.[formattedDate]
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
          key={day.toString()}
          className={`h-20 p-1 text-sm border rounded-lg flex flex-col items-center justify-start relative ${
            isToday ? 'bg-blue-100 text-blue-600 font-semibold' : isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
          }
          
          ${isSunday ? 'bg-red-100' : ''}`}
          
        >
          <div className="text-sm">{format(day, 'd')}</div>
          {status && (
            <div className={`text-[11px] mt-1 font-medium absolute bottom-0 ${getStatusColor(status)}`}>
              {status} 
            </div>
          )}
        </div>
      );
        day = addDays(day, 1);
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
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
