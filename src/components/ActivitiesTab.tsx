import React from 'react';

const ActivitiesTab = React.memo(({ userDetails, weekData, holidatsThisMonth, checkInTime }: {
  userDetails: any,
  weekData: any[],
  holidatsThisMonth: any[],
  checkInTime: any
}) => {
  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

// console.log(weekData)
  function getGreeing(){
    const hour=new Date().getHours();
    if(hour<12){
      return "Good Morning";
    }else if(hour<17){
      return "Good Afternoon";
    }
    return "Good Evening";
  }
  
// console.log(weekData)
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex justify-between items-center p-6 bg-white rounded-xl shadow">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{getGreeing()} <span className="text-blue-600">{userDetails?.name || capitalize(userDetails?.first_name) + " " + capitalize(userDetails?.last_name)}</span></h2>
          <p className="text-gray-500">Have a productive day!</p>
        </div>
        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
          ☀️
        </div>
      </div>

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
                <div className={`text-xs ${item.status==="-" ? "text-orange-500" :item.color}`}>{item.status==="-" ?"Absent":item.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holidays */}
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
});

export default ActivitiesTab;
