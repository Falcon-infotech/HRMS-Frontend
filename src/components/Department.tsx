import React, { useEffect, useState } from 'react'
import axios from '../constants/axiosInstance'
import { BASE_URL } from '../constants/api'
import Loading from './Loading'

interface Department {
  departmentCode: string
  departmentName: string
  status: string
  createdAt?: string
}

const Department = () => {

  interface User {
    _id: string
    first_name: string
    last_name: string
    email: string
    role: string
  }

  interface Department {
    _id: string
    name: string
    associatedUsersCount: number
    associatedUsersList: User[]
  }

  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDept, setSelectedDept] = useState<Department | null>(null)
  const [drawerLoading, setDrawerLoading] = useState(false)

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/department`)
      // console.log(res.data.result)
      setDepartments(res.data?.result || [])
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = async (departmentCode: string) => {
    console.log(departmentCode)
    setIsOpen(true)
    setDrawerLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}/api/department/${departmentCode}`)
      const data = response.data
      setSelectedDept(response.data?.department || null)
    } catch (error) {
      console.error("Failed to fetch department details", error)
      setSelectedDept(null)
    } finally {
      setDrawerLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])


  useEffect(()=>{
    if(isOpen){
      document.body.classList.add("overflow-hidden")
    }else{
      document.body.classList.remove("overflow-hidden")
    }


    return ()=>document.body.classList.remove("overflow-hidden")
  },[isOpen])

  return (
    <div className="p-6">
      <div className='flex justify-between mb-10'>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Departments</h1>
        {/* <button className='bg-primary-600 text-white px-2 rounded-xl flex items-center'>Create New Designation <span><MdAdd className='w-12 h-8'/></span></button> */}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <span className="ml-3 text-blue-600 font-medium"><Loading text={"Loading departments..."} /></span>
        </div>
      ) : departments.length === 0 ? (
        <div className="text-center text-gray-500 font-medium py-10">
          No departments found.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full bg-white text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-700 font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 border">Department Name</th>
                <th className="px-6 py-3 border">Associated Users</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(dept._id)}
                >
                  <td className="px-6 py-4 border">{dept?.name}</td>
                  <td className="px-6 py-4 border">{dept?.associatedUsersCount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      )}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div className={`fixed top-0 right-0 h-full w-1/2 max-sm:w-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Department Details</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-red-500 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          {drawerLoading ? (
            <div className="text-center text-gray-500 py-10"><Loading text={"Loading department details..."}/></div>
          ) : selectedDept ? (
            <>
              <table className="min-w-full bg-white text-sm text-left text-gray-700 mb-6">
                <thead className="bg-gray-100 text-gray-700 font-semibold uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3 border">Department Name</th>
                    <th className="px-6 py-3 border">Associated Users</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 border">{selectedDept.name}</td>
                    <td className="px-6 py-4 border">{selectedDept.associatedUsersCount}</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="text-lg font-semibold mb-2">Associated Users</h3>

              {selectedDept.associatedUsersList.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
              ) : (
                <table className="min-w-full bg-white text-sm text-left text-gray-700">
                  <thead className="bg-gray-100 text-gray-700 font-semibold uppercase tracking-wide">
                    <tr>
                      <th className="px-6 py-3 border">Name</th>
                      <th className="px-6 py-3 border">Email</th>
                      <th className="px-6 py-3 border">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDept.associatedUsersList.map(user => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 border">{user.first_name} {user.last_name}</td>
                        <td className="px-6 py-4 border">{user.email}</td>
                        <td className="px-6 py-4 border capitalize">{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <p className="text-gray-500">No department data available.</p>
          )}
        </div>
      </div>

    </div>
  )
}

export default Department
