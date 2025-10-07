import { format, addDays, differenceInDays } from 'date-fns';

// Define leave types
export type LeaveType = 'sick' | 'casual' | 'annual' | 'maternity' | 'paternity' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

// Interface for leave request
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  rejectionReason?: string;
}

// Interface for leave balance
export interface LeaveBalance {
  employeeId: string;
  year: number;
  sick: {
    total: number;
    used: number;
    pending: number;
    available: number;
  };
  casual: {
    total: number;
    used: number;
    pending: number;
    available: number;
  };
  annual: {
    total: number;
    used: number;
    pending: number;
    available: number;
  };
}

// Leave types configuration
export const leaveTypes = [
  {
    id: 'sick',
    name: 'Sick Leave',
    description: 'Leave taken when an employee is ill',
    maxDays: 10,
    color: '#ef4444', // red
  },
  {
    id: 'casual',
    name: 'Casual Leave',
    description: 'Leave taken for personal reasons',
    maxDays: 12,
    color: '#f59e0b', // amber
  },
  {
    id: 'unpaid',
    name: 'Unpaid Leave',
    description: 'Paid time off work granted as a benefit',
    maxDays: 20,
    color: '#3b82f6', // blue
  },
  {
    id: 'vacation',
    name: 'Vacation Leave',
    description: 'Leave granted to mothers during and after pregnancy',
    maxDays: 90,
    color: '#ec4899', // pink
  },
  {
    id: 'firstHalf',
    name: 'First Half',
    // description: 'Leave granted to mothers during and after pregnancy',
    maxDays: 90,
    color: '#8b5cf6', 
  },
  {
    id: 'secondHalf',
    name: 'Second Half ',
    // description: 'Leave granted to mothers during and after pregnancy',
    maxDays: 90,
    color: '#6b7280', // pink
  },
  // {
  //   id: 'paternity',
  //   name: 'Paternity Leave',
  //   description: 'Leave granted to fathers after childbirth',
  //   maxDays: 10,
  //   color: '#8b5cf6', // violet
  // },
  // {s
  //   id: 'unpaid',
  //   name: 'Unpaid Leave',
  //   description: 'Leave without pay',
  //   maxDays: 30,
  //   color: '#6b7280', // gray
  // },
];

// Generate mock leave requests
const generateLeaveRequests = (): LeaveRequest[] => {
  const employees = [
    { id: 'EMP001', name: 'John Smith' },
    { id: 'EMP002', name: 'Sarah Johnson' },
    { id: 'EMP003', name: 'Michael Chen' },
    { id: 'EMP004', name: 'Emily Davis' },
    { id: 'EMP005', name: 'David Wilson' },
    { id: 'EMP006', name: 'Sophia Martinez' },
    { id: 'EMP007', name: 'James Taylor' },
    { id: 'EMP008', name: 'Olivia Brown' },
    { id: 'EMP009', name: 'William Lee' },
    { id: 'EMP010', name: 'Emma Garcia' },
  ];

  const leaveReasons = {
    sick: [
      'Fever and cold',
      'Medical appointment',
      'Stomach infection',
      'Not feeling well',
      'Dental surgery'
    ],
    casual: [
      'Personal work',
      'Family function',
      'Home repair work',
      'Vehicle breakdown',
      'Personal reasons'
    ],
    annual: [
      'Family vacation',
      'Personal trip',
      'Home town visit',
      'Rest and relaxation',
      'Wedding anniversary'
    ],
    maternity: [
      'Expecting baby',
      'Post delivery care'
    ],
    paternity: [
      'Baby born',
      'Supporting spouse after delivery'
    ],
    unpaid: [
      'Extended personal work',
      'Family emergency',
      'Visa process',
      'House moving',
      'Personal reasons'
    ]
  };

  const requests: LeaveRequest[] = [];
  const today = new Date();
  const currentYear = today.getFullYear();

  // Generate 30 random leave requests
  for (let i = 1; i <= 30; i++) {
    const employee = employees[Math.floor(Math.random() * employees.length)];
    const leaveTypeKeys = Object.keys(leaveReasons) as LeaveType[];
    const leaveType = leaveTypeKeys[Math.floor(Math.random() * leaveTypeKeys.length)];
    
    // Generate random dates in the current year
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    const startDate = new Date(currentYear, month, day);
    
    // Random duration between 1 and 5 days
    const duration = Math.floor(Math.random() * 5) + 1;
    const endDate = addDays(startDate, duration - 1);
    
    // Random applied date before start date
    const appliedDaysBefore = Math.floor(Math.random() * 14) + 1;
    const appliedDate = new Date(startDate);
    appliedDate.setDate(startDate.getDate() - appliedDaysBefore);
    
    // Determine status based on dates
    let status: LeaveStatus;
    let approvedBy: string | undefined;
    let approvedOn: string | undefined;
    let rejectionReason: string | undefined;
    
    // If leave is in the past
    if (endDate < today) {
      // 80% approved, 20% rejected
      if (Math.random() < 0.8) {
        status = 'approved';
        approvedBy = 'Sophia Martinez'; // HR Manager
        const approvalDate = new Date(appliedDate);
        approvalDate.setDate(appliedDate.getDate() + Math.floor(Math.random() * 3) + 1);
        approvedOn = format(approvalDate, 'yyyy-MM-dd');
      } else {
        status = 'rejected';
        approvedBy = 'Sophia Martinez'; // HR Manager
        const rejectionDate = new Date(appliedDate);
        rejectionDate.setDate(appliedDate.getDate() + Math.floor(Math.random() * 3) + 1);
        approvedOn = format(rejectionDate, 'yyyy-MM-dd');
        rejectionReason = 'Department is understaffed during that period';
      }
    } 
    // If leave is upcoming
    else if (startDate > today) {
      // 60% approved, 30% pending, 10% rejected
      const rand = Math.random();
      if (rand < 0.6) {
        status = 'approved';
        approvedBy = 'Sophia Martinez'; // HR Manager
        const approvalDate = new Date(appliedDate);
        approvalDate.setDate(appliedDate.getDate() + Math.floor(Math.random() * 3) + 1);
        approvedOn = format(approvalDate, 'yyyy-MM-dd');
      } else if (rand < 0.9) {
        status = 'pending';
      } else {
        status = 'rejected';
        approvedBy = 'Sophia Martinez'; // HR Manager
        const rejectionDate = new Date(appliedDate);
        rejectionDate.setDate(appliedDate.getDate() + Math.floor(Math.random() * 3) + 1);
        approvedOn = format(rejectionDate, 'yyyy-MM-dd');
        rejectionReason = 'Please reschedule as there are multiple leaves during this period';
      }
    } 
    // If leave is ongoing
    else {
      // All should be approved
      status = 'approved';
      approvedBy = 'Sophia Martinez'; // HR Manager
      const approvalDate = new Date(appliedDate);
      approvalDate.setDate(appliedDate.getDate() + Math.floor(Math.random() * 3) + 1);
      approvedOn = format(approvalDate, 'yyyy-MM-dd');
    }
    
    // Get random reason for the leave type
    const reasonsForType = leaveReasons[leaveType] || leaveReasons.casual;
    const reason = reasonsForType[Math.floor(Math.random() * reasonsForType.length)];
    
    requests.push({
      id: `LEA${i.toString().padStart(3, '0')}`,
      employeeId: employee.id,
      employeeName: employee.name,
      leaveType,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      daysCount: differenceInDays(endDate, startDate) + 1,
      reason,
      status,
      appliedOn: format(appliedDate, 'yyyy-MM-dd'),
      approvedBy,
      approvedOn,
      rejectionReason
    });
  }
  
  return requests;
};

