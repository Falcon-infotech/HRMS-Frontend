import React, { useEffect, useState } from 'react'
import axios from '../constants/axiosInstance'
import { BASE_URL } from '../constants/api'
import Loading from './Loading'
import { MdAdd } from 'react-icons/md'

interface Department {
  departmentCode: string
  departmentName: string
  status: string
  createdAt?: string
}

const Department = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/department`)
    //   console.log(res.data.data)
      setDepartments(res.data.data || [])
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  return (
    <div className="p-6">
      <div className='flex justify-between mb-10'>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Departments</h1>
              <button className='bg-primary-600 text-white px-2 rounded-xl flex items-center'>Create New Department <span><MdAdd className='w-12 h-8'/></span></button>
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
                <th className="px-6 py-3 border-b">Department Name</th>
                <th className="px-6 py-3 border-b">Associated Users</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{dept?.name}</td>
                  <td className="px-6 py-4 border-b">{0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Department
