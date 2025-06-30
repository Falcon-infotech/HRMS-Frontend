import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Filter, RefreshCw, ArrowUpDown, DollarSign, Wallet, CreditCard, PieChart } from 'lucide-react';
import { payrollData, getPayrollsByPeriod, getTotalPayrollAmount } from '../../data/payrollData';
import employeesData from '../../data/employeeData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import PageHeader from '../../components/common/PageHeader';

const PayrollDashboard: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Get unique periods
  const periods = Array.from(new Set(payrollData.map(item => item.period))).sort().reverse();

  // Get latest period data
  const latestPeriod = periods[0];
  const latestPayroll = getPayrollsByPeriod(latestPeriod);
  const totalAmount = getTotalPayrollAmount(latestPeriod);

  // Calculate department-wise payroll
  const departmentPayroll = employeesData.reduce((acc, employee) => {
    const dept = employee.department;
    if (!acc[dept]) acc[dept] = 0;
    
    const employeePayroll = latestPayroll.find(p => p.employeeId === employee.id);
    if (employeePayroll) {
      acc[dept] += employeePayroll.grossSalary;
    }
    
    return acc;
  }, {} as { [key: string]: number });

  const departmentData = Object.entries(departmentPayroll)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Calculate salary distribution
  const salaryRanges = {
    '0-5k': 0,
    '5k-10k': 0,
    '10k-15k': 0,
    '15k-20k': 0,
    '20k+': 0
  };

  latestPayroll.forEach(item => {
    const salary = item.grossSalary;
    if (salary < 5000) salaryRanges['0-5k']++;
    else if (salary < 10000) salaryRanges['5k-10k']++;
    else if (salary < 15000) salaryRanges['10k-15k']++;
    else if (salary < 20000) salaryRanges['15k-20k']++;
    else salaryRanges['20k+']++;
  });

  const salaryDistribution = Object.entries(salaryRanges)
    .map(([range, count]) => ({ name: range, value: count }))
    .filter(item => item.value > 0);

  // Monthly trend data
  const monthlyTrend = periods.slice(0, 12).map(period => ({
    name: period,
    amount: getTotalPayrollAmount(period)
  })).reverse();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Payroll Dashboard"
        description="Manage and track employee payroll"
        actions={
          <button className="btn btn-primary flex items-center">
            <Download size={16} className="mr-1" />
            Export Report
          </button>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Payroll</p>
              <p className="text-2xl font-semibold">${totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 mr-3">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Average Salary</p>
              <p className="text-2xl font-semibold">
                ${Math.round(totalAmount / latestPayroll.length).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-warning-100 flex items-center justify-center text-warning-600 mr-3">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Pending Payroll</p>
              <p className="text-2xl font-semibold">
                {payrollData.filter(item => item.paymentStatus === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-success-100 flex items-center justify-center text-success-600 mr-3">
              <PieChart size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Departments</p>
              <p className="text-2xl font-semibold">{departmentData.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Payroll Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Department-wise Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                className="form-input"
                placeholder="Search employees..."
              />
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
              <button 
                className="btn btn-secondary flex items-center justify-center"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter size={16} className="mr-1" />
                Filter
              </button>
              <button 
                className="btn btn-secondary flex items-center justify-center"
              >
                <RefreshCw size={16} className="mr-1" />
                Reset
              </button>
            </div>
          </div>

          {filterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-200">
              <div>
                <label className="form-label">Department</label>
                <select 
                  className="form-select"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {Array.from(new Set(employeesData.map(emp => emp.department))).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Month</label>
                <select
                  className="form-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="">All Months</option>
                  {periods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="processed">Processed</option>
                  <option value="pending">Pending</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <div className="flex items-center">
                    Employee
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    Employee ID
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    Department
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    Designation
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    Gross Salary
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    Net Salary
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {latestPayroll.map(item => {
                const employee = employeesData.find(emp => emp.id === item.employeeId);

                return (
                  <tr key={item.id} className="hover:bg-neutral-50">
                    <td>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                          {employee?.avatar ? (
                            <img src={employee.avatar} alt={item.employeeName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-sm font-medium">
                              {item.employeeName.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-neutral-900">{item.employeeName}</p>
                          <p className="text-xs text-neutral-500">{employee?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">{item.employeeId}</span>
                    </td>
                    <td>
                      <span className="text-sm">{employee?.department}</span>
                    </td>
                    <td>
                      <span className="text-sm">{employee?.designation}</span>
                    </td>
                    <td>
                      <span className="text-sm font-medium">${item.grossSalary.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className="text-sm font-medium">${item.netSalary.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        item.paymentStatus === 'processed' ? 'badge-success' :
                        item.paymentStatus === 'pending' ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {item.paymentStatus.charAt(0).toUpperCase() + item.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/payroll/slip/${item.id}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View Slip
                        </Link>
                        <Link 
                          to={`/payroll/addSlip/${item.id}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Add
                        </Link>
                        <button className="text-sm text-neutral-600 hover:text-neutral-700 font-medium">
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="btn btn-secondary">Previous</button>
            <button className="btn btn-secondary">Next</button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">10</span> of{' '}
                <span className="font-medium">{latestPayroll.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="btn btn-secondary rounded-l-md">Previous</button>
                <button className="btn btn-primary">1</button>
                <button className="btn btn-secondary">2</button>
                <button className="btn btn-secondary">3</button>
                <button className="btn btn-secondary rounded-r-md">Next</button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboard;