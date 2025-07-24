import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../constants/api'
import axios from '../constants/axiosInstance'
import Loading from './Loading'
import { MdAdd } from 'react-icons/md'

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
  }[]
}

const Designation = () => {
  const [designations, setDesignations] = useState<Designation[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selected, setSelected] = useState<DesignationDetail | null>(null)
  const [drawerLoading, setDrawerLoading] = useState<boolean>(false)

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

  useEffect(() => {
    fetchDesignations()
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  return (
    <div className="p-6">
      <div className="flex justify-between mb-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Designations</h1>
        {/* <button className='bg-primary-600 text-white px-2 rounded-xl flex items-center'>Create New Designation <span><MdAdd className='w-12 h-8'/></span></button> */}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loading text="Loading designations..." />
        </div>
      ) : designations.length === 0 ? (
        <div className="text-center text-gray-500 font-medium py-10">
          No designations found.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full bg-white text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-700 font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 border">Designation Name</th>
                <th className="px-6 py-3 border">Associated Users</th>
              </tr>
            </thead>
            <tbody>
              {designations.map((d) => (
                <tr
                  key={d._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setIsOpen(true)
                    fetchDesignationDetail(d._id)
                  }}
                >
                  <td className="px-6 py-4 border">{d.name}</td>
                  <td className="px-6 py-4 border">{d.associatedUsersCount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => {
            setIsOpen(false)
            setSelected(null)
          }}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-1/2 max-sm:w-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Designation Details</h2>
          <button
            onClick={() => {
              setIsOpen(false)
              setSelected(null)
            }}
            className="text-gray-600 hover:text-red-500 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          {drawerLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loading text="Loading details..." />
            </div>
          ) : selected ? (
            <>
              <h3 className="text-xl font-semibold mb-2">{selected.name}</h3>
              <p className="mb-4 text-gray-600">Associated Users: {selected.associatedUsersCount}</p>

              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 font-medium text-gray-700">
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.associatedUsersList?.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{user.first_name} {user.last_name}</td>
                      <td className="px-4 py-2 border">{user.email}</td>
                      <td className="px-4 py-2 border capitalize">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="text-gray-500 text-center py-10">No designation selected.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Designation