// Calculate leave balances for all employees
const calculateLeaveBalances = (requests: LeaveRequest[]): LeaveBalance[] => {
  const employees = [
    { id: 'EMP001', name: 'John Smith' },
    { id: 'EMP002', name: 'Sarah Johnson' },
    { id: 'EMP003', name: 'Michael Chen' },
    { id: 'EMP004', name: 'Emily Davis' },
    { id: 'EMP005', name: 'David Wilson' },
    { id: 'EMP006', name: 'Sophia Martinez' },
    { id: 'EMP007', name: 'James Taylor' },
    { id: 'EMP008', name: 'Olivia Brown' },
    { id: 'EMP009', name: 'William Lee' },
    { id: 'EMP010', name: 'Emma Garcia' },
  ];

  const currentYear = new Date().getFullYear();
  const balances: LeaveBalance[] = [];

  employees.forEach(employee => {
    // Filter requests for this employee
    const employeeRequests = requests.filter(req => req.employeeId === employee.id);
    
    // Initialize balance counts
    const sickUsed = employeeRequests
      .filter(req => req.leaveType === 'sick' && req.status === 'approved')
      .reduce((sum, req) => sum + req.daysCount, 0);
    
    const sickPending = employeeRequests
      .filter(req => req.leaveType === 'sick' && req.status === 'pending')
      .reduce((sum, req) => sum + req.daysCount, 0);
    
    const casualUsed = employeeRequests
      .filter(req => req.leaveType === 'casual' && req.status === 'approved')
      .reduce((sum, req) => sum + req.daysCount, 0);
    
    const casualPending = employeeRequests
      .filter(req => req.leaveType === 'casual' && req.status === 'pending')
      .reduce((sum, req) => sum + req.daysCount, 0);
    
    const annualUsed = employeeRequests
      .filter(req => req.leaveType === 'annual' && req.status === 'approved')
      .reduce((sum, req) => sum + req.daysCount, 0);
    
    const annualPending = employeeRequests
      .filter(req => req.leaveType === 'annual' && req.status === 'pending')
      .reduce((sum, req) => sum + req.daysCount, 0);
    
    // Total leave allocation (from leaveTypes configuration)
    const sickTotal = leaveTypes.find(type => type.id === 'sick')?.maxDays || 10;
    const casualTotal = leaveTypes.find(type => type.id === 'casual')?.maxDays || 12;
    const annualTotal = leaveTypes.find(type => type.id === 'annual')?.maxDays || 20;
    
    balances.push({
      employeeId: employee.id,
      year: currentYear,
      sick: {
        total: sickTotal,
        used: sickUsed,
        pending: sickPending,
        available: sickTotal - sickUsed - sickPending
      },
      casual: {
        total: casualTotal,
        used: casualUsed,
        pending: casualPending,
        available: casualTotal - casualUsed - casualPending
      },
      annual: {
        total: annualTotal,
        used: annualUsed,
        pending: annualPending,
        available: annualTotal - annualUsed - annualPending
      }
    });
  });
  
  return balances;
};

// Generate leave data
export const leaveRequests = generateLeaveRequests();
export const leaveBalances = calculateLeaveBalances(leaveRequests);

// Helper functions

// Get leave requests for a specific employee
export const getEmployeeLeaveRequests = (employeeId: string): LeaveRequest[] => {
  return leaveRequests.filter(request => request.employeeId === employeeId);
};

// Get leave balance for a specific employee
export const getEmployeeLeaveBalance = (employeeId: string): LeaveBalance | undefined => {
  return leaveBalances.find(balance => balance.employeeId === employeeId);
};