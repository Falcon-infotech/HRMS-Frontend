import React, { useEffect, useState } from 'react'
import axios from '../constants/axiosInstance'
import { BASE_URL } from '../constants/api'
import Loading from './Loading'
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdDownload,
  MdOutlineVisibility,
  MdEdit,
  MdDelete,
  MdGroup,
  MdPerson,
  MdEmail,
  MdBusiness,
  MdMoreVert,
  MdCheckCircle,
  MdCancel
} from 'react-icons/md'
import { FiChevronRight, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface User {
  _id: string
  first_name: string
  last_name: string
  email: string
  role: string
  avatar?: string
}

interface Department {
  _id: string
  name: string
  departmentCode: string
  status: string
  associatedUsersCount: number
  associatedUsersList: User[]
  createdAt?: string
  headOfDepartment?: string
  budget?: string
}

const Department = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedDept, setSelectedDept] = useState<Department | null>(null)
  const [drawerLoading, setDrawerLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: string }>({ key: 'name', direction: 'asc' })
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${BASE_URL}/api/department`)
      setDepartments(res.data?.result || [])
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartmentDetails = async (departmentId: string) => {
    setIsDrawerOpen(true)
    setDrawerLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}/api/department/${departmentId}`)
      setSelectedDept(response.data?.department || null)
    } catch (error) {
      console.error("Failed to fetch department details", error)
      setSelectedDept(null)
    } finally {
      setDrawerLoading(false)
    }
  }

  const handleSort = (key: string) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const sortedDepartments = React.useMemo(() => {
    let sortableItems = [...departments]
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [departments, sortConfig])

  const filteredDepartments = sortedDepartments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || dept.status === statusFilter
    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }
    return () => document.body.classList.remove("overflow-hidden")
  }, [isDrawerOpen])

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <MdCheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
      <MdCancel className="w-3 h-3 mr-1" />
      Inactive
    </span>
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
            <p className="text-gray-500 mt-1">Manage and view all departments in your organization</p>
          </div>
          <button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <MdAdd className="w-5 h-5 mr-1" />
            New Department
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Departments</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{departments.length}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MdBusiness className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Departments</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {departments.filter(d => d.status === 'active').length}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <MdCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {departments.reduce((acc, curr) => acc + curr.associatedUsersCount, 0)}
                </h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <MdGroup className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Employees/Dept</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {departments.length > 0
                    ? Math.round(departments.reduce((acc, curr) => acc + curr.associatedUsersCount, 0) / departments.length)
                    : 0
                  }
                </h3>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <MdPerson className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search departments..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              {/* <div className="relative">
                <select 
                  className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiChevronDown className="h-4 w-4" />
                </div>
              </div> */}

              {/* <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <MdFilterList className="w-5 h-5 mr-1" />
                Filter
              </button> */}
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <MdDownload className="w-5 h-5 mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Departments Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
            <Loading text="Loading departments..." />
          </div>
        ) : departments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MdBusiness className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No departments found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first department</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto">
              <MdAdd className="w-5 h-5 mr-1" />
              New Department
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Department Name
                        {sortConfig.key === 'name' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('departmentCode')}
                    >
                      <div className="flex items-center">
                        Code
                        {sortConfig.key === 'departmentCode' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('associatedUsersCount')}
                    >
                      <div className="flex items-center">
                        Employees
                        {sortConfig.key === 'associatedUsersCount' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>

                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDepartments.map((dept) => (
                    <React.Fragment key={dept._id}>
                      <tr className="hover:bg-gray-50 transition-colors duration-150">
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleRowExpansion(dept._id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {expandedRows.has(dept._id) ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <MdBusiness className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                              {dept.headOfDepartment && (
                                <div className="text-xs text-gray-500">HOD: {dept.headOfDepartment}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {`FMSL-${Math.floor(10000 + Math.random() * 90000)}`}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dept.associatedUsersCount}</div>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(dept.status)}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                              onClick={() => fetchDepartmentDetails(dept._id)}
                            >
                              <MdOutlineVisibility className="w-5 h-5" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800 p-1 rounded">
                              <MdEdit className="w-5 h-5" />
                            </button>
                            <button className="text-red-600 hover:text-red-800 p-1 rounded">
                              <MdDelete className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows.has(dept._id) && dept.associatedUsersList && dept.associatedUsersList.length > 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50">
                            <div className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Team Members ({dept.associatedUsersList.length})
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {dept.associatedUsersList.slice(0, 6).map(user => (
                                <div key={user._id} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    {user.avatar ? (
                                      <img className="h-8 w-8 rounded-full" src={user.avatar} alt="" />
                                    ) : (
                                      <span className="text-blue-600 text-xs font-medium">
                                        {getInitials(user.first_name, user.last_name)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.first_name} {user.last_name}
                                    </div>
                                    <div className="text-xs text-gray-500">{user.role}</div>
                                  </div>
                                </div>
                              ))}
                              {dept.associatedUsersList.length > 6 && (
                                <div className="flex items-center justify-center p-3 bg-gray-100 rounded-lg">
                                  <div className="text-sm text-gray-500">
                                    +{dept.associatedUsersList.length - 6} more members
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredDepartments.length === 0 && searchTerm && (
              <div className="text-center py-8">
                <p className="text-gray-500">No departments found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}

        {/* Drawer Overlay */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
            onClick={() => {
              setIsDrawerOpen(false)
              setSelectedDept(null)
            }}
          />
        )}

        {/* Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-[50%] bg-white shadow-xl transform transition-transform duration-300 z-50 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Department Details</h2>
              <button
                onClick={() => {
                  setIsDrawerOpen(false)
                  setSelectedDept(null)
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {drawerLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loading text="Loading details..." />
                </div>
              ) : selectedDept ? (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MdBusiness className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-gray-800">{selectedDept.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-600 mr-3">Code: {selectedDept.departmentCode}</span>
                          {getStatusBadge(selectedDept.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Employees</p>
                      <p className="text-lg font-semibold text-gray-800">{selectedDept.associatedUsersCount}</p>
                    </div>
                    {selectedDept.budget && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Budget</p>
                        <p className="text-lg font-semibold text-gray-800">{selectedDept.budget}</p>
                      </div>
                    )}
                    {selectedDept.createdAt && (
                      <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created On</p>
                        <p className="text-sm text-gray-800">{new Date(selectedDept.createdAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Team Members</h4>
                    <div className="space-y-3">
                      {selectedDept.associatedUsersList?.map((user) => (
                        <div key={user._id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {user.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                            ) : (
                              <span className="text-blue-600 font-medium">
                                {getInitials(user.first_name, user.last_name)}
                              </span>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <MdEmail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                          <div className="ml-auto">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-10">No department data available.</p>
              )}
            </div>

            {selectedDept && (
              <div className="border-t p-4">
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                    <MdEdit className="w-4 h-4 mr-1" />
                    Edit Department
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg">
                    <MdDelete className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Department