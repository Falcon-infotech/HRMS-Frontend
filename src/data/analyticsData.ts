import employeesData from './employeeData';
import { attendanceData } from './attendanceData';
import { leaveRequests } from './leaveData';
import { payrollData } from './payrollData';
import { performanceReviews } from './performanceData';
import { candidates } from './recruitmentData';
import { format, subMonths, getMonth, getYear } from 'date-fns';

// Types for analytics dashboards
export interface DashboardData {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  inactiveEmployees: number;
  departmentDistribution: {
    department: string;
    count: number;
  }[];
  genderDistribution: {
    gender: string;
    count: number;
  }[];
  employeeTypeDistribution: {
    type: string;
    count: number;
  }[];
  joiningSummary: {
    month: string;
    count: number;
  }[];
  attendanceSummary: {
    status: string;
    count: number;
  }[];
  leaveStats: {
    approved: number;
    pending: number;
    rejected: number;
  };
  performanceSummary: {
    rating: string;
    count: number;
  }[];
  recruitmentSummary: {
    status: string;
    count: number;
  }[];
}

// Types for attendance analytics
export interface AttendanceAnalytics {
  dailyAttendanceRate: {
    date: string;
    rate: number;
  }[];
  monthlyAttendanceRate: {
    month: string;
    rate: number;
  }[];
  averageArrivalTime: string;
  averageDepartureTime: string;
  attendanceByStatus: {
    status: string;
    count: number;
  }[];
  departmentAttendance: {
    department: string;
    rate: number;
  }[];
}

// Types for leave analytics
export interface LeaveAnalytics {
  leavesByType: {
    type: string;
    count: number;
  }[];
  leavesByMonth: {
    month: string;
    count: number;
  }[];
  leavesByDepartment: {
    department: string;
    count: number;
  }[];
  leaveApprovalRate: number;
  averageLeavesDuration: number;
  leavesStatusDistribution: {
    status: string;
    count: number;
  }[];
}

// Types for payroll analytics
export interface PayrollAnalytics {
  totalPayroll: {
    month: string;
    amount: number;
  }[];
  departmentPayroll: {
    department: string;
    amount: number;
  }[];
  salaryDistribution: {
    range: string;
    count: number;
  }[];
  compensationBreakdown: {
    component: string;
    percentage: number;
  }[];
  yearlyPayrollTrend: {
    year: string;
    amount: number;
  }[];
}

// Types for performance analytics
export interface PerformanceAnalytics {
  averageRatingByDepartment: {
    department: string;
    rating: number;
  }[];
  ratingDistribution: {
    range: string;
    count: number;
  }[];
  performanceTrend: {
    period: string;
    rating: number;
  }[];
  topPerformers: {
    name: string;
    department: string;
    rating: number;
  }[];
  goalCompletionRate: {
    department: string;
    rate: number;
  }[];
}

// Types for recruitment analytics
export interface RecruitmentAnalytics {
  applicationsByJob: {
    job: string;
    count: number;
  }[];
  applicationsBySource: {
    source: string;
    count: number;
  }[];
  candidatesByStage: {
    stage: string;
    count: number;
  }[];
  timeToHire: {
    job: string;
    days: number;
  }[];
  hiringTrend: {
    month: string;
    count: number;
  }[];
  offerAcceptanceRate: number;
}

