import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download, Filter, RefreshCw, ArrowUpDown, DollarSign, Wallet, CreditCard, PieChart } from 'lucide-react';
import { payrollData, getPayrollsByPeriod, getTotalPayrollAmount } from '../../data/payrollData';
import employeesData, { Employee } from '../../data/employeeData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import axios from '../../constants/axiosInstance';
import { BASE_URL } from '../../constants/api';
import Loading from '../../components/Loading';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



const PayrollDashboard: React.FC = () => {

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const [filterOpen, setFilterOpen] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const date = new Date()

  const currentMonth = months[date.getMonth()]
  const currentYear = date.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesfilter, setEmployeesfilter] = useState<Employee[]>([]);


  // const [loading, setLoading] = useState(true);

  // const call = async () => {
  //   try {
  //     setLoading(true);
  //     const token = localStorage.getItem('tokenId');

  //     const response = await axios.get(`${BASE_URL}/api/employee`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const datas = response.data;
  //     console.log(datas.data.users)
  //     setEmployees(datas.data.users)

  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   call();
  // }, [])


  const handlefilter = async () => {
    setFilterOpen(filterOpen);
    setLoading(true);
      setEmployees([]);
  setEmployeesfilter([]);
    try {
      const response = await axios.get(`${BASE_URL}/api/payroll/get_payroll_data`, {

        params: {
          month: selectedMonth,
          year: selectedYear,

        }
      })
     if(response.data?.success){
       setEmployees(response.data.data);
      setEmployeesfilter(response.data.data);
     }else{
       setEmployees([]);
      setEmployeesfilter([]);
     }

    

    } catch (error) {
      if (axios?.isAxiosError(error)) {
        if (error?.response?.status === 404) {
          console.warn("No payroll data found for selected filters.");
          setEmployees([]);
        } else {
          console.error("Unexpected error:", error.response?.data || error.message);
        }
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  }

 
  useEffect(() => {
    handlefilter()
  }, [])

  const [loadingDownload, setLoadingDownload] = useState(false);


  const ExoprtReport = async () => {
    try {
      setLoadingDownload(true);
      const workSheet = XLSX.utils.json_to_sheet(employees)

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, workSheet, 'Sheet1')

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

      const data = new Blob([excelBuffer], { type: "application/octet-stream" })
      let filename = `${selectedMonth}_${selectedYear}_Payroll Report.xlsx`
      console.log()
      saveAs(data, filename)
    } catch (error) {
      console.error('Error downloading data:', error);

    } finally {
      setLoadingDownload(false)
    }
  }



  useEffect(() => {
    let filteredEmployees = [...employees]

    filteredEmployees = filteredEmployees.filter((employee) =>


      employee?.userId?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee?.userId?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${employee?.userId?.first_name || ''} ${employee?.userId?.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())

      // employee?.month?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )



    setEmployeesfilter(filteredEmployees);

  }, [searchTerm, selectedMonth, selectedYear, selectedStatus]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const totalPages = Math.ceil(employeesfilter.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = employeesfilter.slice(startIndex, endIndex);

  const renderPageNumbers = () => {
    let pageNumbers = []
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
    if (endPage - startPage < 3) {
      startPage = Math.max(1, endPage - 3);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`btn flex gap-5 ${i === currentPage ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Payroll Dashboard"
        description="Manage and track employee payroll"
        actions={
          employees.length > 0 && <button
            className="btn btn-secondary flex items-center gap-2"
            onClick={ExoprtReport}
            disabled={loadingDownload}
          >
            <Download size={16} />
            Export Report
            {loadingDownload && (
              <svg
                className="animate-spin h-4 w-4 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            )}
          </button>
        }
      />

      {/* Overview Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
      </div> */}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trend */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
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
        </div> */}

        {/* Department Distribution */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
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
        </div> */}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4 mb-4">
              {/* Month */}
              <div>
                <label className="form-label">Month</label>
                <select
                  className="form-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="">Select Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="form-label">Year</label>
                <select
                  className="form-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">Select Year</option>
                  {["2023", "2024", "2025", "2026"].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
              <button
                className="btn btn-secondary flex items-center justify-center"
                onClick={handlefilter}
              >
                <Filter size={16} className="mr-1" />
                Search
              </button>
              <button
                className="btn btn-secondary flex items-center justify-center"
                onClick={() => {
                  setSelectedYear("")
                  setSelectedMonth("")
                  setSearchTerm("");
                  // handlefilter();
                }}
              >
                <RefreshCw size={16} className="mr-1" />
                Reset
              </button>
            </div>

          </div>

          {filterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-200">
              {/* <div>
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
              </div> */}

              {/* <div>
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
              </div> */}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              {loading ? (
                <tr>
                  <th colSpan={8} className="text-center text-neutral-500 py-4">
                    Loading payroll data...
                  </th>
                </tr>
              ) : currentData.length > 0 ? (
                <tr>
                  <th>
                    <div className="flex items-center">
                      Employee-Name <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Month <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Basic-Salary <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Gross-Salary <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Net-Salary <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Payment-Method <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Status <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>Actions</th>
                </tr>
              ) : (
                <tr>
                  <th>
                    <div className="flex items-center">
                      Employee-Name <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Month <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Basic-Salary <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Gross-Salary <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Net-Salary <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Payment-Method <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Status <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>Actions</th>
                </tr>
              )}
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6">
                    <Loading text="Loading payroll..." />
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr key={item._id} className="hover:bg-neutral-50">
                    <td>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                          <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-sm font-medium">
                            {/* {item?.bankName?.charAt(0) ?? 'U'} */}
                            {item?.userId?.first_name.charAt(0).toUpperCase() ?? 'U'}
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-neutral-900">{item?.userId?.first_name} {item?.userId?.last_name}</p>
                          <p className="text-xs text-neutral-500">{item?.accountNumber || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">{item?.month} {item?.year}</span>
                    </td>
                    <td>
                      <span className="text-sm">₹{item?.basicSalary}</span>
                    </td>
                    <td>
                      <span className="text-sm">₹{item?.grossSalary}</span>
                    </td>
                    <td>
                      <span className="text-sm">₹{item?.netSalary}</span>
                    </td>
                    <td>
                      <span className="text-sm">{item?.paymentMethod}</span>
                    </td>
                    <td>
                      <span className={`badge ${item?.status === 'paid' ? 'badge-success' :
                        item?.status === 'pending' ? 'badge-danger' :
                          'badge-warning'
                        }`}>
                        {item?.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/payroll/updateSlip/${item?._id}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium text-green-500"
                        >
                          Update-Slip
                        </Link>
                        <Link
                          to={`/payslip/${item?._id}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium text-green-500"
                        >
                          payslip
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : 

                <tr>
                  <td  colSpan={8} className='text-center '>No payroll data available for the selected filters</td>
                </tr>

              }
            </tbody>
          </table>
        </div>


        {/* Pagination */}
       {
        currentData.length>0 &&  <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="btn btn-secondary"
              onClick={() => {
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
              disabled={currentPage === 1}
            >Previous</button>
            <button className="btn btn-secondary" onClick={() => {
              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
            }}
              disabled={currentPage === totalPages}>Next</button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              {currentData.length > 0 && <p className="text-sm text-neutral-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{currentData.length}</span> of{' '}
                <span className="font-medium">{employees.length}</span> results
              </p>}
            </div>
            <div>
              {employees.length > 0 && <nav className="relative z-0 inline-flex rounded-md shadow-sm space-x-px gap-3">
                <button className="btn btn-secondary rounded-l-md" onClick={() => {
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                  disabled={currentPage === 1}>Previous</button>
                {renderPageNumbers()}
                <button className="btn btn-secondary rounded-r-md" onClick={() => {
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                  disabled={currentPage === totalPages}>Next</button>
              </nav>}
            </div>
          </div>
        </div>
       }
      </div>
    </div >
  );
};

export default PayrollDashboard;