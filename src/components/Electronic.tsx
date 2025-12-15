import React, { useEffect, useState } from 'react'
import axios from '../constants/axiosInstance'
import { BASE_URL, formatDate } from '../constants/api'
import { MdAdd, MdClose, MdSave, MdCancel, MdEdit } from 'react-icons/md'
import {
  User,
  Phone,
  Briefcase,
  Tag,
  Cpu,
  Calendar,
  FileText,
  DollarSign,
  Hash,
  Palette,
  Settings,
  Key,
  AlertTriangle,
  MapPin,
  Building,
  Package,
  CheckSquare,
  Lock,
  Building2,
  Wrench,
  RotateCcw,
  CalendarCheck,
  RefreshCw,
  Trash2,
  Truck,
  Clock,
} from "lucide-react";
import Loading from './Loading'

export interface Accessory {
  available: boolean;
  condition: "Working" | "Poor" | "Damaged" | "Not Applicable";
}

export interface Accessories {
  keyboard: Accessory;
  monitor: Accessory;
  mouse: Accessory;
  cpu: Accessory;
  chair: Accessory;
  switch: Accessory;
  lanCable: Accessory;
}

export interface ElectronicItem {
  _id?: string;
  usedBy?: string;
  officePhoneNumber?: string;
  employeeId?: string;
  designation?: string;
  itemType: string;
  itemName: string;
  brand?: string;
  modelName?: string;
  serialNo?: string;
  configuration?: string;
  purchaseDate?: string; // ISO string for dates
  invoiceNo?: string;
  issuedDate?: string;
  returnedDate?: string;
  estimatedValue?: number;
  color?: string;
  condition?: "Good" | "Average" | "Poor" | "Damaged" | "Under Repair";
  password?: string;
  error?: string;
  remarks?: string;
  accessories: Accessories;
  branch?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}


