import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { leaveTypes } from '../../data/leaveData';
import PageHeader from '../../components/common/PageHeader';
import axios from '../../constants/axiosInstance';
import { BASE_URL } from '../../constants/api';
import toast from 'react-hot-toast';

const ApplyLeave: React.FC = () => {
  const [leaveBalance, setLeaveBalance] = useState<number>(0);
  const [leaveCount, setLeaveCount] = useState<any>({});
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  const fetchLeaveData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/leaves/my_leaves`, );

      const leaves = response.data.data || [];
      // console.log(leaves)

      // Count leaves by type
      const totalLeaveCount = leaves.reduce((acc: any, leave: any) => {
        let leaveType = leave.leaveType;
        acc[leaveType] = (acc[leaveType] || 0) + 1;
        return acc;
      }, {});
      // console.log(totalLeaveCount)
      setLeaveCount(totalLeaveCount);

      // Calculate leave balance
      // if (leaves.length > 0) {
      //   const approvedLeaves = leaves.filter((l: any) => l.status === 'approved');
      //   const maxLeave = leaves[0]?.maximumLeave || 0;
      //   const remainingBalance = Math.max(0, maxLeave - approvedLeaves.length);
      //   setLeaveBalance(remainingBalance);
      // }
      console.log(response.data.leaveBalance);
      setLeaveBalance(response.data.leaveBalance || 0);
    } catch (error) {
      console.error('Error fetching leave balance:', error);
      toast.error('Failed to fetch leave balance. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.leaveType) newErrors.leaveType = 'Please select a leave type';
    if (!formData.fromDate) newErrors.startDate = 'Start date is required';
    if (!formData.toDate) newErrors.endDate = 'End date is required';
    if (!formData.reason) newErrors.reason = 'Please provide a reason for leave';

    if (formData.fromDate && formData.toDate) {
      const start = new Date(formData.fromDate);
      const end = new Date(formData.toDate);
      if (end < start) newErrors.endDate = 'End date cannot be before start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (leaveBalance <= 0) {
      toast.error('You have no leave balance left. Please contact HR.');
      return;
    }

    if (validateForm()) {
      try {
        const response = await axios.post(`${BASE_URL}/api/leaves/apply_leave`, formData, );

        if (response.status === 201) {
          setFormData({
            leaveType: '',
            fromDate: '',
            toDate: '',
            reason: '',
          });
          setErrors({});
          toast.success('Leave request submitted successfully!');
          fetchLeaveData();
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
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Apply for Leave"
        description="Submit a new leave request"
        breadcrumbs={[{ name: 'Apply Leave' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-neutral-200">
            <div className="p-6 space-y-6">
              {!loading && leaveBalance <= 0 && (
                <div className="text-red-600 font-medium bg-red-50 p-3 rounded border border-red-200">
                  You currently have no leave balance available. You cannot submit a leave request.
                </div>
              )}

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
                  <label htmlFor="fromDate" className="form-label">Start Date *</label>
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
                  <label htmlFor="toDate" className="form-label">End Date *</label>
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
            </div>

            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end space-x-3">
              <Link to="/leave" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className={`btn btn-primary ${leaveBalance <= 0 ? ' opacity-50 cursor-not-allowed' : ''}`}
                disabled={leaveBalance == 0}
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">Leave Report</h3>
            </div>

            <div className="grid gap-4 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Sick Leave Taken</span>
                <span className="font-semibold text-gray-900">{leaveCount?.sick ?? 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Casual Leave </span>
                <span className="font-semibold text-gray-900">
                  {leaveCount?.casual ?? 0} / 14
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Unpaid Leave Taken</span>
                <span className="font-semibold text-gray-900">{leaveCount?.unpaid ?? 0}</span>
              </div>

              {/* <div className="flex items-center justify-between">
                <span className="text-gray-600">Vacation Leave Taken</span>
                <span className="font-semibold text-gray-900">{leaveCount?.vacation ?? 0}</span>
              </div> */}
            </div>
          </div>

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
