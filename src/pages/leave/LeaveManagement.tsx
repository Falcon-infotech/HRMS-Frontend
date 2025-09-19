import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Filter, Plus, ArrowUpDown, Download, RefreshCw, MoreHorizontal } from 'lucide-react';
import {  leaveBalances, leaveTypes } from '../../data/leaveData';
import employeesData from '../../data/employeeData';
import PageHeader from '../../components/common/PageHeader';
import axios from '../../constants/axiosInstance';
import { BASE_URL } from '../../constants/api';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const LeaveManagement: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [allLeaveRequests, setAllLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);

  const [loadingList, setLoadingList] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  // const [leaveCardOpen, setLeaveCardOpen] = useState(false);
  // const[error, setError] = useState<string | null>(null);
  const handleAllusers = async (showGlobalLoader = true) => {
    try {
      // setLoadingList(true);
      if (showGlobalLoader) setLoadingList(true); // only set loading if requested

      const response = await axios.get(`${BASE_URL}/api/leaves`, )
      // console.log(response.data.data)
      setAllLeaveRequests(response.data.data)
      setFilteredRequests(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      // setLoadingList(false);
      if (showGlobalLoader) setLoadingList(false);

    }
  }





  const updateLeaveStatus = async (leaveId: string, status: 'approved' | 'rejected') => {
    // console.log(leaveId, status)
    try {
      setUpdatingId({ id: leaveId, action: status })
      const response = await axios.put(`${BASE_URL}/api/leaves/update_leave/${leaveId}`, {
        status: status,
      });

      await handleAllusers(false);
    } catch (error) {
      console.error('Error updating leave status:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong while updating leave status.");
      }

    } finally {
      setUpdatingId(null);

    }
  };


  useEffect(() => {
    handleAllusers()
  }, [])


  const clearFilters = () => {
    setSelectedDepartment('');
    setSelectedStatus('');
    setSelectedType('');
    setDateRange({ startDate: '', endDate: '' });
  };


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [searchTerm, setSearchTerm] = useState('')
  const totalPages = Math.ceil(allLeaveRequests.length / itemsPerPage);


  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const navigate = useNavigate();


  const viewLeaveDetails = (LeaveId: string) => {
    navigate(`/leave/${LeaveId}`);
  };
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
          className={`px-3 py-1 border rounded-md text-sm ${i === currentPage ? ' bg-primary-500 border-primary-300 text-white font-medium' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  }


  useEffect(() => {
    let filtereddate = [...allLeaveRequests];

    // 1. Search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtereddate = filtereddate.filter((record) => {
        const fullName = `${record?.employee?.first_name || ''} ${record?.employee?.last_name || ''}`.toLowerCase();
        return (
          fullName.includes(lowerSearchTerm) ||
          record?.employee?.email?.toLowerCase().includes(lowerSearchTerm) ||
          record?.userId?.toLowerCase().includes(lowerSearchTerm)
        );
      });
    }

    // 2. Leave type filter
    if (selectedType) {
      filtereddate = filtereddate.filter((record) => record?.leaveType === selectedType);
    }

    // 3. Status filter
    if (selectedStatus) {
      filtereddate = filtereddate.filter((record) => record?.status === selectedStatus);
    }

    // 4. Date range filter
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);

      filtereddate = filtereddate.filter((record) => {
        const from = new Date(record.fromDate);
        const to = new Date(record.toDate);
        return (
          (from >= start && from <= end) || (to >= start && to <= end)
        );
      });
    }

    setFilteredRequests(filtereddate);
  }, [searchTerm, selectedType, selectedStatus, dateRange, allLeaveRequests]);


  return (
    <div className="animate-fade-in">
      {/* <PageHeader
        title="Leave Management"
        description="Manage and track employee leave requests"
        actions={
          <>
            <Link to="/leave/apply" className="btn btn-primary flex items-center">
              <Plus size={16} className="mr-1" />
              Apply Leave
            </Link>
            <button className="btn btn-secondary flex items-center">
              <Download size={16} className="mr-1" />
              Export
            </button>
          </>
        }
      /> */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Leave Management</h1>
            <p className="text-blue-100 mt-2">Manage and track employee leave requests </p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <>
            <Link to="/leave/apply" className="btn flex items-center">
              <Plus size={16} className="mr-1" />
              Apply Leave
            </Link>
            {/* <button className="btn btn-secondary flex items-center">
              <Download size={16} className="mr-1" />
              Export
            </button> */}
          </>
          </div>
        </div>
      </div>

      {/* Leave Overview Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {leaveTypes.slice(0, 4).map(type => {
          const totalRequests = leaveRequests.filter(req => req.leaveType === type.id).length;
          const pendingRequests = leaveRequests.filter(req =>
            req.leaveType === type.id && req.status === 'pending'
          ).length;

          return (
            <div key={type.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-neutral-700">{type.name}</h3>
                <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: type.color }} />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-semibold">{totalRequests}</p>
                  <p className="text-sm text-neutral-500">Total Requests</p>
                </div>
                {pendingRequests > 0 && (
                  <span className="text-sm text-warning-600">
                    {pendingRequests} pending
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div> */}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              className="form-input"
              placeholder="Search leave requests..."
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
            <div>
              <label className="form-label">Leave Type</label>
              <select
                className="form-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                {leaveTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="form-label">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="form-input"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                />
                <input
                  type="date"
                  className="form-input"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex justify-between">
          <h2 className="text-lg font-semibold">Leave Requests</h2>
          {/* <span className="text-sm text-neutral-500">{allLeaveRequests.length} requests</span> */}
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
                    Leave Type
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    From
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    To
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>Days</th>
                <th>
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />

                  </div>
                </th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                <tr>
                  <td colSpan="8">
                    <div className="py-8 flex justify-center items-center space-x-2">
                      <Loading text={"Loading leave requests..."} />
                    </div>
                  </td>
                </tr>
              ) : paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="py-10 text-center text-gray-500 text-sm">
                      No leave requests found.
                    </div>
                  </td>
                </tr>
              ) :
                paginatedRequests.map(request => {
                  const employee = employeesData.find(emp => emp.id === request.employeeId);
                  const leaveType = leaveTypes.find(type => type.id === request.leaveType);

                  return (
                    <tr key={request._id} className="hover:bg-neutral-50">
                      <td>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                            {employee?.avatar ? (
                              <img src={employee.avatar} alt={request.employeeName} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-sm font-medium">
                                {request?.employee?.first_name?.split(' ').map(n => n[0]).join('')}
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-neutral-900">{request.employee?.first_name}</p>
                            <p className="text-xs text-neutral-500">{request.employee?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="inline-flex items-center">
                          <span
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: leaveType?.color }}
                          />
                          <span className="text-sm capitalize">{request?.leaveType}</span>
                        </span>
                      </td>
                      <td>
                        <span className="text-sm">
                          {new Date(request?.fromDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm">
                          {new Date(request?.toDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm font-medium">{request?.leaveTaken}</span>
                      </td>
                      <td>
                        <span className={`badge ${request.status === 'approved' ? 'badge-success' :
                          request.status === 'rejected' ? 'badge-danger' :
                            request.status === 'pending' ? 'badge-warning' :
                              'badge-info'
                          }`}>
                          {request?.status.charAt(0).toUpperCase() + request?.status.slice(1)}
                        </span>
                        {updatingId?.id === request._id ? (
                          <span className="ml-2 text-sm text-gray-500">Updating...</span>
                        ) : (
                          <select
                            className="ml-2 mt-1 text-xs py-1 border border-gray-300  bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
                            value=""
                            onChange={(e) => updateLeaveStatus(request._id, e.target.value)}
                          >
                            <option value="" className='' disabled>Change Status</option>
                            {request.status === 'rejected' && (
                              <>
                                <option value="approved">Approve</option>
                                <option value="cancelled">Cancel</option>
                              </>
                            )}
                            {request.status === 'approved' && (
                              <>
                                <option value="rejected">Reject</option>
                                <option value="cancelled">Cancel</option>

                              </>
                            )}
                            {request.status === 'pending' && (
                              <>
                                <option value="approved">Approve</option>
                                <option value="rejected">Reject</option>
                                <option value="cancelled">Cancel</option>
                              </>
                            )}
                            {request.status === 'cancelled' && (
                              <>
                                <option value="approved">Approve</option>
                                <option value="rejected">Reject</option>
                                {/* <option value="cancelled">Cancel</option> */}
                              </>
                            )}
                          </select>
                        )}

                      </td>


                      <td>
                        <span className="text-sm">
                          {new Date(request.appliedAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium" onClick={() => viewLeaveDetails(request?.userId)}>
                            View
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateLeaveStatus(request._id, 'approved')}
                                className="text-sm text-success-600 hover:text-success-700 font-medium"
                                disabled={updatingId?.id === request._id && updatingId?.action === 'approved'}
                              >
                                {updatingId?.id === request._id && updatingId?.action === 'approved' ? 'Approving...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => updateLeaveStatus(request._id, 'rejected')}
                                className="text-sm text-error-600 hover:text-error-700 font-medium"
                                disabled={updatingId?.id === request._id && updatingId?.action === 'rejected'}
                              >
                                {updatingId?.id === request._id && updatingId?.action === 'rejected' ? 'Rejecting...' : 'Reject'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>

          </table>
        </div>

        {/* Pagination */}
        {paginatedRequests.length > 0 ? <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="btn btn-secondary">Previous</button>
            <button className="btn btn-secondary">Next</button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{paginatedRequests.length}</span> of{' '}
                <span className="font-medium">{allLeaveRequests.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px gap-3">
                <button className="btn btn-secondary rounded-l-md" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >Previous</button>
                {/* {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`btn ${currentPage === number ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {number}
                  </button>
                ))} */}
                {renderPageNumbers()}
                <button className="btn btn-secondary rounded-r-md" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >Next</button>
              </nav>
            </div>
          </div>
        </div>:""}
      </div>
    </div>
  );
};

export default LeaveManagement;