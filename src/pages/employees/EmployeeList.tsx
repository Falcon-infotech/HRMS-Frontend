import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, Plus, Edit, Trash2, MoreHorizontal, RefreshCw,
  Download, Upload, ArrowUpDown, Eye
} from 'lucide-react';
import employeesData, { Employee, departments, designations } from '../../data/employeeData';
import axios from '../../constants/axiosInstance';
import { BASE_URL } from '../../constants/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Loading from '../../components/Loading';
import { MdLockReset } from "react-icons/md";
import toast from 'react-hot-toast';
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";


const EmployeeList: React.FC = () => {
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
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [employeesPerPage, setEmployeesPerPage] = useState(15)
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  // console.log(currentEmployees)
  const [totalEmployeecount, setTotalEmployeeCount] = useState(0)

  const totalPages = Math.ceil(totalEmployeecount / employeesPerPage);
  const [editpass, setEditPass] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updateloading, setUpdateLoading] = useState(false)
  const [desinations, setDesignations] = useState([]);
  const [department, setDepartment] = useState([]);

  // console.log(user.role)
  const [loading, setLoading] = useState(true);
  const call = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${BASE_URL}/api/employee`,
      );

      const datas = response.data;
      // console.log(datas.data.users)
      setEmployees(datas.data.users)
      setAllEmployees(datas.data.users);
      setEmployeesPerPage(response.data?.data.count)
      setTotalEmployeeCount(response.data?.data?.totalRecords)

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const loaddesignations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/employee/designation`,);
      setDesignations(response.data.data);
      // console.log(response.data.data)

    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  }


  const loaddepartments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/employee/department`,);
      setDepartment(response.data.data);
      // console.log(response.data.data)
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }
  //update password


  const handleUpdatePassword = async (newPassword: string, id: string) => {

    try {
      setUpdateLoading(true)
      const response = await axios.put(`${BASE_URL}/api/employee/reset_password/${id}`, {
        password: newPassword
      })

      if (response.status === 200) {
        toast.success("Password updated successfully");
        setPassword("")
        setSelectedEmployeeId(null)
        setShowConfirm(false);
        setEditPass(false);
        return true;
      } else {
        toast.error("Failed to update password")
        return false;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUpdateLoading(false)
    }
  };


  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const token = localStorage.getItem('tokenId');
      const response = await axios.put(`${BASE_URL}/api/employee/${id}`, {
        role: newRole
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const datas = response.data;
      toast.success(datas.message)
      setDropdownOpenId(null);
      call();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    call();
    loaddesignations();
    loaddepartments();
  }, []);

  const toggleDropdown = (id: string) => {
    setDropdownOpenId(prev => (prev === id ? null : id));
  };

  

  const employeeByPage = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/employee?page=${currentPage}&limit=${employeesPerPage}`)
      setEmployees(response.data.data?.users)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    employeeByPage()
  }, [currentPage])




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

    // setCurrentPage(1)

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
      // console.log(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">All-Employees</h1>
            <p className="text-white-500 mt-1 font-semibold">Manage your employee directory</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
              <Link
                to="/employees/new"
                className="flex items-center gap-2"
              >
                <Plus size={16} className="mr-1" />
                Add Employee
              </Link>
              {/* <button className="btn btn-secondary flex items-center justify-center">
            <Upload size={16} className="mr-1" />
            Import
          </button>
          <button className="btn btn-secondary flex items-center justify-center">
            <Download size={16} className="mr-1" />
            Export
          </button> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800"></h1>
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
              placeholder="Search employees..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-200">
            <div>
              <label htmlFor="department" className="form-label">Department</label>
              <select
                id="department"
                className="form-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {department.map(dept => (
                  <option key={dept?._id} value={dept?.name}>{dept?.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="designation" className="form-label">Designation</label>
              <select
                id="designation"
                className="form-select"
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
              >
                <option value="">All Designations</option>
                {desinations.map(desig => (
                  <option key={desig?._id} value={desig.name}>{desig.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex justify-between">
          <h2 className="text-lg font-semibold">Employee Directory</h2>
          <span className="text-sm text-neutral-500">{employees.length} employees</span>
        </div>
        <div className="table-container">
          <table className="table">
            <thead className=''>
              <tr className=''>
                <th className="cursor-pointer " onClick={() => handleSort('id')}>
                  <div className="flex items-center py-1 text-sm">
                    ID
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('first_Name')}>
                  <div className="flex items-center text-sm">
                    Name
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>Contact</th>
                <th className="cursor-pointer" onClick={() => handleSort('department')}>
                  <div className="flex items-center text-sm">
                    Department
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('designation')}>
                  <div className="flex items-center text-sm">
                    Designation
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('branch')}>
                  <div className="flex items-center text-sm">
                    Branch
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('joiningDate')}>
                  <div className="flex items-center text-sm">
                    Role
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                {/* <th className="cursor-pointer" onClick={() => handleSort('status')}>
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th> */}
                <th>Actions</th>
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
                {employees.map(employee => (
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
                      <span className="text-sm">{employee?.branch?.branchName || ""}</span>
                    </td>
                    <td>
                      <span className="text-sm">{employee?.role}</span>
                    </td>
                    {/* <td>
                      <span className={`badge ${getStatusColor(employee.status)}`}>
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      </span>
                    </td> */}
                    <td>
                      <div className="flex items-center space-x-2">
                        <Link to={`/payroll/addSlip/${employee._id}`} className="text-neut\al-500 text-green-600 hover:scale-[1.7] relative" title="Payroll-details">
                          <FaFileInvoiceDollar size={18} className='' />
                        </Link>
                        {user?.role === "superAdmin" && <button className="text-neutral-500 hover:text-error-500 hover:scale-[1.7]" title="Reset-Password" >
                          <MdLockReset size={18} onClick={() => {
                            setSelectedEmployeeId(employee._id);
                            setEditPass(true)
                          }
                          }
                          />
                        </button>
                        }
                        <Link to={`/employees/${employee._id}`} className="text-neutal-500 text-primary-600 hover:scale-[1.7]" title="View">
                          <Eye size={18} />
                        </Link>
                        <Link to={`/employees/edit/${employee._id}`} className="text-neutal-500 hover:scale-[1.7] text-warning-500" title="Edit">
                          <Edit size={18} />
                        </Link>
                        <button className="text-red-500 hover:text-error-500 hover:scale-[1.7]" title="Delete" onClick={() => {
                          setSelectedEmployeeId(employee._id);
                          setShowDeleteModal(true);
                        }}>
                          <Trash2 size={18} />
                        </button>
                        <div className="relative inline-block text-left">
                          {
                            user?.role === "superAdmin" && (
                              <div className="relative inline-block text-left">
                                <button
                                  onClick={() => toggleDropdown(employee._id)}
                                  className="text-ne text-primary-600 hover:scale-[1.7]"
                                  title="More"
                                >
                                  <MoreHorizontal size={18} />
                                </button>

                                {
                                  user?.role === "superAdmin" && dropdownOpenId === employee._id && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10 p-2">
                                      <label className="block text-sm text-gray-700 mb-1">Role:</label>
                                      <select
                                        value={employee.role}
                                        onChange={(e) => handleRoleChange(employee._id, e.target.value)}
                                        className="w-full p-1 text-sm border border-gray-300 rounded"
                                      >
                                        <option value="employee">Employee</option>
                                        <option value="hr">Hr</option>
                                      </select>
                                    </div>
                                  )
                                }

                              </div>
                            )
                          }
                        </div>
                      </div>
                    </td>
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
              className="px-3 py-1 border border-neutral-300 rounded-md text-primary-700 text-sm hover:bg-neutral-50"
              onClick={() => setSearchParams({ page: (currentPage - 1).toString() })}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setSearchParams({ page: (index + 1).toString() })}
                // className={currentPage === index + 1 ? "active" : ""}
                className={`px-3 py-1 border rounded-md text-sm ${currentPage === index + 1
                  ? "bg-primary-500 border-primary-300 text-white font-medium"
                  : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 border border-neutral-300 rounded-md text-primary-700 text-sm hover:bg-neutral-50"
              onClick={() => setSearchParams({ page: (currentPage + 1).toString() })}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>

      </div>
      {/* <div>
        {!data || data.length === 0 ? (
          "loading..."
        ) : (
          data.map((item) => (
            <div key={item.id}>{item.first_name}</div>
          ))
        )}
      </div> */}


    </div>
  );
};

export default EmployeeList;