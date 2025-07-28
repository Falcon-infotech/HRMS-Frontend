import React, { useEffect, useState } from 'react'
import axios from '../constants/axiosInstance'
import { BASE_URL } from '../constants/api'
import { MdAdd } from 'react-icons/md'
import Loading from './Loading'

interface Branch {
  address: string
  associatedUsers: number
  associatedUsersCount: number
  branchCode: string
  branchName: string
  country: string
}

const Location = () => {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  

  const [form, setForm] = useState({
    branchName: '',
    branchCode: '',
    country: '',
    address: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading2(true)
      await axios.post(`${BASE_URL}/api/branch/create`, form)
      setIsModalOpen(false)
      setForm({ branchName: '', branchCode: '', country: '', address: '' })
      fetchLocations() 
    } catch (error) {
      console.error('Failed to create branch:', error)
    }finally{
      setLoading2(false)
    }
  }

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/branch`)
      setBranches(response.data.branches || [])
      console.log(response.data?.branches)
    } catch (error) {
      console.error('Error fetching branches:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-gray-800 max-md:text-sm">Branch Locations</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white md:px-4 md:py-2 px-2 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition max-md:text-xs text-nowrap"
        >
          <MdAdd className="w-5 h-5" />
          Create New Branch
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <span className="ml-3 text-blue-600 font-medium">
            <Loading text="Loading locations..." />
          </span>
        </div>
      ) : branches.length === 0 ? (
        <div className="text-center text-gray-500 font-medium py-10">
          No branches found.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full bg-white text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-700 font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 border-b">Branch Code</th>
                <th className="px-6 py-3 border-b">Branch Name</th>
                <th className="px-6 py-3 border-b">Address</th>
                <th className="px-6 py-3 border-b">Country</th>
                <th className="px-6 py-3 border-b text-center">Associated Users</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{branch.branchCode}</td>
                  <td className="px-6 py-4 border-b">{branch.branchName}</td>
                  <td className="px-6 py-4 border-b">{branch.address}</td>
                  <td className="px-6 py-4 border-b">{branch.country}</td>
                  <td className="px-6 py-4 border-b text-center">{branch.associatedUsersCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-2xl shadow-lg relative">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Branch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                <input
                  type="text"
                  name="branchName"
                  value={form.branchName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code</label>
                <input
                  type="text"
                  name="branchCode"
                  value={form.branchCode}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
                  disabled={loading2}
                >
                  {loading2 ? "Creating...":"Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Location
