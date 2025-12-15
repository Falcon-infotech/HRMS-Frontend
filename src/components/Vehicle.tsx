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

interface Vehicle {
  _id: string
  itemType: string
  name: string
  model: string
  year: number
  registrationNo: string
  insuranceName: string
  capitalizedIn: string
  location: string
  expiryDate: string | null
  renewalDate?: string | null
  validUntil?: string | null
  remarks?: string
  createdAt?: string
  updatedAt?: string
}

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [drawerLoading, setDrawerLoading] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [search, setSearch] = useState('')

  const [form, setForm] = useState({
    itemType: '',
    name: '',
    model: '',
    year: new Date().getFullYear(),
    registrationNo: '',
    insuranceName: '',
    capitalizedIn: '',
    location: '',
    expiryDate: '',
    renewalDate: '',
    validUntil: '',
    remarks: '',
  })

  const [isEditMode, setIsEditMode] = useState(false)
  const [editForm, setEditForm] = useState({
    itemType: '',
    name: '',
    model: '',
    year: new Date().getFullYear(),
    registrationNo: '',
    insuranceName: '',
    capitalizedIn: '',
    location: '',
    expiryDate: '',
    renewalDate: '',
    validUntil: '',
    remarks: '',
  })

  const filteredSearch = vehicles.filter(v => {
    const q = search?.toLowerCase()
    return (
      v.name?.toLowerCase().includes(q) ||
      v.model?.toLowerCase().includes(q) ||
      String(v.year).includes(q) ||
      v.registrationNo?.toLowerCase().includes(q) ||
      v.location?.toLowerCase().includes(q)
    )
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading2(true)
      await axios.post(`${BASE_URL}/api/vehicle/create`, form)
      setIsModalOpen(false)
      setForm({
        itemType: '',
        name: '',
        model: '',
        year: new Date().getFullYear(),
        registrationNo: '',
        insuranceName: '',
        capitalizedIn: '',
        location: '',
        expiryDate: '',
        renewalDate: '',
        validUntil: '',
        remarks: '',
      })
      fetchVehicles()
    } catch (error) {
      console.error('Failed to create vehicle:', error)
    } finally {
      setLoading2(false)
    }
  }

  const fetchVehicles = async () => {
    try {
      // const response = await axios.get(`${BASE_URL}/api/branch`)
      const response = await axios.get(`${BASE_URL}/api/vehicle/all`)
      // setVehicles(response.data.branches || [])
      setVehicles(response?.data?.data || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVehicleDetail = async (id: string) => {
    setIsDrawerOpen(true)
    setDrawerLoading(true)
    setSelectedVehicle(null)

    try {
      const response = await axios.get(`${BASE_URL}/api/vehicle/get/${id}`)
      console.log('Vehicle detail response:', response?.data?.data)
      setSelectedVehicle(response?.data?.data || null)
      const v = response?.data?.data
      setEditForm({
        itemType: v.itemType || '',
        name: v.name || '',
        model: v.model || '',
        year: v.year || new Date().getFullYear(),
        registrationNo: v.registrationNo || '',
        insuranceName: v.insuranceName || '',
        capitalizedIn: v.capitalizedIn || '',
        location: v.location || '',
        expiryDate: v.expiryDate ? formatDate(v.expiryDate) : '',
        renewalDate: v.renewalDate ? formatDate(v.renewalDate) : '',
        validUntil: v.validUntil ? formatDate(v.validUntil) : '',
        remarks: v.remarks || '',
      })
    } catch (error) {
      console.error('Error fetching vehicle details:', error)
    } finally {
      setDrawerLoading(false)
    }
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedVehicle(null)
    setIsEditMode(false)
  }

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    fetchVehicles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpdateVehicle = async () => {
    if (!selectedVehicle) return
    try {
      setUpdateLoading(true)
      await axios.put(
        `${BASE_URL}/api/vehicle/update/${selectedVehicle._id}`,
        editForm
      )
      setIsEditMode(false)
      fetchVehicles()
      setSelectedVehicle(prev =>
        prev ? ({ ...prev, ...editForm } as Vehicle) : null
      )
    } catch (err) {
      console.error('Failed to update vehicle', err)
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDeleteVehicle = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this vehicle?'
    )
    if (!confirmed) return
    try {
      await axios.delete(`${BASE_URL}/api/vehicle/delete/${id}`)
      fetchVehicles()
      if (selectedVehicle && selectedVehicle._id === id) {
        handleCloseDrawer()
      }
    } catch (err) {
      console.error('Failed to delete vehicle', err)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Vehicle Management</h1>
        <p className="text-gray-600 mt-2">
          Manage all your vehicles in one place
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Vehicles</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {vehicles.length}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Truck className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expiring Soon</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {
                  vehicles.filter(v => {
                    if (!v?.expiryDate) return false

                    const today = new Date()
                    const threeMonthsLater = new Date()
                    threeMonthsLater.setMonth(today.getMonth() + 3)

                    const expiry = new Date(v.expiryDate)

                    return expiry >= today && expiry <= threeMonthsLater
                  }).length
                }
              </h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6 gap-3">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search vehicles..."
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition shadow-md hover:shadow-lg"
        >
          <MdAdd className="w-5 h-5" />
          <span className="hidden sm:inline">Create New Vehicle</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-48 bg-white rounded-xl shadow-sm">
          <Loading text="Loading vehicles..." />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center bg-white rounded-xl shadow-sm py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Truck className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No vehicles found
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first vehicle
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition mx-auto"
          >
            <MdAdd className="w-5 h-5" />
            Create New Vehicle
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSearch.map(v => (
                <tr
                  key={v._id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => fetchVehicleDetail(v._id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    {v.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {v.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {v.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {v.registrationNo || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {v.location || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(v.expiryDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        fetchVehicleDetail(v._id)
                      }}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleDeleteVehicle(v._id)
                      }}
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

      {/* Create Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Create New Vehicle
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
            >
              {/* Main fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Type
                  </label>
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-gray-400" />
                    <input
                      name="itemType"
                      value={form.itemType}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Name
                  </label>
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-gray-400" />
                    <input
                      name="model"
                      value={form.model}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      required
                      min={1900}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration No
                  </label>
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-gray-400" />
                    <input
                      name="registrationNo"
                      value={form.registrationNo}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capitalized In
                  </label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <input
                      name="capitalizedIn"
                      value={form.capitalizedIn}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="expiryDate"
                      value={form.expiryDate}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Renewal Date
                  </label>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="renewalDate"
                      value={form.renewalDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until
                  </label>
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="validUntil"
                      value={form.validUntil}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insurance Name
                  </label>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <input
                      name="insuranceName"
                      value={form.insuranceName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <div className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-gray-400 mt-2" />
                    <textarea
                      name="remarks"
                      value={form.remarks}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                    />
                  </div>
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
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <MdAdd className="w-5 h-5" />
                  )}
                  {loading2 ? 'Creating...' : 'Create Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vehicle Details Drawer */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={handleCloseDrawer}
          />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[42rem] bg-white shadow-xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Vehicle Details
              </h2>
              <button
                onClick={handleCloseDrawer}
                className="text-gray-400 hover:text-gray-600 transition"
              >
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
                      <h3 className="text-2xl font-bold text-gray-800">
                        {selectedVehicle?.name}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {selectedVehicle?.model} • {selectedVehicle?.year}
                      </p>
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
                            setIsEditMode(false)
                            if (selectedVehicle) {
                              setEditForm({
                                itemType: selectedVehicle.itemType,
                                name: selectedVehicle.name,
                                model: selectedVehicle.model,
                                year: selectedVehicle.year,
                                registrationNo:
                                  selectedVehicle.registrationNo || '',
                                insuranceName:
                                  selectedVehicle.insuranceName || '',
                                capitalizedIn:
                                  selectedVehicle.capitalizedIn || '',
                                location: selectedVehicle.location || '',
                                expiryDate: selectedVehicle.expiryDate
                                  ? selectedVehicle.expiryDate.split('T')[0]
                                  : '',
                                renewalDate: selectedVehicle.renewalDate
                                  ? selectedVehicle.renewalDate.split('T')[0]
                                  : '',
                                validUntil: selectedVehicle.validUntil
                                  ? selectedVehicle.validUntil.split('T')[0]
                                  : '',
                                remarks: selectedVehicle.remarks || '',
                              })
                            }
                          }}
                        >
                          <MdCancel className="w-4 h-4" /> Cancel
                        </button>
                        <button
                          className="flex items-center gap-2 text-sm bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
                          onClick={handleUpdateVehicle}
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
                        <Truck className="w-4 h-4 text-gray-500" /> Vehicle
                        Information
                      </h4>

                      {isEditMode ? (
                        <div className="space-y-4">
                          {[
                            'itemType',
                            'name',
                            'model',
                            'year',
                            'registrationNo',
                            'capitalizedIn',
                            'location',
                          ].map(field => (
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
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Tag className="w-4 h-4" /> Name
                            </dt>
                            <dd className="font-medium">
                              {selectedVehicle?.name}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Cpu className="w-4 h-4" /> Model
                            </dt>
                            <dd className="font-medium">
                              {selectedVehicle?.model}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Calendar className="w-4 h-4" /> Year
                            </dt>
                            <dd className="font-medium">
                              {selectedVehicle?.year}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Hash className="w-4 h-4" /> Registration
                            </dt>
                            <dd className="font-medium">
                              {selectedVehicle?.registrationNo || '-'}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <DollarSign className="w-4 h-4" /> Capitalized In
                            </dt>
                            <dd className="font-medium">
                              {selectedVehicle?.capitalizedIn || '-'}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <MapPin className="w-4 h-4" /> Location
                            </dt>
                            <dd className="font-medium">
                              {selectedVehicle?.location || '-'}
                            </dd>
                          </div>
                        </dl>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" /> Dates &
                        Insurance
                      </h4>

                      {isEditMode ? (
                        <div className="space-y-4">
                          {['expiryDate', 'renewalDate', 'validUntil'].map(
                            field => (
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
                            )
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Insurance Name
                            </label>
                            <input
                              name="insuranceName"
                              value={editForm.insuranceName}
                              onChange={handleEditChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Remarks
                            </label>
                            <textarea
                              name="remarks"
                              value={editForm.remarks}
                              onChange={handleEditChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                            />
                          </div>
                        </div>
                      ) : (
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Clock className="w-4 h-4" /> Expiry Date
                            </dt>
                            <dd className="font-medium">
                              {formatDate(selectedVehicle?.expiryDate || null)}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <RefreshCw className="w-4 h-4" /> Renewal Date
                            </dt>
                            <dd className="font-medium">
                              {formatDate(selectedVehicle?.renewalDate || null)}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <CalendarCheck className="w-4 h-4" /> Valid Until
                            </dt>
                            <dd className="font-medium">
                              {formatDate(selectedVehicle?.validUntil || null)}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Shield className="w-4 h-4" /> Insurance
                            </dt>
                            <dd className="font-medium">
                              {selectedVehicle?.insuranceName || '-'}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <FileText className="w-4 h-4" /> Remarks
                            </dt>
                            <dd className="font-medium">
                              {selectedVehicle?.remarks || '-'}
                            </dd>
                          </div>
                        </dl>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-700 flex items-center gap-2">
                        <Tag className="w-4 h-4" /> Meta
                      </h4>
                      <div className="text-sm text-gray-500">
                        Created:{' '}
                        {selectedVehicle?.createdAt
                          ? new Date(selectedVehicle.createdAt).toLocaleString()
                          : '-'}
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() =>
                          selectedVehicle &&
                          handleDeleteVehicle(selectedVehicle._id)
                        }
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete Vehicle
                      </button>
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

export default Vehicles