// Generate main dashboard data
export const getDashboardData = (): DashboardData => {
  const today = new Date();
  
  // Count employees by status
  const activeEmployees = employeesData.filter(e => e.status === 'active').length;
  const onLeaveEmployees = employeesData.filter(e => e.status === 'on-leave').length;
  const inactiveEmployees = employeesData.filter(e => e.status === 'inactive').length;
  
  // Calculate department distribution
  const departmentCounts: { [key: string]: number } = {};
  employeesData.forEach(employee => {
    const dept = employee.department;
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });
  
  const departmentDistribution = Object.entries(departmentCounts)
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count);
  
  // Fake gender distribution (not in original data)
  const genderDistribution = [
    { gender: 'Male', count: Math.floor(employeesData.length * 0.55) },
    { gender: 'Female', count: Math.floor(employeesData.length * 0.43) },
    { gender: 'Non-binary', count: employeesData.length - Math.floor(employeesData.length * 0.55) - Math.floor(employeesData.length * 0.43) }
  ];
  
  // Calculate employee type distribution
  const employeeTypeCounts: { [key: string]: number } = {};
  employeesData.forEach(employee => {
    const type = employee.employeeType;
    employeeTypeCounts[type] = (employeeTypeCounts[type] || 0) + 1;
  });
  
  const employeeTypeDistribution = Object.entries(employeeTypeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
  
  // Calculate joining summary (last 12 months)
  const joiningSummary: { month: string; count: number }[] = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(today, i);
    const monthYear = format(date, 'MMM yyyy');
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const count = employeesData.filter(employee => {
      const joinDate = new Date(employee.joiningDate);
      return joinDate >= monthStart && joinDate <= monthEnd;
    }).length;
    
    joiningSummary.push({ month: monthYear, count });
  }
  
  // Calculate attendance summary for current month
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const currentMonthAttendance = attendanceData.filter(record => {
    const recordDate = new Date(record.date);
    return getMonth(recordDate) === currentMonth && getYear(recordDate) === currentYear;
  });
  
  const attendanceStatusCounts: { [key: string]: number } = {};
  currentMonthAttendance.forEach(record => {
    const status = record.status;
    attendanceStatusCounts[status] = (attendanceStatusCounts[status] || 0) + 1;
  });
  
  const attendanceSummary = Object.entries(attendanceStatusCounts)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
  
  // Calculate leave stats
  const leaveStats = {
    approved: leaveRequests.filter(req => req.status === 'approved').length,
    pending: leaveRequests.filter(req => req.status === 'pending').length,
    rejected: leaveRequests.filter(req => req.status === 'rejected').length
  };
  
  // Calculate performance summary
  const performanceRatings: { [key: string]: number } = {
    'Exceptional (4.5-5.0)': 0,
    'Exceeds Expectations (4.0-4.4)': 0,
    'Meets Expectations (3.0-3.9)': 0,
    'Needs Improvement (2.0-2.9)': 0,
    'Unsatisfactory (1.0-1.9)': 0
  };
  
  performanceReviews.forEach(review => {
    const rating = review.overallRating;
    
    if (rating >= 4.5) {
      performanceRatings['Exceptional (4.5-5.0)']++;
    } else if (rating >= 4.0) {
      performanceRatings['Exceeds Expectations (4.0-4.4)']++;
    } else if (rating >= 3.0) {
      performanceRatings['Meets Expectations (3.0-3.9)']++;
    } else if (rating >= 2.0) {
      performanceRatings['Needs Improvement (2.0-2.9)']++;
    } else {
      performanceRatings['Unsatisfactory (1.0-1.9)']++;
    }
  });
  
  const performanceSummary = Object.entries(performanceRatings)
    .map(([rating, count]) => ({ rating, count }))
    .filter(item => item.count > 0);
  
  // Calculate recruitment summary
  const candidateStatusCounts: { [key: string]: number } = {};
  candidates.forEach(candidate => {
    const status = candidate.status;
    candidateStatusCounts[status] = (candidateStatusCounts[status] || 0) + 1;
  });
  
  const recruitmentSummary = Object.entries(candidateStatusCounts)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
  
  return {
    totalEmployees: employeesData.length,
    activeEmployees,
    onLeaveEmployees,
    inactiveEmployees,
    departmentDistribution,
    genderDistribution,
    employeeTypeDistribution,
    joiningSummary,
    attendanceSummary,
    leaveStats,
    performanceSummary,
    recruitmentSummary
  };
};

