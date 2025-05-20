import { format, subDays, addDays } from 'date-fns';

// Interface for attendance records
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'half-day' | 'weekend' | 'holiday' | 'leave';
  workHours: number | null;
  notes: string;
}

// Interface for structuring calendar data
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  status?: 'present' | 'absent' | 'half-day' | 'weekend' | 'holiday' | 'leave';
}

// Function to generate a random time between 8:30 AM and 9:30 AM
const getRandomCheckInTime = (): string => {
  const hour = 8 + (Math.random() > 0.7 ? 1 : 0);
  const minute = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

// Function to generate a random time between 5:00 PM and 6:30 PM
const getRandomCheckOutTime = (): string => {
  const hour = 17 + (Math.random() > 0.5 ? 1 : 0) + (Math.random() > 0.7 ? 1 : 0);
  const minute = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

// Function to calculate work hours between check-in and check-out
const calculateWorkHours = (checkIn: string | null, checkOut: string | null): number | null => {
  if (!checkIn || !checkOut) return null;
  
  const [checkInHour, checkInMinute] = checkIn.split(':').map(Number);
  const [checkOutHour, checkOutMinute] = checkOut.split(':').map(Number);
  
  const checkInMinutes = checkInHour * 60 + checkInMinute;
  const checkOutMinutes = checkOutHour * 60 + checkOutMinute;
  
  // Calculate the difference in hours, rounded to 1 decimal place
  return Math.round((checkOutMinutes - checkInMinutes) / 6) / 10;
};

// Generate last 90 days of attendance data for a specific employee
export const generateAttendanceData = (employeeId: string, employeeName: string): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Generate records for the last 90 days
  for (let i = 90; i >= 0; i--) {
    const currentDate = subDays(today, i);
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Determine if it's a weekend
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Random holiday (about 5% of weekdays)
    const isHoliday = !isWeekend && Math.random() < 0.05;
    
    // Random leave (about 10% of weekdays, not on holidays)
    const isLeave = !isWeekend && !isHoliday && Math.random() < 0.1;
    
    // Random absence (about 5% of weekdays, not on holidays or leaves)
    const isAbsent = !isWeekend && !isHoliday && !isLeave && Math.random() < 0.05;
    
    // Determine status
    let status: AttendanceRecord['status'];
    let checkIn: string | null = null;
    let checkOut: string | null = null;
    let workHours: number | null = null;
    let notes = '';
    
    if (isWeekend) {
      status = 'weekend';
      notes = 'Weekend';
    } else if (isHoliday) {
      status = 'holiday';
      notes = 'Public Holiday';
    } else if (isLeave) {
      status = 'leave';
      notes = Math.random() > 0.5 ? 'Sick Leave' : 'Paid Leave';
    } else if (isAbsent) {
      status = 'absent';
      notes = 'Absent';
    } else {
      // Present or half-day
      const isHalfDay = Math.random() < 0.08;
      status = isHalfDay ? 'half-day' : 'present';
      
      checkIn = getRandomCheckInTime();
      
      if (isHalfDay && Math.random() > 0.5) {
        // Half day (morning only)
        checkOut = `${(12 + Math.floor(Math.random() * 2)).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
        notes = 'Half day (left early)';
      } else if (isHalfDay) {
        // Half day (afternoon only)
        checkIn = `${(12 + Math.floor(Math.random() * 2)).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
        checkOut = getRandomCheckOutTime();
        notes = 'Half day (arrived late)';
      } else {
        // Full day
        checkOut = getRandomCheckOutTime();
        notes = '';
      }
      
      workHours = calculateWorkHours(checkIn, checkOut);
    }
    
    records.push({
      id: `ATT-${employeeId}-${dateStr}`,
      employeeId,
      employeeName,
      date: dateStr,
      checkIn,
      checkOut,
      status,
      workHours,
      notes
    });
  }
  
  return records;
};

// Generate attendance data for all employees
export const generateAllEmployeesAttendance = (): AttendanceRecord[] => {
  const employeeBaseData = [
    { id: 'EMP001', name: 'John Smith' },
    { id: 'EMP002', name: 'Sarah Johnson' },
    { id: 'EMP003', name: 'Michael Chen' },
    { id: 'EMP004', name: 'Emily Davis' },
    { id: 'EMP005', name: 'David Wilson' },
    { id: 'EMP006', name: 'Sophia Martinez' },
    { id: 'EMP007', name: 'James Taylor' },
    { id: 'EMP008', name: 'Olivia Brown' },
    { id: 'EMP009', name: 'William Lee' },
    { id: 'EMP010', name: 'Emma Garcia' }
  ];
  
  let allRecords: AttendanceRecord[] = [];
  
  employeeBaseData.forEach(employee => {
    const employeeRecords = generateAttendanceData(employee.id, employee.name);
    allRecords = [...allRecords, ...employeeRecords];
  });
  
  return allRecords;
};

// Get attendance for a specific employee
export const getEmployeeAttendance = (employeeId: string): AttendanceRecord[] => {
  return attendanceData.filter(record => record.employeeId === employeeId);
};

// Get attendance for a specific date range
export const getAttendanceByDateRange = (startDate: string, endDate: string): AttendanceRecord[] => {
  return attendanceData.filter(record => record.date >= startDate && record.date <= endDate);
};

// Generate calendar days for a month
export const generateCalendarDays = (month: number, year: number, employeeId?: string): CalendarDay[] => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Get the day of the week for the first day (0-6)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  const days: CalendarDay[] = [];
  const today = new Date();
  
  // Add days from previous month to start the calendar from Sunday
  const daysFromPreviousMonth = firstDayOfWeek;
  for (let i = daysFromPreviousMonth - 1; i >= 0; i--) {
    const date = subDays(firstDayOfMonth, i + 1);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false
    });
  }
  
  // Add days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isToday = 
      date.getDate() === today.getDate() && 
      date.getMonth() === today.getMonth() && 
      date.getFullYear() === today.getFullYear();
    
    const dayObj: CalendarDay = {
      date,
      isCurrentMonth: true,
      isToday
    };
    
    // If employeeId is provided, add status from attendance data
    if (employeeId) {
      const dateStr = format(date, 'yyyy-MM-dd');
      const record = attendanceData.find(r => r.employeeId === employeeId && r.date === dateStr);
      if (record) {
        dayObj.status = record.status;
      }
    }
    
    days.push(dayObj);
  }
  
  // Add days from next month to complete the last week
  const remainingDays = 42 - days.length; // 6 rows of 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const date = addDays(lastDayOfMonth, i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false
    });
  }
  
  return days;
};

// Public holidays for the year (simplified)
export const publicHolidays = [
  { date: '2025-01-01', name: 'New Year\'s Day' },
  { date: '2025-01-20', name: 'Martin Luther King Jr. Day' },
  { date: '2025-02-17', name: 'Presidents\' Day' },
  { date: '2025-05-26', name: 'Memorial Day' },
  { date: '2025-07-04', name: 'Independence Day' },
  { date: '2025-09-01', name: 'Labor Day' },
  { date: '2025-10-13', name: 'Columbus Day' },
  { date: '2025-11-11', name: 'Veterans Day' },
  { date: '2025-11-27', name: 'Thanksgiving Day' },
  { date: '2025-12-25', name: 'Christmas Day' }
];

// Generate all attendance data
export const attendanceData = generateAllEmployeesAttendance();