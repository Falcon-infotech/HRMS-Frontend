import React, { useEffect, useState } from 'react'
import axios from '../constants/axiosInstance'
import { BASE_URL } from '../constants/api'
import { MdAdd, MdEdit, MdClose, MdSave, MdCancel } from 'react-icons/md'
import { FiChevronRight, FiUsers, FiMapPin, FiCalendar } from 'react-icons/fi'
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
  const [updateLoading, setUpdateLoading] = useState(false)
const [search ,setSearch]=useState("")
  const [form, setForm] = useState({
    branchName: '',
    branchCode: '',
    country: '',
    address: '',
    weekends: [] as string[],
  });


  const filteredSearch=branches.filter((branch)=>(
    branch.branchName.toLocaleLowerCase().includes(search) ||
    branch.country.toLocaleLowerCase().includes(search) ||
    branch.branchCode.toLocaleLowerCase().includes(search)
  ))

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
      setDrawerLoading(false);
    }
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedBranch(null)
    setIsEditMode(false)
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

  // Days of week for weekend selection
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Branch Locations</h1>
        <p className="text-gray-600 mt-2">Manage all your business branches in one place</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Branches</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{branches.length}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiMapPin className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {branches.reduce((acc, branch) => acc + branch.associatedUsersCount, 0)}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiUsers className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search branches..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={search}
            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
              setSearch(e.target.value)
            }}
          />
          
          <svg 
            className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition shadow-md hover:shadow-lg"
        >
          <MdAdd className="w-5 h-5" />
          Create New Branch
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-48 bg-white rounded-xl shadow-sm">
          <Loading text="Loading locations..." />
        </div>
      ) : branches.length === 0 ? (
        <div className="text-center bg-white rounded-xl shadow-sm py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiMapPin className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first branch location</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition mx-auto"
          >
            <MdAdd className="w-5 h-5" />
            Create New Branch
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSearch.map((branch) => (
                <tr 
                  key={branch._id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => fetchBranchDetail(branch._id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {branch.branchCode}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">{branch.branchName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{branch.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{branch.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiUsers className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-700">{branch.associatedUsersCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchBranchDetail(branch._id);
                      }}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Branch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Create New Branch</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {['branchName', 'branchCode', 'country', 'address'].map((field) => (
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Week Off Days
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`weekend-${day}`}
                        value={day}
                        checked={form.weekends.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm(prev => ({ ...prev, weekends: [...prev.weekends, day] }));
                          } else {
                            setForm(prev => ({ ...prev, weekends: prev.weekends.filter(d => d !== day) }));
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor={`weekend-${day}`}
                        className={`flex-1 text-center py-2 rounded-lg border cursor-pointer transition ${form.weekends.includes(day) 
                          ? 'bg-primary-100 border-primary-500 text-primary-700' 
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {day.substring(0, 3)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                  disabled={loading2}
                >
                  {loading2 ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <MdAdd className="w-5 h-5" />
                      Create Branch
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branch Details Drawer */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={handleCloseDrawer} />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[42rem] bg-white shadow-xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Branch Details</h2>
              <button onClick={handleCloseDrawer} className="text-gray-400 hover:text-gray-600 transition">
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {drawerLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loading text="Loading details..." />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{selectedBranch?.branchName}</h3>
                      <p className="text-gray-600 mt-1">{selectedBranch?.address}</p>
                    </div>
                    {!isEditMode ? (
                      <button
                        className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
                        onClick={() => setIsEditMode(true)}
                      >
                        <MdEdit className="w-4 h-4" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
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
                          <MdCancel className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          className="flex items-center gap-2 text-sm bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
                          onClick={handleUpdateBranch}
                          disabled={updateLoading}
                        >
                          {updateLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <MdSave className="w-4 h-4" />
                          )}
                          Save
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FiMapPin className="text-gray-500" />
                        Branch Information
                      </h4>
                      {isEditMode ? (
                        <div className="space-y-4">
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
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm text-gray-500">Branch Code</dt>
                            <dd className="font-medium">{selectedBranch?.branchCode}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Country</dt>
                            <dd className="font-medium">{selectedBranch?.country}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Address</dt>
                            <dd className="font-medium">{selectedBranch?.address}</dd>
                          </div>
                        </dl>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FiCalendar className="text-gray-500" />
                        Week Off Days
                      </h4>
                      {isEditMode ? (
                        <div className="grid grid-cols-2 gap-2">
                          {daysOfWeek.map((day) => (
                            <div key={day} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`edit-weekend-${day}`}
                                value={day}
                                checked={editForm.weekends.includes(day)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditForm(prev => ({ ...prev, weekends: [...prev.weekends, day] }));
                                  } else {
                                    setEditForm(prev => ({ ...prev, weekends: prev.weekends.filter(d => d !== day) }));
                                  }
                                }}
                                className="hidden"
                              />
                              <label
                                htmlFor={`edit-weekend-${day}`}
                                className={`flex-1 text-center py-2 rounded-lg border cursor-pointer transition ${editForm.weekends.includes(day) 
                                  ? 'bg-primary-100 border-primary-500 text-primary-700' 
                                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`}
                              >
                                {day.substring(0, 3)}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedBranch?.weekends && selectedBranch.weekends.length > 0 ? (
                            selectedBranch.weekends.map(day => (
                              <span key={day} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                                {day}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-500">No weekends set</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <FiUsers className="text-gray-500" />
                      Associated Users ({selectedBranch?.associatedUsersCount})
                    </h4>
                    
                    {selectedBranch?.associatedUsersCount === 0 ? (
                      <div className="text-center py-6">
                        <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                          <FiUsers className="text-gray-500 text-xl" />
                        </div>
                        <p className="text-gray-500">No users associated with this branch</p>
                      </div>
                    ) : (
                      <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedBranch?.associatedUsersList?.map((user) => (
                              <tr key={user._id}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 capitalize">{user.role}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
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