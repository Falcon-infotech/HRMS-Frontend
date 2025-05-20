import { addMonths, format } from 'date-fns';
import employeesData, { Employee } from './employeeData';

// Payroll period types
export type PayrollPeriod = 'monthly' | 'bi-weekly' | 'weekly';

// Deduction types
export type DeductionType = 'tax' | 'insurance' | 'loan' | 'providentFund' | 'professionalTax' | 'other';

// Interfaces
export interface PayrollItem {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  periodType: PayrollPeriod;
  startDate: string;
  endDate: string;
  basicSalary: number;
  grossSalary: number;
  netSalary: number;
  paymentDate: string;
  paymentStatus: 'pending' | 'processed' | 'on-hold';
  paymentMethod: 'bank transfer' | 'check' | 'cash';
  earnings: Earning[];
  deductions: Deduction[];
}

export interface Earning {
  type: string;
  amount: number;
  description?: string;
}

export interface Deduction {
  type: DeductionType;
  amount: number;
  description?: string;
}

// Generate mock payroll data
const generatePayrollData = (): PayrollItem[] => {
  const payrollItems: PayrollItem[] = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Generate last 12 months of payroll data
  for (let i = 11; i >= 0; i--) {
    const month = addMonths(new Date(currentYear, currentMonth, 1), -i);
    const periodStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const periodEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    const periodName = format(month, 'MMMM yyyy');
    const periodStartStr = format(periodStart, 'yyyy-MM-dd');
    const periodEndStr = format(periodEnd, 'yyyy-MM-dd');
    
    // Payment is typically made a few days after the period ends
    const paymentDate = new Date(periodEnd);
    paymentDate.setDate(paymentDate.getDate() + 5);
    const paymentDateStr = format(paymentDate, 'yyyy-MM-dd');
    
    // Generate payroll for each employee
    employeesData.forEach((employee: Employee) => {
      // Skip if employee is inactive
      if (employee.status === 'inactive') return;
      
      // Skip if employee joined after this period
      const joinDate = new Date(employee.joiningDate);
      if (joinDate > periodEnd) return;
      
      const salary = employee.salary;
      
      if (!salary) return; // Skip if no salary details
      
      const basicSalary = salary.basic;
      
      // Calculate earnings
      const houseRentAllowance = salary.houseRentAllowance;
      const medicalAllowance = salary.medicalAllowance;
      const travelAllowance = salary.travelAllowance;
      const dearnessAllowance = salary.dearnessAllowance;
      
      // Add some random performance bonus occasionally
      const hasPerformanceBonus = Math.random() < 0.2; // 20% chance
      const performanceBonus = hasPerformanceBonus ? Math.round(basicSalary * 0.1) : 0;
      
      // Add some random overtime occasionally
      const hasOvertime = Math.random() < 0.3; // 30% chance
      const overtimeHours = hasOvertime ? Math.floor(Math.random() * 20) + 5 : 0; // 5-25 hours
      const overtimeRate = Math.round((basicSalary / 176) * 1.5); // 1.5x hourly rate
      const overtimeAmount = overtimeHours * overtimeRate;
      
      // Create earnings array
      const earnings: Earning[] = [
        { type: 'Basic Salary', amount: basicSalary },
        { type: 'House Rent Allowance', amount: houseRentAllowance },
        { type: 'Medical Allowance', amount: medicalAllowance },
        { type: 'Travel Allowance', amount: travelAllowance },
        { type: 'Dearness Allowance', amount: dearnessAllowance },
      ];
      
      if (hasPerformanceBonus) {
        earnings.push({ type: 'Performance Bonus', amount: performanceBonus, description: 'Quarterly performance bonus' });
      }
      
      if (hasOvertime) {
        earnings.push({ type: 'Overtime', amount: overtimeAmount, description: `${overtimeHours} hours @ $${overtimeRate}/hour` });
      }
      
      // Calculate gross salary
      const grossSalary = earnings.reduce((sum, earning) => sum + earning.amount, 0);
      
      // Calculate deductions
      const providentFund = salary.providentFund;
      const incomeTax = salary.incomeTax;
      const professionalTax = salary.professionalTax;
      
      // Add some random health insurance occasionally
      const hasHealthInsurance = Math.random() < 0.7; // 70% chance
      const healthInsurance = hasHealthInsurance ? 150 : 0;
      
      // Add some random loan deduction occasionally
      const hasLoanDeduction = Math.random() < 0.1; // 10% chance
      const loanDeduction = hasLoanDeduction ? Math.round(basicSalary * 0.15) : 0;
      
      // Create deductions array
      const deductions: Deduction[] = [
        { type: 'providentFund', amount: providentFund, description: 'Employee Provident Fund' },
        { type: 'tax', amount: incomeTax, description: 'Income Tax' },
        { type: 'professionalTax', amount: professionalTax, description: 'Professional Tax' },
      ];
      
      if (hasHealthInsurance) {
        deductions.push({ type: 'insurance', amount: healthInsurance, description: 'Health Insurance Premium' });
      }
      
      if (hasLoanDeduction) {
        deductions.push({ type: 'loan', amount: loanDeduction, description: 'Personal Loan EMI' });
      }
      
      // Calculate total deductions
      const totalDeductions = deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
      
      // Calculate net salary
      const netSalary = grossSalary - totalDeductions;
      
      // Determine payment status
      let paymentStatus: 'pending' | 'processed' | 'on-hold';
      
      if (paymentDate > today) {
        paymentStatus = 'pending';
      } else {
        paymentStatus = Math.random() < 0.05 ? 'on-hold' : 'processed'; // 5% chance of on-hold
      }
      
      // Generate payroll item
      payrollItems.push({
        id: `PAY-${employee.id}-${format(month, 'yyyyMM')}`,
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        period: periodName,
        periodType: 'monthly',
        startDate: periodStartStr,
        endDate: periodEndStr,
        basicSalary,
        grossSalary,
        netSalary,
        paymentDate: paymentDateStr,
        paymentStatus,
        paymentMethod: 'bank transfer',
        earnings,
        deductions
      });
    });
  }
  
  return payrollItems;
};

// Generate all payroll data
export const payrollData = generatePayrollData();

// Helper functions

// Get payroll items for a specific employee
export const getEmployeePayrolls = (employeeId: string): PayrollItem[] => {
  return payrollData.filter(item => item.employeeId === employeeId);
};

// Get payroll items for a specific period
export const getPayrollsByPeriod = (period: string): PayrollItem[] => {
  return payrollData.filter(item => item.period === period);
};

// Get total payroll amount for a specific period
export const getTotalPayrollAmount = (period: string): number => {
  return payrollData
    .filter(item => item.period === period)
    .reduce((sum, item) => sum + item.grossSalary, 0);
};

// Get total deductions for a specific period
export const getTotalDeductions = (period: string): number => {
  return payrollData
    .filter(item => item.period === period)
    .reduce((sum, item) => {
      const deductionsTotal = item.deductions.reduce((dSum, d) => dSum + d.amount, 0);
      return sum + deductionsTotal;
    }, 0);
};

// Get payroll data by status
export const getPayrollsByStatus = (status: 'pending' | 'processed' | 'on-hold'): PayrollItem[] => {
  return payrollData.filter(item => item.paymentStatus === status);
};

// Get latest payroll period
export const getLatestPayrollPeriod = (): string => {
  const periods = [...new Set(payrollData.map(item => item.period))];
  return periods.sort().pop() || '';
};

// Export payroll data and functions
export default payrollData;