// Generate attendance analytics data
export const getAttendanceAnalytics = (): AttendanceAnalytics => {
  const today = new Date();
  
  // Calculate daily attendance rate for last 30 days
  const dailyAttendanceRate: { date: string; rate: number }[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = subMonths(today, i / 30); // Approximation to get daily intervals
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const totalRecords = attendanceData.filter(record => record.date === dateStr).length;
    const presentRecords = attendanceData.filter(record => 
      record.date === dateStr && 
      (record.status === 'present' || record.status === 'half-day')
    ).length;
    
    const rate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;
    
    dailyAttendanceRate.push({
      date: format(date, 'MMM dd'),
      rate: Math.round(rate)
    });
  }
  
  // Calculate monthly attendance rate for last 6 months
  const monthlyAttendanceRate: { month: string; rate: number }[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(today, i);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const monthStr = format(date, 'MMM yyyy');
    
    const allRecordsInMonth = attendanceData.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= monthStart && recordDate <= monthEnd;
    });
    
    const totalWorkdays = allRecordsInMonth.filter(record => 
      record.status !== 'weekend' && record.status !== 'holiday'
    ).length;
    
    const presentDays = allRecordsInMonth.filter(record => 
      record.status === 'present' || record.status === 'half-day'
    ).length;
    
    const rate = totalWorkdays > 0 ? (presentDays / totalWorkdays) * 100 : 0;
    
    monthlyAttendanceRate.push({
      month: monthStr,
      rate: Math.round(rate)
    });
  }
  
  // Calculate average arrival and departure time (fake data since we don't have real times)
  const checkInTimes = attendanceData
    .filter(record => record.checkIn !== null)
    .map(record => record.checkIn as string);
  
  const checkOutTimes = attendanceData
    .filter(record => record.checkOut !== null)
    .map(record => record.checkOut as string);
  
  // Simple average of hour:minute strings (rough approximation)
  const averageTime = (times: string[]): string => {
    if (times.length === 0) return '00:00';
    
    let totalMinutes = 0;
    
    times.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      totalMinutes += hours * 60 + minutes;
    });
    
    const avgMinutes = Math.round(totalMinutes / times.length);
    const avgHours = Math.floor(avgMinutes / 60);
    const avgMins = avgMinutes % 60;
    
    return `${avgHours.toString().padStart(2, '0')}:${avgMins.toString().padStart(2, '0')}`;
  };
  
  const averageArrivalTime = averageTime(checkInTimes);
  const averageDepartureTime = averageTime(checkOutTimes);
  
  // Calculate attendance by status
  const statusCounts: { [key: string]: number } = {};
  attendanceData.forEach(record => {
    const status = record.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  const attendanceByStatus = Object.entries(statusCounts)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
  
  // Calculate department attendance (fabricated based on employee departmnents)
  const departmentEmployees: { [key: string]: string[] } = {};
  
  employeesData.forEach(employee => {
    const dept = employee.department;
    if (!departmentEmployees[dept]) {
      departmentEmployees[dept] = [];
    }
    departmentEmployees[dept].push(employee.id);
  });
  
  const departmentAttendance = Object.entries(departmentEmployees).map(([department, employeeIds]) => {
    // Calculate random rate between 85% and 98%
    const rate = 85 + Math.random() * 13;
    return { department, rate: Math.round(rate * 10) / 10 };
  }).sort((a, b) => b.rate - a.rate);
  
  return {
    dailyAttendanceRate,
    monthlyAttendanceRate,
    averageArrivalTime,
    averageDepartureTime,
    attendanceByStatus,
    departmentAttendance
  };
};

// Generate leave analytics data
export const getLeaveAnalytics = (): LeaveAnalytics => {
  // Calculate leaves by type
  const typeCounts: { [key: string]: number } = {};
  leaveRequests.forEach(request => {
    const type = request.leaveType;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  
  const leavesByType = Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
  
  // Calculate leaves by month
  const today = new Date();
  const leavesByMonth: { month: string; count: number }[] = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(today, i);
    const monthYear = format(date, 'MMM yyyy');
    const monthStart = format(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd');
    const monthEnd = format(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy-MM-dd');
    
    const count = leaveRequests.filter(request => 
      (request.startDate >= monthStart && request.startDate <= monthEnd) ||
      (request.endDate >= monthStart && request.endDate <= monthEnd)
    ).length;
    
    leavesByMonth.push({ month: monthYear, count });
  }
  
  // Calculate leaves by department (using employee data)
  const employeeDepartments: { [key: string]: string } = {};
  employeesData.forEach(employee => {
    employeeDepartments[employee.id] = employee.department;
  });
  
  const departmentLeaveCounts: { [key: string]: number } = {};
  leaveRequests.forEach(request => {
    const department = employeeDepartments[request.employeeId] || 'Unknown';
    departmentLeaveCounts[department] = (departmentLeaveCounts[department] || 0) + 1;
  });
  
  const leavesByDepartment = Object.entries(departmentLeaveCounts)
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count);
  
  // Calculate leave approval rate
  const totalRequests = leaveRequests.length;
  const approvedRequests = leaveRequests.filter(request => request.status === 'approved').length;
  const leaveApprovalRate = Math.round((approvedRequests / totalRequests) * 100);
  
  // Calculate average leave duration
  const leaveDurations = leaveRequests.map(request => request.daysCount);
  const totalDuration = leaveDurations.reduce((sum, duration) => sum + duration, 0);
  const averageLeavesDuration = Math.round((totalDuration / leaveDurations.length) * 10) / 10;
  
  // Calculate leaves status distribution
  const statusCounts: { [key: string]: number } = {};
  leaveRequests.forEach(request => {
    const status = request.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  const leavesStatusDistribution = Object.entries(statusCounts)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
  
  return {
    leavesByType,
    leavesByMonth,
    leavesByDepartment,
    leaveApprovalRate,
    averageLeavesDuration,
    leavesStatusDistribution
  };
};

// Generate payroll analytics data
export const getPayrollAnalytics = (): PayrollAnalytics => {
  // Calculate total payroll by month
  const months = Array.from(new Set(payrollData.map(item => item.period))).sort();
  
  const totalPayroll = months.map(month => {
    const amount = payrollData
      .filter(item => item.period === month)
      .reduce((sum, item) => sum + item.grossSalary, 0);
    
    return { month, amount };
  });
  
  // Calculate department payroll
  const employeeDepartments: { [key: string]: string } = {};
  employeesData.forEach(employee => {
    employeeDepartments[employee.id] = employee.department;
  });
  
  const departmentPayrollMap: { [key: string]: number } = {};
  
  // Use the latest month's data
  const latestMonth = months[months.length - 1];
  const latestPayroll = payrollData.filter(item => item.period === latestMonth);
  
  latestPayroll.forEach(item => {
    const department = employeeDepartments[item.employeeId] || 'Unknown';
    departmentPayrollMap[department] = (departmentPayrollMap[department] || 0) + item.grossSalary;
  });
  
  const departmentPayroll = Object.entries(departmentPayrollMap)
    .map(([department, amount]) => ({ department, amount }))
    .sort((a, b) => b.amount - a.amount);
  
  // Calculate salary distribution
  const ranges = [
    '0-5k', '5k-10k', '10k-15k', '15k-20k', '20k+'
  ];
  
  const salaryCounts: { [key: string]: number } = {};
  ranges.forEach(range => salaryCounts[range] = 0);
  
  latestPayroll.forEach(item => {
    const salary = item.grossSalary;
    
    if (salary < 5000) {
      salaryCounts['0-5k']++;
    } else if (salary < 10000) {
      salaryCounts['5k-10k']++;
    } else if (salary < 15000) {
      salaryCounts['10k-15k']++;
    } else if (salary < 20000) {
      salaryCounts['15k-20k']++;
    } else {
      salaryCounts['20k+']++;
    }
  });
  
  const salaryDistribution = Object.entries(salaryCounts)
    .map(([range, count]) => ({ range, count }))
    .filter(item => item.count > 0);
  
  // Calculate compensation breakdown
  const allEarnings: { [key: string]: number } = {};
  let totalCompensation = 0;
  
  latestPayroll.forEach(item => {
    item.earnings.forEach(earning => {
      allEarnings[earning.type] = (allEarnings[earning.type] || 0) + earning.amount;
      totalCompensation += earning.amount;
    });
  });
  
  const compensationBreakdown = Object.entries(allEarnings)
    .map(([component, amount]) => ({
      component,
      percentage: Math.round((amount / totalCompensation) * 1000) / 10
    }))
    .sort((a, b) => b.percentage - a.percentage);
  
  // Calculate yearly payroll trend
  const years = ['2021', '2022', '2023', '2024', '2025'];
  
  const yearlyPayrollTrend = years.map(year => {
    // Generate random increasing trend
    const baseAmount = 1000000;
    const growthFactor = years.indexOf(year) + 1;
    const randomVariation = Math.random() * 200000 - 100000;
    const amount = baseAmount + (growthFactor * 250000) + randomVariation;
    
    return {
      year,
      amount: Math.round(amount)
    };
  });
  
  return {
    totalPayroll,
    departmentPayroll,
    salaryDistribution,
    compensationBreakdown,
    yearlyPayrollTrend
  };
};

// Generate performance analytics data
export const getPerformanceAnalytics = (): PerformanceAnalytics => {
  // Calculate average rating by department
  const departmentRatings: { [key: string]: number[] } = {};
  
  // Map employee IDs to departments
  const employeeDepartments: { [key: string]: string } = {};
  employeesData.forEach(employee => {
    employeeDepartments[employee.id] = employee.department;
  });
  
  // Group ratings by department
  performanceReviews.forEach(review => {
    const department = employeeDepartments[review.employeeId] || 'Unknown';
    
    if (!departmentRatings[department]) {
      departmentRatings[department] = [];
    }
    
    departmentRatings[department].push(review.overallRating);
  });
  
  // Calculate average for each department
  const averageRatingByDepartment = Object.entries(departmentRatings).map(([department, ratings]) => {
    const sum = ratings.reduce((total, rating) => total + rating, 0);
    const average = Math.round((sum / ratings.length) * 10) / 10;
    
    return { department, rating: average };
  }).sort((a, b) => b.rating - a.rating);
  
  // Calculate rating distribution
  const ratingRanges = [
    '1.0-1.9', '2.0-2.9', '3.0-3.4', '3.5-3.9', '4.0-4.4', '4.5-5.0'
  ];
  
  const ratingCounts: { [key: string]: number } = {};
  ratingRanges.forEach(range => ratingCounts[range] = 0);
  
  performanceReviews.forEach(review => {
    const rating = review.overallRating;
    
    if (rating < 2.0) {
      ratingCounts['1.0-1.9']++;
    } else if (rating < 3.0) {
      ratingCounts['2.0-2.9']++;
    } else if (rating < 3.5) {
      ratingCounts['3.0-3.4']++;
    } else if (rating < 4.0) {
      ratingCounts['3.5-3.9']++;
    } else if (rating < 4.5) {
      ratingCounts['4.0-4.4']++;
    } else {
      ratingCounts['4.5-5.0']++;
    }
  });
  
  const ratingDistribution = Object.entries(ratingCounts)
    .map(([range, count]) => ({ range, count }))
    .filter(item => item.count > 0);
  
  // Calculate performance trend
  const periods = Array.from(new Set(performanceReviews.map(review => review.reviewPeriod))).sort();
  
  const performanceTrend = periods.map(period => {
    const reviews = performanceReviews.filter(review => review.reviewPeriod === period);
    const totalRating = reviews.reduce((sum, review) => sum + review.overallRating, 0);
    const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
    
    return { period, rating: averageRating };
  });
  
  // Calculate top performers
  const employeeRatings: { [key: string]: number[] } = {};
  
  performanceReviews.forEach(review => {
    if (!employeeRatings[review.employeeId]) {
      employeeRatings[review.employeeId] = [];
    }
    
    employeeRatings[review.employeeId].push(review.overallRating);
  });
  
  const employeeAverageRatings = Object.entries(employeeRatings).map(([employeeId, ratings]) => {
    const sum = ratings.reduce((total, rating) => total + rating, 0);
    const average = sum / ratings.length;
    
    const employee = employeesData.find(e => e.id === employeeId);
    const name = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
    const department = employee ? employee.department : 'Unknown';
    
    return { employeeId, name, department, rating: average };
  });
  
  const topPerformers = employeeAverageRatings
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
    .map(item => ({
      name: item.name,
      department: item.department,
      rating: Math.round(item.rating * 10) / 10
    }));
  
  // Calculate goal completion rate
  const departmentGoals: { [key: string]: { total: number; completed: number } } = {};
  
  // Process all goals from performance reviews
  performanceReviews.forEach(review => {
    const department = employeeDepartments[review.employeeId] || 'Unknown';
    
    if (!departmentGoals[department]) {
      departmentGoals[department] = { total: 0, completed: 0 };
    }
    
    review.goals.forEach(goal => {
      departmentGoals[department].total++;
      
      if (goal.status === 'completed') {
        departmentGoals[department].completed++;
      }
    });
  });
  
  const goalCompletionRate = Object.entries(departmentGoals).map(([department, data]) => {
    const rate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
    return { department, rate };
  }).sort((a, b) => b.rate - a.rate);
  
  return {
    averageRatingByDepartment,
    ratingDistribution,
    performanceTrend,
    topPerformers,
    goalCompletionRate
  };
};

// Generate recruitment analytics data
export const getRecruitmentAnalytics = (): RecruitmentAnalytics => {
  // Calculate applications by job
  const jobApplications: { [key: string]: number } = {};
  
  candidates.forEach(candidate => {
    const jobId = candidate.jobId;
    jobApplications[jobId] = (jobApplications[jobId] || 0) + 1;
  });
  
  // Map job IDs to titles
  const jobTitles: { [key: string]: string } = {
    'JOB001': 'Senior Software Engineer',
    'JOB002': 'Product Manager',
    'JOB003': 'UI/UX Designer',
    'JOB004': 'Marketing Specialist',
    'JOB005': 'Sales Representative',
    'JOB006': 'Customer Support Specialist',
    'JOB007': 'Data Analyst',
    'JOB008': 'HR Coordinator',
    'JOB009': 'DevOps Engineer',
    'JOB010': 'Financial Analyst'
  };
  
  const applicationsByJob = Object.entries(jobApplications).map(([jobId, count]) => ({
    job: jobTitles[jobId] || jobId,
    count
  })).sort((a, b) => b.count - a.count);
  
  // Calculate applications by source
  const sourceCounts: { [key: string]: number } = {};
  
  candidates.forEach(candidate => {
    const source = candidate.source;
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  });
  
  const applicationsBySource = Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
  
  // Calculate candidates by stage
  const stageCounts: { [key: string]: number } = {};
  
  candidates.forEach(candidate => {
    const stage = candidate.status;
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;
  });
  
  const candidatesByStage = Object.entries(stageCounts)
    .map(([stage, count]) => ({ stage, count }))
    .sort((a, b) => b.count - a.count);
  
  // Calculate time to hire (random data)
  const timeToHire = applicationsByJob.map(item => ({
    job: item.job,
    days: Math.floor(Math.random() * 30) + 15 // 15-45 days
  })).sort((a, b) => a.days - b.days);
  
  // Calculate hiring trend
  const today = new Date();
  const hiringTrend: { month: string; count: number }[] = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(today, i);
    const monthYear = format(date, 'MMM yyyy');
    
    // Random hiring count with upward trend
    const baseCount = Math.floor(Math.random() * 3) + 1;
    const trendFactor = Math.floor((12 - i) / 3); // Increases over time
    
    hiringTrend.push({
      month: monthYear,
      count: baseCount + trendFactor
    });
  }
  
  // Calculate offer acceptance rate (random between 70-95%)
  const offerAcceptanceRate = 70 + Math.floor(Math.random() * 25);
  
  return {
    applicationsByJob,
    applicationsBySource,
    candidatesByStage,
    timeToHire,
    hiringTrend,
    offerAcceptanceRate
  };
};

// Export all analytics data functions
export default {
  getDashboardData,
  getAttendanceAnalytics,
  getLeaveAnalytics,
  getPayrollAnalytics,
  getPerformanceAnalytics,
  getRecruitmentAnalytics
};