const ElectronicItem = () => {
  const [electronicItems, setElectronicItems] = useState<ElectronicItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [drawerLoading, setDrawerLoading] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [selectedElectronicItem, setSelectedElectronicItem] = useState<ElectronicItem | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [search, setSearch] = useState('')

  const [form, setForm] = useState({
    usedBy: '',
    officePhoneNumber: '',
    employeeId: '',
    designation: '',
    itemType: '',
    itemName: '',
    brand: '',
    modelName: '',
    serialNo: '',
    configuration: '',
    purchaseDate: '',
    invoiceNo: '',
    issuedDate: '',
    returnedDate: '',
    estimatedValue: '',
    color: '',
    condition: 'Good',
    password: '',
    error: '',
    remarks: '',
    accessories: {
      keyboard: { available: false, condition: 'Not Applicable' },
      monitor: { available: false, condition: 'Not Applicable' },
      mouse: { available: false, condition: 'Not Applicable' },
      cpu: { available: false, condition: 'Not Applicable' },
      chair: { available: false, condition: 'Not Applicable' },
      switch: { available: false, condition: 'Not Applicable' },
      lanCable: { available: false, condition: 'Not Applicable' },
    },
    branch: '',
    location: '',
  });


  const [isEditMode, setIsEditMode] = useState(false)
  const [editForm, setEditForm] = useState({
    usedBy: '',
    officePhoneNumber: '',
    employeeId: '',
    designation: '',
    itemType: '',
    itemName: '',
    brand: '',
    modelName: '',
    serialNo: '',
    configuration: '',
    purchaseDate: '',
    invoiceNo: '',
    issuedDate: '',
    returnedDate: '',
    estimatedValue: '',
    color: '',
    condition: 'Good',
    password: '',
    error: '',
    remarks: '',
    accessories: {
      keyboard: { available: false, condition: 'Not Applicable' },
      monitor: { available: false, condition: 'Not Applicable' },
      mouse: { available: false, condition: 'Not Applicable' },
      cpu: { available: false, condition: 'Not Applicable' },
      chair: { available: false, condition: 'Not Applicable' },
      switch: { available: false, condition: 'Not Applicable' },
      lanCable: { available: false, condition: 'Not Applicable' },
    },
    branch: '',
    location: '',
  })

  const filteredSearch = electronicItems.filter((ei) => {
    const q = search?.toLowerCase()
    return (
      ei?.usedBy?.toLowerCase().includes(q) ||
      ei?.itemType?.toLowerCase().includes(q) ||
      ei?.itemName?.toLowerCase().includes(q) ||
      ei?.modelName?.toLowerCase().includes(q) ||
      ei?.condition?.toLowerCase().includes(q) ||
      ei?.branch?.toLowerCase().includes(q) ||
      ei?.location?.toLowerCase().includes(q) ||
      ei?.brand?.toLowerCase().includes(q)
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
      await axios.post(`${BASE_URL}/api/electronicItem/create`, form)
      setIsModalOpen(false)
      setForm({
        usedBy: '',
        officePhoneNumber: '',
        employeeId: '',
        designation: '',
        itemType: '',
        itemName: '',
        brand: '',
        modelName: '',
        serialNo: '',
        configuration: '',
        purchaseDate: '',
        invoiceNo: '',
        issuedDate: '',
        returnedDate: '',
        estimatedValue: '',
        color: '',
        condition: 'Good',
        password: '',
        error: '',
        remarks: '',
        accessories: {
          keyboard: selectedElectronicItem?.accessories?.keyboard || { available: false, condition: "Not Applicable" },
          monitor: selectedElectronicItem?.accessories?.monitor || { available: false, condition: "Not Applicable" },
          mouse: selectedElectronicItem?.accessories?.mouse || { available: false, condition: "Not Applicable" },
          cpu: selectedElectronicItem?.accessories?.cpu || { available: false, condition: "Not Applicable" },
          chair: selectedElectronicItem?.accessories?.chair || { available: false, condition: "Not Applicable" },
          switch: selectedElectronicItem?.accessories?.switch || { available: false, condition: "Not Applicable" },
          lanCable: selectedElectronicItem?.accessories?.lanCable || { available: false, condition: "Not Applicable" },
        },
        branch: '',
        location: '',
      })
      fetchElectronicItems()
    } catch (error) {
      console.error('Failed to create electronicItem:', error)
    } finally {
      setLoading2(false)
    }
  }

  const fetchElectronicItems = async () => {
    try {
      // const response = await axios.get(`${BASE_URL}/api/branch`)
      const response = await axios.get(`${BASE_URL}/api/electronicItem/all`)
      // setElectronicItems(response.data.branches || [])
      setElectronicItems(response?.data?.data || [])
    } catch (error) {
      console.error('Error fetching electronicItems:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchElectronicItemDetail = async (id: string) => {
    setIsDrawerOpen(true)
    setDrawerLoading(true)
    setSelectedElectronicItem(null)

    try {
      const response = await axios.get(`${BASE_URL}/api/electronicItem/get/${id}`)
      setSelectedElectronicItem(response?.data?.data || null)
      const ei = response?.data?.data
      setEditForm({
        usedBy: ei?.usedBy || '',
        officePhoneNumber: ei?.officePhoneNumber || '',
        employeeId: ei?.employeeId || '',
        designation: ei?.designation || '',
        itemType: ei?.itemType || '',
        itemName: ei?.itemName || '',
        brand: ei?.brand || '',
        modelName: ei?.modelName || '',
        serialNo: ei?.serialNo || '',
        configuration: ei?.configuration || '',
        purchaseDate: ei?.purchaseDate ? formatDate(ei?.purchaseDate) : '',
        invoiceNo: ei?.invoiceNo || '',
        issuedDate: ei?.issuedDate ? formatDate(ei?.issuedDate) : '',
        returnedDate: ei?.returnedDate ? formatDate(ei?.returnedDate) : '',
        estimatedValue: ei?.estimatedValue || '',
        color: ei?.color || '',
        condition: ei?.condition || 'Good',
        password: ei?.password || '',
        error: ei?.error || '',
        remarks: ei?.remarks || '',
        accessories: {
          keyboard: ei?.accessories?.keyboard || { available: false, condition: "Not Applicable" },
          monitor: ei?.accessories?.monitor || { available: false, condition: "Not Applicable" },
          mouse: ei?.accessories?.mouse || { available: false, condition: "Not Applicable" },
          cpu: ei?.accessories?.cpu || { available: false, condition: "Not Applicable" },
          chair: ei?.accessories?.chair || { available: false, condition: "Not Applicable" },
          switch: ei?.accessories?.switch || { available: false, condition: "Not Applicable" },
          lanCable: ei?.accessories?.lanCable || { available: false, condition: "Not Applicable" },
        },
        branch: ei?.branch || '',
        location: ei?.location || '',
      });

    } catch (error) {
      console.error('Error fetching electronicItem details:', error)
    } finally {
      setDrawerLoading(false)
    }
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedElectronicItem(null)
    setIsEditMode(false)
  }

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    fetchElectronicItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpdateElectronicItem = async () => {
    if (!selectedElectronicItem) return
    try {
      setUpdateLoading(true)
      await axios.put(`${BASE_URL}/api/electronicItem/update/${selectedElectronicItem._id}`, editForm)
      setIsEditMode(false)
      fetchElectronicItems()
      setSelectedElectronicItem((prev) =>
        prev
          ? ({
            ...prev,
            ...editForm,
            purchaseDate: editForm.purchaseDate ? formatDate(editForm.purchaseDate) : '',
            issuedDate: editForm.issuedDate ? formatDate(editForm.issuedDate) : '',
            returnedDate: editForm.returnedDate ? formatDate(editForm.returnedDate) : '',
            estimatedValue: editForm.estimatedValue
              ? Number(editForm.estimatedValue)
              : 0,
          } as ElectronicItem)
          : null
      );
    } catch (err) {
      console.error('Failed to update electronicItem', err)
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDeleteElectronicItem = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this electronicItem?')
    if (!confirmed) return
    try {
      await axios.delete(`${BASE_URL}/api/electronicItem/delete/${id}`)
      fetchElectronicItems()
      if (selectedElectronicItem && selectedElectronicItem._id === id) {
        handleCloseDrawer()
      }
    } catch (err) {
      console.error('Failed to delete electronicItem', err)
    }
  }

  // ✅ Handle accessory changes for both create and edit modes
  const handleAccessoryChange = (key: any, field: any, value: any) => {
    if (isEditMode) {
      setEditForm((prevForm) => ({
        ...prevForm,
        accessories: {
          ...prevForm.accessories,
          [key]: {
            ...prevForm.accessories[key],
            [field]: value,
          },
        },
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        accessories: {
          ...prevForm.accessories,
          [key]: {
            ...prevForm.accessories[key],
            [field]: value,
          },
        },
      }));
    }
  };



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold text-gray-800">ElectronicItem Management</h1>
        <p className="text-gray-600 mt-2">Manage all your electronicItems in one place</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total ElectronicItems</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{electronicItems.length}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Truck className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6 gap-3">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search electronicItems..."
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
          <span className='hidden sm:inline'>Create New ElectronicItem</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-48 bg-white rounded-xl shadow-sm">
          <Loading text="Loading electronicItems..." />
        </div>
      ) : electronicItems.length === 0 ? (
        <div className="text-center bg-white rounded-xl shadow-sm py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Truck className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No electronicItems found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first electronicItem</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition mx-auto"
          >
            <MdAdd className="w-5 h-5" />
            Create New ElectronicItem
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Used By</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Office Phone</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee ID</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Designation</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item Type</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Model Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Serial No</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Configuration</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Purchase Date</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice No</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Issued Date</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Returned Date</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estimated Value</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Color</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Condition</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Password</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Error</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remarks</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Accessories</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Branch</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSearch.map((ei) => (
                <tr
                  key={ei?._id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => fetchElectronicItemDetail(ei?._id)}
                >
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.usedBy || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.officePhoneNumber || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.employeeId || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.designation || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.itemType || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.itemName || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.brand || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.modelName || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.serialNo || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.configuration || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.purchaseDate ? formatDate(ei?.purchaseDate) : '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.invoiceNo || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.issuedDate ? formatDate(ei?.issuedDate) : '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.returnedDate ? formatDate(ei?.returnedDate) : '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.estimatedValue || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.color || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.condition || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.password || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.error || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.remarks || '-'}</td>

                  {/* Accessories Summary */}
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {Object.entries(ei?.accessories || {}).map(([key, val]: any) => (
                      <div key={key}>
                        <strong>{key}</strong>: {val.available ? 'Yes' : 'No'} ({val.condition})
                      </div>
                    ))}
                  </td>

                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.branch || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ei?.location || '-'}</td>

                  {/* Actions */}
                  <td className="px-4 py-2 text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchElectronicItemDetail(ei?._id);
                      }}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteElectronicItem(ei?._id);
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

      {/* Create ElectronicItem Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Create New ElectronicItem</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition"><MdClose className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* ========== BASIC DETAILS ========== */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Used By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Used By</label>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <input
                      name="usedBy"
                      value={form.usedBy}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                {/* Office Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Office Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <input
                      name="officePhoneNumber"
                      value={form.officePhoneNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="+971500000000"
                    />
                  </div>
                </div>

                {/* Employee ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-gray-400" />
                    <input name="employeeId" value={form.employeeId} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <input name="designation" value={form.designation} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Item Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    <input name="itemType" value={form.itemType} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Item Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <input name="itemName" value={form.itemName} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <input name="brand" value={form.brand} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Model Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-gray-400" />
                    <input name="modelName" value={form.modelName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Serial No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial No</label>
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-gray-400" />
                    <input name="serialNo" value={form.serialNo} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Configuration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Configuration</label>
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <input name="configuration" value={form.configuration} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Purchase Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <input type="date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Invoice No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <input name="invoiceNo" value={form.invoiceNo} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Issued / Returned Dates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issued Date</label>
                  <input type="date" name="issuedDate" value={form.issuedDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Returned Date</label>
                  <input type="date" name="returnedDate" value={form.returnedDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>

                {/* Estimated Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value</label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <input type="number" name="estimatedValue" value={form.estimatedValue} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" min={0} />
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-gray-400" />
                    <input name="color" value={form.color} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select name="condition" value={form.condition} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option>Good</option>
                    <option>Average</option>
                    <option>Poor</option>
                    <option>Damaged</option>
                    <option>Under Repair</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-gray-400" />
                    <input name="password" value={form.password} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Error */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Error</label>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-gray-400" />
                    <input name="error" value={form.error} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-gray-400" />
                    <input name="branch" value={form.branch} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <input name="location" value={form.location} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>

                {/* Remarks */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <div className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-gray-400 mt-2" />
                    <textarea name="remarks" value={form.remarks} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24" />
                  </div>
                </div>
              </div>

              {/* Accessories Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Accessories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(form.accessories).map(([key, acc]) => (
                    <div key={key} className="border p-3 rounded-lg bg-gray-50">
                      <label className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={acc.available}
                          onChange={(e) => handleAccessoryChange(key, "available", e.target.checked)}
                        />
                        <span className="capitalize">{key}</span>
                      </label>
                      <select
                        value={acc.condition}
                        onChange={(e) => handleAccessoryChange(key, "condition", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option>Working</option>
                        <option>Poor</option>
                        <option>Damaged</option>
                        <option>Not Applicable</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
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
                  disabled={loading}
                  className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Save Item"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ElectronicItem Details Drawer */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={handleCloseDrawer} />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[72rem] bg-white shadow-xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">ElectronicItem Details</h2>
              <button onClick={handleCloseDrawer} className="text-gray-400 hover:text-gray-600 transition"><MdClose className="w-6 h-6" /></button>
            </div>

            <div className="p-6">
              {drawerLoading ? (
                <div className="flex justify-center items-center h-64"><Loading text="Loading details..." /></div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{selectedElectronicItem?.itemName}</h3>
                      <p className="text-gray-600 mt-1">
                        {selectedElectronicItem?.brand ? `${selectedElectronicItem.brand} • ` : ''}
                        {selectedElectronicItem?.modelName}
                        {selectedElectronicItem?.serialNo ? ` • SN: ${selectedElectronicItem.serialNo}` : ''}
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
                            setIsEditMode(false);
                            if (selectedElectronicItem) {
                              setEditForm({
                                usedBy: selectedElectronicItem.usedBy || '',
                                officePhoneNumber: selectedElectronicItem.officePhoneNumber || '',
                                employeeId: selectedElectronicItem.employeeId || '',
                                designation: selectedElectronicItem.designation || '',
                                itemType: selectedElectronicItem.itemType || '',
                                itemName: selectedElectronicItem.itemName || '',
                                brand: selectedElectronicItem.brand || '',
                                modelName: selectedElectronicItem.modelName || '',
                                serialNo: selectedElectronicItem.serialNo || '',
                                configuration: selectedElectronicItem.configuration || '',
                                purchaseDate: selectedElectronicItem.purchaseDate
                                  ? selectedElectronicItem.purchaseDate.split('T')[0]
                                  : '',
                                invoiceNo: selectedElectronicItem.invoiceNo || '',
                                issuedDate: selectedElectronicItem.issuedDate
                                  ? selectedElectronicItem.issuedDate.split('T')[0]
                                  : '',
                                returnedDate: selectedElectronicItem.returnedDate
                                  ? selectedElectronicItem.returnedDate.split('T')[0]
                                  : '',
                                estimatedValue: selectedElectronicItem.estimatedValue || 0,
                                color: selectedElectronicItem.color || '',
                                condition: selectedElectronicItem.condition || 'Good',
                                password: selectedElectronicItem.password || '',
                                error: selectedElectronicItem.error || '',
                                remarks: selectedElectronicItem.remarks || '',
                                branch: selectedElectronicItem.branch || '',
                                location: selectedElectronicItem.location || '',
                                accessories: selectedElectronicItem.accessories || {},
                              });
                            }
                          }}
                        >
                          <MdCancel className="w-4 h-4" /> Cancel
                        </button>

                        <button
                          className="flex items-center gap-2 text-sm bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
                          onClick={handleUpdateElectronicItem}
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
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2"><Truck className="w-4 h-4 text-gray-500" /> ElectronicItem Information</h4>

                      {isEditMode ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* usedBy */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Used By</label>
                              <input
                                name="usedBy"
                                value={(editForm as any).usedBy || ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* officePhoneNumber */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Office Phone Number</label>
                              <input
                                name="officePhoneNumber"
                                value={(editForm as any).officePhoneNumber || ""}
                                onChange={handleEditChange}
                                placeholder="+971500000000"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* employeeId */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                              <input
                                name="employeeId"
                                value={(editForm as any).employeeId || ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* designation */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                              <input
                                name="designation"
                                value={(editForm as any).designation || ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* itemType (required) */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                              <input
                                name="itemType"
                                value={(editForm as any).itemType || ""}
                                onChange={handleEditChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* itemName (required) */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                              <input
                                name="itemName"
                                value={(editForm as any).itemName || ""}
                                onChange={handleEditChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* brand */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                              <input
                                name="brand"
                                value={(editForm as any).brand || ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* modelName */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
                              <input
                                name="modelName"
                                value={(editForm as any).modelName || ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* serialNo */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Serial No</label>
                              <input
                                name="serialNo"
                                value={(editForm as any).serialNo || ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* configuration */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Configuration</label>
                              <input
                                name="configuration"
                                value={(editForm as any).configuration || ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* purchaseDate */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                              <input
                                type="date"
                                name="purchaseDate"
                                value={(editForm as any).purchaseDate ? formatDate((editForm as any).purchaseDate) : ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* invoiceNo */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
                              <input
                                name="invoiceNo"
                                value={(editForm as any).invoiceNo || ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* issuedDate */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Issued Date</label>
                              <input
                                type="date"
                                name="issuedDate"
                                value={(editForm as any).issuedDate ? formatDate((editForm as any).issuedDate) : ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* returnedDate */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Returned Date</label>
                              <input
                                type="date"
                                name="returnedDate"
                                value={(editForm as any).returnedDate ? formatDate((editForm as any).returnedDate) : ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* estimatedValue */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value</label>
                              <input
                                type="number"
                                name="estimatedValue"
                                min={0}
                                value={(editForm as any).estimatedValue ?? ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* color */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                              <input
                                name="color"
                                value={(editForm as any).color || ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* condition (select) */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                              <select
                                name="condition"
                                value={(editForm as any).condition || "Good"}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              >
                                <option value="Good">Good</option>
                                <option value="Average">Average</option>
                                <option value="Poor">Poor</option>
                                <option value="Damaged">Damaged</option>
                                <option value="Under Repair">Under Repair</option>
                              </select>
                            </div>

                            {/* password */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                              <input
                                name="password"
                                value={(editForm as any).password || ""}
                                onChange={handleEditChange}
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* error */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Error</label>
                              <input
                                name="error"
                                value={(editForm as any).error || ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* branch */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                              <input
                                name="branch"
                                value={(editForm as any).branch || ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* location */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                              <input
                                name="location"
                                value={(editForm as any).location || ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            {/* remarks (textarea) */}
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                              <textarea
                                name="remarks"
                                value={(editForm as any).remarks || ""}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                              />
                            </div>
                          </div>


                        </div>
                      ) : (
                        <dl className="space-y-3">
                          {/* Used By */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <User className="w-4 h-4" /> Used By
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.usedBy || '-'}</dd>
                          </div>

                          {/* Office Phone Number */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Phone className="w-4 h-4" /> Office Phone
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.officePhoneNumber || '-'}</dd>
                          </div>

                          {/* Employee ID */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Hash className="w-4 h-4" /> Employee ID
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.employeeId || '-'}</dd>
                          </div>

                          {/* Designation */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Briefcase className="w-4 h-4" /> Designation
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.designation || '-'}</dd>
                          </div>

                          {/* Item Type */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Tag className="w-4 h-4" /> Item Type
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.itemType || '-'}</dd>
                          </div>

                          {/* Item Name */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Cpu className="w-4 h-4" /> Item Name
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.itemName || '-'}</dd>
                          </div>

                          {/* Brand */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Package className="w-4 h-4" /> Brand
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.brand || '-'}</dd>
                          </div>

                          {/* Model Name */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Cpu className="w-4 h-4" /> Model Name
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.modelName || '-'}</dd>
                          </div>

                          {/* Serial No */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Hash className="w-4 h-4" /> Serial No
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.serialNo || '-'}</dd>
                          </div>

                          {/* Configuration */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Settings className="w-4 h-4" /> Configuration
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.configuration || '-'}</dd>
                          </div>

                          {/* Purchase Date */}
                          {/* <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Calendar className="w-4 h-4" /> Purchase Date
                            </dt>
                            <dd className="font-medium">
                              {selectedElectronicItem?.purchaseDate ? formatDate(selectedElectronicItem.purchaseDate) : '-'}
                            </dd>
                          </div> */}

                          {/* Invoice No */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <FileText className="w-4 h-4" /> Invoice No
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.invoiceNo || '-'}</dd>
                          </div>

                          {/* Issued Date */}
                          {/* <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <CalendarCheck className="w-4 h-4" /> Issued Date
                            </dt>
                            <dd className="font-medium">
                              {selectedElectronicItem?.issuedDate ? formatDate(selectedElectronicItem.issuedDate) : '-'}
                            </dd>
                          </div> */}

                          {/* Returned Date */}
                          {/* <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <RotateCcw className="w-4 h-4" /> Returned Date
                            </dt>
                            <dd className="font-medium">
                              {selectedElectronicItem?.returnedDate ? formatDate(selectedElectronicItem.returnedDate) : '-'}
                            </dd>
                          </div> */}

                          {/* Estimated Value */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <DollarSign className="w-4 h-4" /> Estimated Value
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.estimatedValue || '-'}</dd>
                          </div>

                          {/* Color */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Palette className="w-4 h-4" /> Color
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.color || '-'}</dd>
                          </div>

                          {/* Condition */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Wrench className="w-4 h-4" /> Condition
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.condition || '-'}</dd>
                          </div>

                          {/* Password */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Lock className="w-4 h-4" /> Password
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.password || '-'}</dd>
                          </div>

                          {/* Error */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" /> Error
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.error || '-'}</dd>
                          </div>

                          {/* Branch */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Building2 className="w-4 h-4" /> Branch
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.branch || '-'}</dd>
                          </div>

                          {/* Location */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <MapPin className="w-4 h-4" /> Location
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.location || '-'}</dd>
                          </div>

                          {/* Remarks */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <FileText className="w-4 h-4" /> Remarks
                            </dt>
                            <dd className="font-medium whitespace-pre-line">{selectedElectronicItem?.remarks || '-'}</dd>
                          </div>
                        </dl>

                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" /> Dates & Details
                      </h4>

                      {isEditMode ? (
                        <div className="space-y-4">
                          {['purchaseDate', 'issuedDate', 'returnedDate'].map(field => (
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
                            <input
                              name="invoiceNo"
                              value={editForm.invoiceNo}
                              onChange={handleEditChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value</label>
                            <input
                              type="number"
                              name="estimatedValue"
                              value={editForm.estimatedValue}
                              onChange={handleEditChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                            <textarea
                              name="remarks"
                              value={editForm.remarks}
                              onChange={handleEditChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                            />
                          </div>
                          {/* Accessories block */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Accessories</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {Object.entries(((editForm as any).accessories || {})).map(([key, acc]: any) => (
                                <>
                                  {console.log(key, acc.available)}
                                  <div key={key} className="border p-3 rounded-lg bg-gray-50">

                                    <label className="flex items-center gap-2 mb-2">
                                      <input
                                        type="checkbox"
                                        checked={!!acc?.available}
                                        onChange={(e) => handleAccessoryChange(key, "available", e.target.checked)}
                                      />
                                      <span className="capitalize">{key}</span>
                                    </label>

                                    <label className="block text-xs font-medium text-gray-600 mb-1">Condition</label>
                                    <select
                                      value={acc?.condition || "Not Applicable"}
                                      onChange={(e) => handleAccessoryChange(key, "condition", e.target.value)}
                                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    >
                                      <option value="Working">Working</option>
                                      <option value="Poor">Poor</option>
                                      <option value="Damaged">Damaged</option>
                                      <option value="Not Applicable">Not Applicable</option>
                                    </select>
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <Calendar className="w-4 h-4" /> Purchase Date
                            </dt>
                            <dd className="font-medium">{formatDate(selectedElectronicItem?.purchaseDate || null)}</dd>
                          </div>

                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <CalendarCheck className="w-4 h-4" /> Issued Date
                            </dt>
                            <dd className="font-medium">{formatDate(selectedElectronicItem?.issuedDate || null)}</dd>
                          </div>

                             {/* Returned Date */}
                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <RotateCcw className="w-4 h-4" /> Returned Date
                            </dt>
                            <dd className="font-medium">
                              {selectedElectronicItem?.returnedDate ? formatDate(selectedElectronicItem.returnedDate) : '-'}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <FileText className="w-4 h-4" /> Invoice No
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.invoiceNo || '-'}</dd>
                          </div>

                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <DollarSign className="w-4 h-4" /> Estimated Value
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.estimatedValue ? `₹${selectedElectronicItem.estimatedValue}` : '-'}</dd>
                          </div>

                          <div>
                            <dt className="text-sm text-gray-500 flex items-center gap-2">
                              <FileText className="w-4 h-4" /> Remarks
                            </dt>
                            <dd className="font-medium">{selectedElectronicItem?.remarks || '-'}</dd>
                          </div>
                          {/* Accessories Section */}
                          <div className="overflow-x-auto mt-4">
                            <div className="overflow-x-auto mt-4">
                              <table className="min-w-full border border-gray-300 rounded-lg">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="border px-4 py-2 text-left">Accessory Name</th>
                                    <th className="border px-4 py-2 text-center">Available</th>
                                    <th className="border px-4 py-2 text-center">Condition</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedElectronicItem?.accessories &&
                                    Object.entries(selectedElectronicItem.accessories).map(([key, acc]) => (
                                      <tr key={key} className="hover:bg-gray-50 transition-colors">
                                        <td className="border px-4 py-2 capitalize">{key}</td>
                                        <td className="border px-4 py-2 text-center">
                                          <span className={acc?.available ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                                            {acc?.available ? "Yes" : "No"}
                                          </span>
                                        </td>
                                        <td className="border px-4 py-2 text-center">{acc?.condition || "-"}</td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </dl>
                      )}
                    </div>

                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-700 flex items-center gap-2"><Tag className="w-4 h-4" /> Meta</h4>
                      <div className="text-sm text-gray-500">Created: {selectedElectronicItem?.createdAt ? new Date(selectedElectronicItem.createdAt).toLocaleString() : '-'}</div>
                    </div>

                    <div className="mt-4">
                      <button onClick={() => selectedElectronicItem && handleDeleteElectronicItem(selectedElectronicItem._id)} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Delete ElectronicItem</button>
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

export default ElectronicItem
