import React, { useEffect, useState } from 'react'
import axios from '../constants/axiosInstance'
import { BASE_URL } from '../constants/api'
import { MdAdd } from 'react-icons/md'
import Loading from './Loading'

interface User {
  _id: string
  first_name: string
  last_name: string
  email: string
  role: string
}

interface Branch {
  _id: string
  address: string
  associatedUsers: number
  associatedUsersCount: number
  associatedUsersList: User[]
  branchCode: string
  branchName: string
  country: string
  weekends: string[]
}

const Location = () => {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [drawerLoading, setDrawerLoading] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  const [form, setForm] = useState({
    branchName: '',
    branchCode: '',
    country: '',
    address: '',
    weekends: [] as string[],
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    branchName: '',
    branchCode: '',
    country: '',
    address: '',
    weekends: [] as string[],
  });

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
      setForm({ branchName: '', branchCode: '', country: '', address: '', weekends: [] })
      fetchLocations()
    } catch (error) {
      console.error('Failed to create branch:', error)
    } finally {
      setLoading2(false)
    }
  }

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/branch`)
      setBranches(response.data.branches || [])
    } catch (error) {
      console.error('Error fetching branches:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBranchDetail = async (id: string) => {
    setIsDrawerOpen(true);
    setDrawerLoading(true);
    setSelectedBranch(null);

    try {
      const response = await axios.get(`${BASE_URL}/api/branch/${id}`);
      setSelectedBranch(response.data?.branch || null);
      setEditForm({
        branchName: response.data.branch.branchName,
        branchCode: response.data.branch.branchCode,
        country: response.data.branch.country,
        address: response.data.branch.address,
        weekends: response.data.branch.weekends || [],
      });
    } catch (error) {
      console.error('Error fetching branch details:', error);
    } finally {
      setDrawerLoading(false); // Stop loading after API call
    }
  }


  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedBranch(null)
  }

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, multiple, selectedOptions } = e.target;
    const updatedValue = multiple
      ? Array.from(selectedOptions, (opt) => opt.value)
      : value;

    setEditForm((prev) => ({ ...prev, [name]: updatedValue }));
  };


  useEffect(() => {
    fetchLocations()
  }, [])
const [updateLoading, setUpdateLoading] = useState(false);

  const handleUpdateBranch = async () => {
    try {
      setUpdateLoading(true);
      await axios.put(`${BASE_URL}/api/branch/update/${selectedBranch._id}`, editForm);
      setIsEditMode(false);
      fetchLocations(); 
       setSelectedBranch((prev) => prev ? {
      ...prev,
      ...editForm
    } : null);
    } catch (err) {
      console.error("Failed to update branch", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="py-6 relative">
      {/* Header */}
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

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loading text="Loading locations..." />
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
              {branches.map((branch) => (
                <tr
                  key={branch._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => fetchBranchDetail(branch._id)}
                >
                  <td className="px-6 py-4 border-b">{branch.branchCode}</td>
                  <td className="px-6 py-4 border-b text-primary-500">{branch.branchName}</td>
                  <td className="px-6 py-4 border-b">{branch.address}</td>
                  <td className="px-6 py-4 border-b">{branch.country}</td>
                  <td className="px-6 py-4 border-b text-center">{branch.associatedUsersCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-2xl shadow-lg relative">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Branch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['branchName', 'branchCode', 'country', 'address',].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={form[field as keyof typeof form]}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ))}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Week Off Days (Select multiple)
                </label>
                <select
                  multiple
                  name="weekends"
                  value={form.weekends}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
                    setForm((prev) => ({ ...prev, weekends: selected }));
                  }}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
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
                  {loading2 ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={handleCloseDrawer} />
          <div className="fixed top-0 right-0 h-full w-[50vw] max-w-full bg-white shadow-lg z-50 overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Branch Details</h2>
              <button onClick={handleCloseDrawer} className="text-gray-500 hover:text-red-500 text-lg">✕</button>
            </div>

            <div className="p-4">
              {drawerLoading ? <Loading text="Loading details..." /> : (
                <>
                  <div className="flex justify-end gap-2 pb-3">
                    {!isEditMode ? (
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        onClick={() => setIsEditMode(true)}
                      >
                        Edit Branch
                      </button>
                    ) : (
                      <>
                        <button
                          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                          onClick={() => {
                            setIsEditMode(false);
                            if (selectedBranch) {
                              setEditForm({
                                branchName: selectedBranch.branchName,
                                branchCode: selectedBranch.branchCode,
                                country: selectedBranch.country,
                                address: selectedBranch.address,
                                weekends: selectedBranch.weekends || [],
                              });
                            }
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          onClick={handleUpdateBranch}
                          disabled={drawerLoading}
                        >
                          {updateLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </>
                    )}
                  </div>

                  {isEditMode ? (
                    <form className="space-y-4">
                      {['branchName', 'branchCode', 'country', 'address'].map(field => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                            {field.replace(/([A-Z])/g, ' $1')}
                          </label>
                          <input
                            type="text"
                            name={field}
                            value={editForm[field as keyof typeof editForm]}
                            onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weekends</label>
                        <select
                          multiple
                          name="weekends"
                          value={editForm.weekends}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded px-4 py-2"
                        >
                          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold mb-1">BranchName: {selectedBranch?.branchName}</h3>
                      <p className="mb-1 text-gray-600">Code: {selectedBranch?.branchCode}</p>
                      <p className="mb-1 text-gray-600">Country: {selectedBranch?.country}</p>
                      <p className="mb-1 text-gray-600">Address: {selectedBranch?.address}</p>
                      <p className="mb-3 text-gray-600">Weekends: {selectedBranch?.weekends?.join(', ') || 'N/A'}</p>
                    </>
                  )}

                  <h4 className="text-md font-semibold mb-2">Associated Users ({selectedBranch?.associatedUsersCount})</h4>

                  {selectedBranch?.associatedUsersCount === 0 ? (
                    <p className="text-gray-500">No associated users.</p>
                  ) : (
                    <table className="min-w-full text-sm text-left border border-gray-200">
                      <thead className="bg-gray-100 font-medium text-gray-700">
                        <tr>
                          <th className="px-4 py-2 border">Name</th>
                          <th className="px-4 py-2 border">Email</th>
                          <th className="px-4 py-2 border">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBranch?.associatedUsersList?.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border">{user.first_name} {user.last_name}</td>
                            <td className="px-4 py-2 border">{user.email}</td>
                            <td className="px-4 py-2 border capitalize">{user.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Location
