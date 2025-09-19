import React, { useEffect, useState } from 'react'
import axios from '../constants/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Employee } from '../data/employeeData';
import { BASE_URL } from '../constants/api';
import { ArrowUpDown } from 'lucide-react';
import Loading from './Loading';

const DeletedUsers = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  // const [data, setData] = useState<Employee[]>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState<{ field: keyof Employee, direction: 'asc' | 'desc' }>({
    field: 'first_Name',
    direction: 'asc'
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth)
  const [allEmployees, setAllEmployees] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [resetpasswordModal, setResetpasswordModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalPages = Math.ceil(employees.length / employeesPerPage);
  const [editpass, setEditPass] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updateloading, setUpdateLoading] = useState(false)

  // console.log(user.role)
  const [loading, setLoading] = useState(true);
  const call = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('tokenId');

      const response = await axios.get(`${BASE_URL}/api/employee/deleted`,
      );

      const datas = response.data;
      // console.log(datas.data.users)
      setEmployees(datas.data.users)
      setAllEmployees(datas.data.users);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    call();
  }, []);


  useEffect(() => {
    let filteredEmployees = [...allEmployees]

    // Search filter
    if (searchTerm) {
      filteredEmployees = filteredEmployees.filter(employee =>
        employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
    if (selectedDepartment) {
      filteredEmployees = filteredEmployees.filter(employee =>
        employee.department === selectedDepartment
      );
    }

    // Designation filter
    if (selectedDesignation) {
      filteredEmployees = filteredEmployees.filter(employee =>
        employee.designation === selectedDesignation
      );
    }

    // Status filter
    if (selectedStatus) {
      filteredEmployees = filteredEmployees.filter(employee =>
        employee.status === selectedStatus
      );
    }

    // Sort
    filteredEmployees.sort((a, b) => {
      const aValue = a[sortBy.field];
      const bValue = b[sortBy.field];

      if (aValue! < bValue!) return sortBy.direction === 'asc' ? -1 : 1;
      if (aValue! > bValue!) return sortBy.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setEmployees(filteredEmployees);
  }, [searchTerm, selectedDepartment, selectedDesignation, selectedStatus, sortBy, allEmployees]);

  const handleSort = (field: keyof Employee) => {
    if (sortBy.field === field) {
      setSortBy({
        field,
        direction: sortBy.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortBy({
        field,
        direction: 'asc'
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedDesignation('');
    setSelectedStatus('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



  const handleDelete = async (id: string) => {
    // console.log("clicked")
    try {
      const token = localStorage.getItem('tokenId');

      const data = await axios.patch(`${BASE_URL}/api/employee/${id}`,
      )

      setEmployees(prevEmployees => prevEmployees.filter(emp => emp._id !== id));
      console.log(data.data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex justify-between">
          <h2 className="text-lg font-semibold">Employee Directory</h2>
          <span className="text-sm text-neutral-500">{employees.length} employees</span>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="cursor-pointer" onClick={() => handleSort('id')}>
                  <div className="flex items-center">
                    ID
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('first_Name')}>
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>Contact</th>
                <th className="cursor-pointer" onClick={() => handleSort('department')}>
                  <div className="flex items-center">
                    Department
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('designation')}>
                  <div className="flex items-center">
                    Designation
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('branch')}>
                  <div className="flex items-center">
                    Branch
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('joiningDate')}>
                  <div className="flex items-center">
                    Joining Date
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                {/* <th className="cursor-pointer" onClick={() => handleSort('status')}>
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th> */}
              </tr>
            </thead>
            {
              loading ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex justify-center items-center py-10">
                      <Loading text="Loading Employee Data..." />
                    </div>
                  </td>
                </tr>
              ) : <tbody >
                {currentEmployees.map(employee => (
                  <tr key={employee._id} className="hover:bg-neutral-50">
                    <td>
                      <span className="text-sm font-medium">{employee?.userId}</span>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-200 overflow-hidden">
                          {employee.avatar ? (
                            <img src={employee.avatar} alt={`${employee.first_name} ${employee.last_name}`} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 font-medium">
                              {employee.first_name[0]}{employee.last_name[0]}
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-neutral-800">{employee.first_name} {employee.last_name}</p>
                          <p className="text-xs text-neutral-500">{employee.employeeType}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm text-neutral-800">{employee.email}</p>
                      <p className="text-xs text-neutral-500">{employee.phone}</p>
                    </td>
                    <td>
                      <span className="text-sm">{employee.department}</span>
                    </td>
                    <td>
                      <span className="text-sm">{employee.designation}</span>
                    </td>
                    <td>
                      <span className="text-sm">{employee?.branch || ""}</span>
                    </td>
                    <td>
                      <span className="text-sm">{new Date(employee?.joining_date).toLocaleDateString()}</span>
                    </td>
                    {/* <td>
                      <span className={`badge ${getStatusColor(employee.status)}`}>
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      </span>
                    </td> */}

                  </tr>
                ))}
                {showDeleteModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                      <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                      <p className="text-sm text-gray-700 mb-6">Are you sure you want to delete this employee?</p>
                      <div className="flex justify-end space-x-4">
                        <button
                          className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => setShowDeleteModal(false)}
                        >
                          No
                        </button>
                        <button
                          className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          onClick={() => {
                            handleDelete(selectedEmployeeId);
                            setShowDeleteModal(false);
                          }}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {editpass && (
                  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                      <h2 className="text-lg font-semibold mb-4">Update Password</h2>

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>

                      <div className="relative mb-6">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-2 pr-2 flex items-center text-sm text-gray-600"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>

                      <div className="flex justify-end space-x-4">
                        <button
                          className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => setEditPass(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() => setShowConfirm(true)}
                        >
                          {updateloading ? "Updating..." : "Update"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm Modal */}
                {showConfirm && (
                  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                      <h2 className="text-lg font-semibold mb-4">Confirm Reset Password</h2>
                      <p className="text-sm text-gray-700 mb-6">
                        Are you sure you want to reset this password?
                      </p>
                      <div className="flex justify-end space-x-4">
                        <button
                          className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => setShowConfirm(false)}
                        >
                          No
                        </button>
                        <button
                          className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          onClick={() => {

                            handleUpdatePassword(password, selectedEmployeeId);
                          }}
                          disabled={updateloading}
                        >
                          {updateloading ? "Updating..." : "Yes"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}



                {!loading && employees.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-neutral-500">
                      {/* No employees found matching your search criteria */}
                      No employees Found...
                    </td>
                  </tr>
                )}
              </tbody>
            }

          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            Showing <span className="font-medium">{currentEmployees.length}</span> of <span className="font-medium">{employees.length}</span> employees
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border border-neutral-300 rounded-md text-neutral-700 text-sm hover:bg-neutral-50"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 border rounded-md text-sm ${currentPage === index + 1
                  ? "bg-primary-500 border-primary-300 text-white font-medium"
                  : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 border border-neutral-300 rounded-md text-neutral-700 text-sm hover:bg-neutral-50"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DeletedUsers