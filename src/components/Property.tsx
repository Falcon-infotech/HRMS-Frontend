import React, { useEffect, useState } from 'react'
import axios from '../constants/axiosInstance'
import { BASE_URL, formatDate } from '../constants/api'
import { MdAdd, MdClose, MdSave, MdCancel, MdEdit } from 'react-icons/md'
import {
  Truck,
  Tag,
  Cpu,
  Calendar,
  Hash,
  Shield,
  DollarSign,
  MapPin,
  Clock,
  RefreshCw,
  CalendarCheck,
  FileText,
  Trash2,
} from 'lucide-react'
import Loading from './Loading'

interface Property {
  _id: string
  companyName: string
  country: string
  propertyAddress: string
  agreementBetween: string
  agreementStartDate: string | null
  agreementEndDate: string | null
  currency: string
  depositPaid: Number
  rentAmount: Number
  frequency?: string
  depositTerms?: string
  keyHolder?: string
  createdAt?: string
  updatedAt?: string
}

const Property = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [drawerLoading, setDrawerLoading] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [search, setSearch] = useState('')

  const [form, setForm] = useState({
    companyName: '',
    country: '',
    propertyAddress: '',
    agreementBetween: '',
    agreementStartDate: '',
    agreementEndDate: '',
    currency: '',
    depositPaid: 0,
    rentAmount: 0,
    frequency: '',
    depositTerms: '',
    keyHolder: '',

  })

  const [isEditMode, setIsEditMode] = useState(false)
  const [editForm, setEditForm] = useState({
    companyName: '',
    country: '',
    propertyAddress: '',
    agreementBetween: '',
    agreementStartDate: '',
    agreementEndDate: '',
    currency: '',
    depositPaid: 0,
    rentAmount: 0,
    frequency: '',
    depositTerms: '',
    keyHolder: '',

  })

  const filteredSearch = properties.filter((p) => {
    const q = search?.toLowerCase()
    return (
      p?.companyName?.toLowerCase().includes(q) ||
      p?.country?.toLowerCase().includes(q) ||
      p?.currency?.toLowerCase().includes(q) ||
      p?.frequency?.toLowerCase().includes(q) ||
      p?.keyHolder?.toLowerCase().includes(q)
    )
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading2(true)
      await axios.post(`${BASE_URL}/api/property/create`, form)
      setIsModalOpen(false)
      setForm({
        companyName: '',
        country: '',
        propertyAddress: '',
        agreementBetween: '',
        agreementStartDate: '',
        agreementEndDate: '',
        currency: '',
        depositPaid: 0,
        rentAmount: 0,
        frequency: '',
        depositTerms: '',
        keyHolder: '',
      })
      fetchProperties()
    } catch (error) {
      console.error('Failed to create property:', error)
    } finally {
      setLoading2(false)
    }
  }

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // const response = await axios.get(`${BASE_URL}/api/branch`);
      const response = await axios.get(`${BASE_URL}/api/property/all`);
      // setProperties(response.data?.branches || []);
      setProperties(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyDetail = async (id: string) => {
    setIsDrawerOpen(true)
    setDrawerLoading(true)
    setSelectedProperty(null)

    try {
      const response = await axios.get(`${BASE_URL}/api/property/get/${id}`)
      setSelectedProperty(response?.data?.data || null)
      const p = response?.data?.property
      setEditForm({
        companyName: p?.companyName,
        country: p?.country,
        propertyAddress: p?.propertyAddress,
        agreementBetween: p?.agreementBetween,
        agreementStartDate: p?.agreementStartDate,
        agreementEndDate: p?.agreementEndDate,
        currency: p?.currency,
        depositPaid: p?.depositPaid,
        rentAmount: p?.rentAmount,
        frequency: p?.frequency,
        depositTerms: p?.depositTerms,
        keyHolder: p?.keyHolder,
      })
    } catch (error) {
      console.error('Error fetching property details:', error)
    } finally {
      setDrawerLoading(false)
    }
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedProperty(null)
    setIsEditMode(false)
  }

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    fetchProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpdateProperty = async () => {
    if (!selectedProperty) return
    try {
      setUpdateLoading(true)
      await axios.put(`${BASE_URL}/api/property/update/${selectedProperty._id}`, editForm)
      setIsEditMode(false)
      fetchProperties()
      setSelectedProperty((prev) => (prev ? { ...prev, ...editForm } as Property : null))
    } catch (err) {
      console.error('Failed to update property', err)
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDeleteProperty = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this property?')
    if (!confirmed) return
    try {
      await axios.delete(`${BASE_URL}/api/property/delete/${id}`)
      fetchProperties()
      if (selectedProperty && selectedProperty._id === id) {
        handleCloseDrawer()
      }
    } catch (err) {
      console.error('Failed to delete property', err)
    }
  }


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Property Management</h1>
        <p className="text-gray-600 mt-2">Manage all your Properties in one place</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Property</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{properties.length}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Truck className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Rent</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{properties.filter(p => p?.rentAmount && p?.rentAmount).length}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div> */}
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6 gap-3">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search Properties..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
          <span className='hidden sm:inline'>Create New Property</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-48 bg-white rounded-xl shadow-sm">
          <Loading text="Loading Properties..." />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center bg-white rounded-xl shadow-sm py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Truck className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first property</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition mx-auto"
          >
            <MdAdd className="w-5 h-5" />
            Create New Property
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agreement Between</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deposit Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deposit Terms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Holder</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSearch.map((p) => (
                <tr key={p?._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => fetchPropertyDetail(p?._id)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">{p?.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p?.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p?.propertyAddress}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p?.agreementBetween || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(p?.agreementStartDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(p?.agreementEndDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p?.currency || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p?.depositPaid}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p?.rentAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p?.frequency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p?.depositTerms}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p?.keyHolder}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={(e) => { e.stopPropagation(); fetchPropertyDetail(p?._id); }}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteProperty(p?._id); }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Create New Property</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition"><MdClose className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Main fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-gray-400" />
                    <input name="companyName" value={form?.companyName} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">country</label>
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <input name="country" value={form?.country} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-gray-400 mt-2" />
                    <textarea name="propertyAddress" value={form?.propertyAddress} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Between</label>
                  <div className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-gray-400 mt-2" />
                    <textarea name="agreementBetween" value={form?.agreementBetween} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <input type="date" name="agreementStartDate" value={form?.agreementStartDate} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <input type="date" name="agreementEndDate" value={form?.agreementEndDate} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-gray-400" />
                    <input name="currency" value={form?.currency} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Paid</label>
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-gray-400" />
                    <input type="number" name="depositPaid" value={form?.depositPaid} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rent Amount</label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <input type="number" name="rentAmount" value={form?.rentAmount} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <input name="frequency" value={form?.frequency} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Terms</label>
                  <div className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-gray-400 mt-2" />
                    <textarea name="depositTerms" value={form?.depositTerms} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key holder</label>
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-gray-400" />
                    <input name="keyHolder" value={form?.keyHolder} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2" disabled={loading2}>
                  {loading2 ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <MdAdd className="w-5 h-5" />}
                  {loading2 ? 'Creating...' : 'Create Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Property Details Drawer */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={handleCloseDrawer} />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[42rem] bg-white shadow-xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Property Details</h2>
              <button onClick={handleCloseDrawer} className="text-gray-400 hover:text-gray-600 transition"><MdClose className="w-6 h-6" /></button>
            </div>

            <div className="p-6">
              {drawerLoading ? (
                <div className="flex justify-center items-center h-64"><Loading text="Loading details..." /></div>
              ) : (
                <>

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{selectedProperty?.companyName}</h3>
                      <p className="text-gray-600 mt-1">{selectedProperty?.country}</p>
                    </div>
                    {!isEditMode ? (
                      <button
                        className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
                        onClick={() => setIsEditMode(true)}
                      >
                        <MdEdit className="w-4 h-4" /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
                          onClick={() => {
                            setIsEditMode(false);
                            if (selectedProperty) {
                              setEditForm({
                                companyName: selectedProperty.companyName || '',
                                country: selectedProperty.country || '',
                                propertyAddress: selectedProperty.propertyAddress || '',
                                agreementBetween: selectedProperty.agreementBetween || '',
                                agreementStartDate: selectedProperty.agreementStartDate
                                  ? formatDate(selectedProperty.agreementStartDate)
                                  : '',
                                agreementEndDate: selectedProperty.agreementEndDate
                                  ? formatDate(selectedProperty.agreementEndDate)
                                  : '',
                                currency: selectedProperty.currency || '',
                                depositPaid: selectedProperty.depositPaid || 0,
                                rentAmount: selectedProperty.rentAmount || 0,
                                frequency: selectedProperty.frequency || '',
                                depositTerms: selectedProperty.depositTerms || '',
                                keyHolder: selectedProperty.keyHolder || '',
                              });
                            }
                          }}
                        >
                          <MdCancel className="w-4 h-4" /> Cancel
                        </button>
                        <button
                          className="flex items-center gap-2 text-sm bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
                          onClick={handleUpdateProperty}
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
                    {/* Left Column */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" /> Property Information
                      </h4>

                      {isEditMode ? (
                        <div className="space-y-4">
                          {['companyName', 'country', 'propertyAddress', 'agreementBetween', 'currency', 'frequency', 'keyHolder'].map(field => (
                            <div key={field}>
                              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                {field.replace(/([A-Z])/g, ' $1')}
                              </label>
                              <input
                                name={field}
                                value={(editForm as any)[field]}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm text-gray-500">Company Name</dt>
                            <dd className="font-medium">{selectedProperty?.companyName || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Country</dt>
                            <dd className="font-medium">{selectedProperty?.country || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Property Address</dt>
                            <dd className="font-medium">{selectedProperty?.propertyAddress || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Agreement Between</dt>
                            <dd className="font-medium">{selectedProperty?.agreementBetween || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Currency</dt>
                            <dd className="font-medium">{selectedProperty?.currency || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Frequency</dt>
                            <dd className="font-medium">{selectedProperty?.frequency || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Key Holder</dt>
                            <dd className="font-medium">{selectedProperty?.keyHolder || '-'}</dd>
                          </div>
                        </dl>
                      )}
                    </div>

                    {/* Right Column */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" /> Agreement Details
                      </h4>

                      {isEditMode ? (
                        <div className="space-y-4">
                          {['agreementStartDate', 'agreementEndDate'].map(field => (
                            <div key={field}>
                              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                {field.replace(/([A-Z])/g, ' $1')}
                              </label>
                              <input
                                type="date"
                                name={field}
                                value={(editForm as any)[field]}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>
                          ))}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Paid</label>
                            <input
                              type="number"
                              name="depositPaid"
                              value={editForm.depositPaid}
                              onChange={handleEditChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rent Amount</label>
                            <input
                              type="number"
                              name="rentAmount"
                              value={editForm.rentAmount}
                              onChange={handleEditChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Terms</label>
                            <textarea
                              name="depositTerms"
                              value={editForm.depositTerms}
                              onChange={handleEditChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                            />
                          </div>
                        </div>
                      ) : (
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm text-gray-500">Agreement Start Date</dt>
                            <dd className="font-medium">{formatDate(selectedProperty?.agreementStartDate || null)}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Agreement End Date</dt>
                            <dd className="font-medium">{formatDate(selectedProperty?.agreementEndDate || null)}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Deposit Paid</dt>
                            <dd className="font-medium">{selectedProperty?.depositPaid || 0}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Rent Amount</dt>
                            <dd className="font-medium">{selectedProperty?.rentAmount || 0}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-gray-500">Deposit Terms</dt>
                            <dd className="font-medium">{selectedProperty?.depositTerms || '-'}</dd>
                          </div>
                        </dl>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-700 flex items-center gap-2"><Tag className="w-4 h-4" /> Meta</h4>
                      <div className="text-sm text-gray-500">Created: {selectedProperty?.createdAt ? new Date(selectedProperty.createdAt).toLocaleString() : '-'}</div>
                    </div>

                    <div className="mt-4">
                      <button onClick={() => selectedProperty && handleDeleteProperty(selectedProperty._id)} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Delete Property</button>
                    </div>
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

export default Property
