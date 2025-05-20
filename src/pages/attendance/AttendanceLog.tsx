import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, Filter, Download, RefreshCw, ArrowUpDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { format, subDays, isToday } from 'date-fns';
import { attendanceData } from '../../data/attendanceData';
import employeesData, { departments } from '../../data/employeeData';
import { useAuth } from '../../contexts/AuthContext';

const AttendanceLog: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState(attendanceData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Filters
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(user?.role === 'employee' ? user.id : '');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  
  // Sorting
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  }>({
    key: 'date',
    direction: 'descending',
  });
  
  useEffect(() => {
    let filtered = [...attendanceData];
    
    // Filter by date range
    filtered = filtered.filter((record) => 
      record.date >= dateRange.startDate && 
      record.date <= dateRange.endDate
    );
    
    // Filter by employee
    if (selectedEmployee) {
      filtered = filtered.filter((record) => record.employeeId === selectedEmployee);
    }
    
    // Filter by department
    if (selectedDepartment) {
      const employeeIds = employeesData
        .filter((emp) => emp.department === selectedDepartment)
        .map((emp) => emp.id);
      
      filtered = filtered.filter((record) => employeeIds.includes(record.employeeId));
    }
    
    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((record) => record.status === selectedStatus);
    }
    
    // Search
    if (searchTerm) {
      filtered = filtered.filter((record) => 
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key as keyof typeof a];
      let bValue = b[sortConfig.key as keyof typeof b];
      
      // Handle date comparison
      if (sortConfig.key === 'date') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setRecords(filtered);
    setCurrentPage(1);
  }, [dateRange, selectedDepartment, selectedStatus, selectedEmployee, searchTerm, sortConfig]);
  
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const clearFilters = () => {
    setDateRange({
      startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
    });
    setSelectedDepartment('');
    setSelectedStatus('');
    setSelectedEmployee(user?.role === 'employee' ? user.id : '');
    setSearchTerm('');
  };
  
  // Get current records
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'half-day': return 'bg-yellow-100 text-yellow-800';
      case 'leave': return 'bg-purple-100 text-purple-800';
      case 'holiday': return 'bg-blue-100 text-blue-800';
      case 'weekend': return 'bg-neutral-100 text-neutral-600';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Attendance Log</h1>
          <p className="text-neutral-500 mt-1">View and manage daily attendance records</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Link to="/attendance" className="btn btn-primary flex items-center">
            <Calendar size={16} className="mr-1" />
            Calendar View
          </Link>
          <button className="btn btn-secondary flex items-center">
            <Download size={16} className="mr-1" />
            Export
          </button>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search by employee name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              onClick={clearFilters}
            >
              <RefreshCw size={16} className="mr-1" /> 
              Reset
            </button>
          </div>
        </div>
        
        {filterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-neutral-200">
            <div className="form-group mb-0">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="half-day">Half Day</option>
                <option value="leave">Leave</option>
                <option value="holiday">Holiday</option>
                <option value="weekend">Weekend</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-neutral-200 flex justify-between">
          <h2 className="text-lg font-semibold">Attendance Records</h2>
          <span className="text-sm text-neutral-500">{records.length} records found</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th 
                  className="cursor-pointer" 
                  onClick={() => requestSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th 
                  className="cursor-pointer" 
                  onClick={() => requestSort('employeeName')}
                >
                  <div className="flex items-center">
                    Employee
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th 
                  className="cursor-pointer" 
                  onClick={() => requestSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>Check In</th>
                <th>Check Out</th>
                <th 
                  className="cursor-pointer" 
                  onClick={() => requestSort('workHours')}
                >
                  <div className="flex items-center">
                    Working Hours
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => {
                  const employee = employeesData.find((emp) => emp.id === record.employeeId);
                  
                  return (
                    <tr key={record.id} className="hover:bg-neutral-50">
                      <td>
                        <div className="flex items-center">
                          <Calendar size={16} className="text-neutral-400 mr-2" />
                          <span className={isToday(new Date(record.date)) ? 'font-medium text-primary-600' : ''}>
                            {format(new Date(record.date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-neutral-100 mr-2">
                            {employee?.avatar ? (
                              <img src={employee.avatar} alt={record.employeeName} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 font-medium">
                                {record.employeeName.split(' ').map(n => n[0]).join('')}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-neutral-900">{record.employeeName}</div>
                            <div className="text-sm text-neutral-500">{employee?.department}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusColor(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td>{record.checkIn || '-'}</td>
                      <td>{record.checkOut || '-'}</td>
                      <td>{record.workHours ? `${record.workHours} hrs` : '-'}</td>
                      <td className="max-w-xs truncate">{record.notes || '-'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <p className="text-neutral-500">No attendance records found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {records.length > recordsPerPage && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-neutral-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(records.length / recordsPerPage)}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white ${
                  currentPage === Math.ceil(records.length / recordsPerPage) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-neutral-700">
                  Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{' '}
                  <span className="font-medium">
                    {indexOfLastRecord > records.length ? records.length : indexOfLastRecord}
                  </span>{' '}
                  of <span className="font-medium">{records.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 ${
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, Math.ceil(records.length / recordsPerPage)) }).map((_, index) => {
                    let pageNumber;
                    const totalPages = Math.ceil(records.length / recordsPerPage);
                    
                    // Calculate which page numbers to show
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(records.length / recordsPerPage)}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 ${
                      currentPage === Math.ceil(records.length / recordsPerPage)
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {['present', 'absent', 'half-day', 'leave'].map((status) => {
          const count = records.filter((record) => record.status === status).length;
          const percentage = records.length > 0 ? Math.round((count / records.length) * 100) : 0;
          
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
              <h3 className="text-sm font-medium text-neutral-500 mb-1">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </h3>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-semibold">{count}</span>
                <span className="text-sm text-neutral-500">{percentage}%</span>
              </div>
              <div className="mt-2 w-full bg-neutral-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${
                    status === 'present' ? 'bg-green-500' : 
                    status === 'absent' ? 'bg-red-500' : 
                    status === 'half-day' ? 'bg-yellow-500' : 
                    'bg-purple-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Department-wise Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Department-wise Attendance Summary</h3>
        
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Employee Count</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Half Day</th>
                <th>Leave</th>
                <th>Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => {
                const employeeIds = employeesData
                  .filter((emp) => emp.department === dept && emp.status !== 'inactive')
                  .map((emp) => emp.id);
                
                const deptRecords = records.filter((record) => 
                  employeeIds.includes(record.employeeId)
                );
                
                const present = deptRecords.filter((record) => record.status === 'present').length;
                const absent = deptRecords.filter((record) => record.status === 'absent').length;
                const halfDay = deptRecords.filter((record) => record.status === 'half-day').length;
                const leave = deptRecords.filter((record) => record.status === 'leave').length;
                
                const totalWorkEntries = deptRecords.filter((record) => 
                  record.status !== 'weekend' && record.status !== 'holiday'
                ).length;
                
                const attendanceRate = totalWorkEntries > 0 
                  ? Math.round(((present + halfDay * 0.5) / totalWorkEntries) * 100) 
                  : 0;
                
                return (
                  <tr key={dept}>
                    <td className="font-medium">{dept}</td>
                    <td>{employeeIds.length}</td>
                    <td className="text-green-600">{present}</td>
                    <td className="text-red-600">{absent}</td>
                    <td className="text-yellow-600">{halfDay}</td>
                    <td className="text-purple-600">{leave}</td>
                    <td>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">{attendanceRate}%</span>
                        <div className="w-24 bg-neutral-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              attendanceRate >= 90 ? 'bg-green-500' : 
                              attendanceRate >= 75 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${attendanceRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceLog;