import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, AlertCircle } from 'lucide-react';
import { leaveTypes, getEmployeeLeaveBalance } from '../../data/leaveData';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import toast from 'react-hot-toast';

const ApplyLeave: React.FC = () => {
  // const leaveBalance = user ? getEmployeeLeaveBalance(user.id) : null;
  const [leaveBalance, setLeaveBalance] = useState<any>(0);

  useEffect(() => {
    const Alluseleaves = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/leaves/my_leaves`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
          }
        });
        // console.log(response.data.count)
        if (response.status === 200) {
          setLeaveBalance(response.data.leaveBalance);
        }
      } catch (error) {
        console.error('Error fetching leave balance:', error);
        // toast.error('Failed to   fetch leave balance. Please try again later.');
      }
    }

    Alluseleaves();
  },[])
 
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
    // attachment: null as File | null
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.leaveType) {
      newErrors.leaveType = 'Please select a leave type';
    }
    if (!formData.fromDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.toDate) {
      newErrors.endDate = 'End date is required';
    }
    if (!formData.reason) {
      newErrors.reason = 'Please provide a reason for leave';
    }

    // Check if end date is after start date
    if (formData.fromDate && formData.toDate) {
      const start = new Date(formData.fromDate);
      const end = new Date(formData.toDate);
      if (end < start) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData)
    if (validateForm()) {
      try {
        const response = await axios.post(`${BASE_URL}/api/leaves/apply_leave`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
          }
        })
        if (response.status === 201) {
          // Reset form on successful submission
          setFormData({
            leaveType: '',
            fromDate: '',
            toDate: '',
            reason: '',
            // attachment: null
          });
          setErrors({});
          toast.success('Leave request submitted successfully!');
        }
      } catch (error) {
        console.error('Error submitting leave request:', error);
        toast.error('Failed to submit leave request. Please try again.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Apply for Leave"
        description="Submit a new leave request"
        breadcrumbs={[
          { name: 'Leave Management', href: '/leave' },
          { name: 'Apply Leave' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Application Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-neutral-200">
            <div className="p-6">
              <div className="space-y-6">
                <div className="form-group">
                  <label htmlFor="leaveType" className="form-label">Leave Type *</label>
                  <select
                    id="leaveType"
                    name="leaveType"
                    className={`form-select ${errors.leaveType ? 'border-red-300' : ''}`}
                    value={formData.leaveType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  {errors.leaveType && (
                    <p className="mt-1 text-sm text-red-600">{errors.leaveType}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="startDate" className="form-label">Start Date *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={16} className="text-neutral-400" />
                      </div>
                      <input
                        type="date"
                        id="fromDate"
                        name="fromDate"
                        className={`form-input pl-10 ${errors.startDate ? 'border-red-300' : ''}`}
                        value={formData.fromDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate" className="form-label">End Date *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={16} className="text-neutral-400" />
                      </div>
                      <input
                        type="date"
                        id="toDate"
                        name="toDate"
                        className={`form-input pl-10 ${errors.endDate ? 'border-red-300' : ''}`}
                        value={formData.toDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reason" className="form-label">Reason for Leave *</label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={4}
                    className={`form-input ${errors.reason ? 'border-red-300' : ''}`}
                    placeholder="Please provide a detailed reason for your leave request..."
                    value={formData.reason}
                    onChange={handleInputChange}
                  />
                  {errors.reason && (
                    <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="attachment" className="form-label">
                    Attachment
                    <span className="text-sm text-neutral-500 font-normal ml-2">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    id="attachment"
                    name="attachment"
                    className="form-input"
                    onChange={handleFileChange}
                  />
                  <p className="mt-1 text-sm text-neutral-500">
                    Upload any supporting documents (PDF, DOC, JPG - max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end space-x-3">
              <Link to="/leave" className="btn btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary">
                Submit Request
              </button>
            </div>
          </form>
        </div>

        {/* Leave Balance Card */}
        <div className="space-y-6">
  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
    <h3 className="text-lg font-semibold mb-4">Leave Balance</h3>

    <div className="space-y-4">
      {/* Sick Leave */}
       <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm text-neutral-600">Sick Leave</span>
          <span className="text-sm font-medium">4 / 5</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full"
            style={{ width: `${(4 / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Casual Leave */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm text-neutral-600">Casual Leave</span>
          <span className="text-sm font-medium">5 / 5</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className="bg-warning-500 h-2 rounded-full"
            style={{ width: `${(5 / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Annual Leave */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm text-neutral-600">Annual Leave</span>
          <span className="text-sm font-medium">2 / 4</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className="bg-accent-500 h-2 rounded-full"
            style={{ width: `${(2 / 4) * 100}%` }}
          />
        </div>
      </div> 
      <div className="bg-white p-4 rounded-lg shadow-md border mb-4">
  <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">Total Leave Balance</h2>
  <p className="text-3xl font-bold text-blue-600 text-center">{leaveBalance}</p> 
</div>

    </div>
  </div>

  {/* Leave Policy Section */}
  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
    <h3 className="text-lg font-semibold mb-4">Leave Policy</h3>
    <div className="space-y-4 text-sm text-neutral-600">
      <div>
        <h4 className="font-medium text-neutral-800 mb-1">Application Timeline</h4>
        <p>Leave requests should be submitted at least 3 working days in advance.</p>
      </div>
      <div>
        <h4 className="font-medium text-neutral-800 mb-1">Documentation</h4>
        <p>Medical certificates are required for sick leave exceeding 2 days.</p>
      </div>
      <div>
        <h4 className="font-medium text-neutral-800 mb-1">Cancellation</h4>
        <p>Leave can be cancelled up to 24 hours before the start date.</p>
      </div>
      <div>
        <h4 className="font-medium text-neutral-800 mb-1">Half Day Leave</h4>
        <p>Half day leaves can be taken either in the first or second half of the working day.</p>
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default ApplyLeave;







