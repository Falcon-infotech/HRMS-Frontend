import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../constants/api'
import axios from '../constants/axiosInstance'
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
  MdBadge
} from 'react-icons/md'
import { FiChevronRight, FiX } from 'react-icons/fi'

interface Designation {
  _id: string
  name: string
  associatedUsersCount: number
}

interface DesignationDetail {
  _id: string
  name: string
  associatedUsersCount: number
  associatedUsersList: {
    _id: string
    first_name: string
    last_name: string
    email: string
    role: string
    avatar?: string
  }[]
}

const Designation = () => {
  const [designations, setDesignations] = useState<Designation[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [selected, setSelected] = useState<DesignationDetail | null>(null)
  const [drawerLoading, setDrawerLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [sortConfig, setSortConfig] = useState<{key: string, direction: string}>({key: 'name', direction: 'asc'})

  const fetchDesignations = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BASE_URL}/api/designation`)
      setDesignations(response.data?.result || [])
    } catch (error) {
      console.error('Error fetching designations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDesignationDetail = async (id: string) => {
    try {
      setDrawerLoading(true)
      const response = await axios.get(`${BASE_URL}/api/designation/${id}`)
      setSelected(response.data?.designation || null)
    } catch (error) {
      console.error('Error fetching designation details:', error)
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

  const sortedDesignations = React.useMemo(() => {
    let sortableItems = [...designations]
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
  }, [designations, sortConfig])

  const filteredDesignations = sortedDesignations.filter(designation =>
    designation.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    fetchDesignations()
  }, [])

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => document.body.classList.remove('overflow-hidden')
  }, [isDrawerOpen])

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Designations</h1>
            <p className="text-gray-500 mt-1">Manage and view all designations in your organization</p>
          </div>
          <button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <MdAdd className="w-5 h-5 mr-1" />
            New Designation
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Designations</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{designations.length}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MdBadge className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Most Common</p>
                <h3 className="text-xl font-bold text-gray-800 mt-1">
                  {designations.length > 0 
                    ? designations.reduce((prev, current) => 
                        (prev.associatedUsersCount > current.associatedUsersCount) ? prev : current
                      ).name
                    : 'N/A'
                  }
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <MdGroup className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {designations.reduce((acc, curr) => acc + curr.associatedUsersCount, 0)}
                </h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <MdPerson className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search designations..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
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

        {/* Designations Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
            <Loading text="Loading designations..." />
          </div>
        ) : designations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MdBadge className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No designations found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first designation</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto">
              <MdAdd className="w-5 h-5 mr-1" />
              New Designation
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
                        Designation Name
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
                      onClick={() => handleSort('associatedUsersCount')}
                    >
                      <div className="flex items-center">
                        Associated Users
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
                  {filteredDesignations.map((designation) => (
                    <tr 
                      key={designation._id} 
                      className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                      onClick={() => {
                        setIsDrawerOpen(true)
                        fetchDesignationDetail(designation._id)
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MdBadge className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{designation.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{designation.associatedUsersCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsDrawerOpen(true)
                              fetchDesignationDetail(designation._id)
                            }}
                          >
                            <MdOutlineVisibility className="w-5 h-5" />
                          </button>
                          {/* <button className="text-gray-600 hover:text-gray-800 p-1 rounded">
                            <MdEdit className="w-5 h-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-1 rounded">
                            <MdDelete className="w-5 h-5" />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredDesignations.length === 0 && searchTerm && (
              <div className="text-center py-8">
                <p className="text-gray-500">No designations found matching "{searchTerm}"</p>
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
              setSelected(null)
            }}
          />
        )}

        {/* Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Designation Details</h2>
              <button
                onClick={() => {
                  setIsDrawerOpen(false)
                  setSelected(null)
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
              ) : selected ? (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MdBadge className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-gray-800">{selected.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {selected.associatedUsersCount} associated user{selected.associatedUsersCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Associated Users</h4>
                    <div className="space-y-3">
                      {selected.associatedUsersList?.map((user) => (
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
                <p className="text-gray-500 text-center py-10">No designation selected.</p>
              )}
            </div>

            {selected && (
              <div className="border-t p-4">
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                    <MdEdit className="w-4 h-4 mr-1" />
                    Edit Designation
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

export default Designation