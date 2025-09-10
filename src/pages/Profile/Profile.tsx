import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Edit, Mail, Phone, MapPin, Briefcase, Calendar, Clock, UserCheck, FileText,
  DollarSign, Clipboard, ChevronDown, Download, Camera, Save, X,
  Edit2, Image, Edit3Icon, Award, Star, TrendingUp, FileDigit, 
  Shield, Building, CreditCard, Heart, BookOpen, GraduationCap,
  Languages, Globe, Github, Linkedin, Twitter, Facebook, Instagram
} from 'lucide-react';

import axios from '../../constants/axiosInstance';
import { BASE_URL } from '../../constants/api';
import Loading from '../../components/Loading';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import toast from 'react-hot-toast';

const EmployeeDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [employee, setEmployees] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const id = user?._id;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [department, setDepartment] = useState('');
  const [imageUrlPic, setImageUrlPic] = useState(null);
  const [status, setStatus] = useState<any>(null);
  const [leaveBalance, setLeaveBalance] = useState<any>(0);
  const [skills, setSkills] = useState(['JavaScript', 'React', 'Node.js', 'UI/UX Design']);
  const [performanceData, setPerformanceData] = useState({
    rating: 4.5,
    completedProjects: 12,
    efficiency: 92,
    teamCollaboration: 4.8
  });

  const [address, setAddress] = useState({
    address_line: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    village: '',
  });

  const getProfilePic = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/upload/uploadByUserId/${user?._id}`);
      const data = response.data;
      if (data.success && Array.isArray(data.uploads)) {
        const profilePics = data.uploads.filter(upload => upload.title === "profile");
        const sorted = profilePics.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        const latestProfilePic = sorted[0];
        setImageUrlPic(latestProfilePic);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfilePic();
  }, []);

  useEffect(() => {
    if (employee?.address) {
      setAddress({
        address_line: employee.address.address_line || '',
        city: employee.address.city || '',
        state: employee.address.state || '',
        pincode: employee.address.pincode || '',
        country: employee.address.country || '',
        village: employee.address.village || '',
      });
    }

    if (employee?.department) {
      setDepartment(employee.department);
    }
  }, [employee]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('tokenId');
      const response = await axios.get(`${BASE_URL}/api/employee/${id}`);
      setEmployees(response.data.data);
    } catch (error) {
      console.log('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const [editDressloading, setEditAddressLoading] = useState(false);
  const handleSave = async () => {
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error('Pincode must be exactly 6 digits');
      return;
    }

    try {
      setEditAddressLoading(true);
      await axios.patch(`${BASE_URL}/api/employee/update_profile_by_self`, {
        address
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokenId')}`
        }
      });
      setIsModalOpen(false);
      fetchEmployees();
      toast.success('Address updated successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update address');
    } finally {
      setEditAddressLoading(false);
    }
  };

  const [departmentLoading, setDepartmentLoading] = useState(false);
  const handleDepartmentSave = async () => {
    if (!department.trim()) {
      toast.error('Department cannot be empty');
      return;
    }

    try {
      setDepartmentLoading(true);
      await axios.patch(`${BASE_URL}/api/employee/update_profile_by_self`, {
        department
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokenId')}`
        }
      });
      setIsDepartmentModalOpen(false);
      fetchEmployees();
      toast.success('Department updated successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setDepartmentLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/attendance/single_user_today_attendance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
          }
        });
        setStatus(res.data.attendance);
      } catch (error) {
        console.error('Failed to fetch status', error);
      }
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    const Alluseleaves = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/leaves/my_leaves`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
          }
        });
        if (response.status === 200) {
          setLeaveBalance(response.data.leaveBalance);
        }
      } catch (error) {
        console.error('Error fetching leave balance:', error);
      }
    };
    Alluseleaves();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Employee Not Found</h2>
          <p className="text-gray-600 mb-6">The employee you are looking for does not exist or has been removed.</p>
          <Link to="/employees" className="btn btn-primary">
            Back to Employees
          </Link>
        </div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUrl(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setEdit(true);
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("files", imageUrl);
    formData.append("title", "profile");

    try {
      if (imageUrlPic) {
        await axios.put(`${BASE_URL}/api/update_upload/${imageUrlPic?._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post(`${BASE_URL}/api/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      toast.success("Profile picture updated successfully!");
      getProfilePic();
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setEdit(false);
      setPreviewUrl("");
    }
  };

  const renderPerformanceMetric = (label: string, value: any, max: number = 5, icon: any = Star) => {
    const percentage = (value / max) * 100;
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              {React.createElement(icon, { className: "w-4 h-4 text-blue-600" })}
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
          <span className="text-lg font-bold text-gray-800">{value}{max === 5 ? '/5' : '%'}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 overflow-hidden">
                    {employee.uploads ? (
                      <img 
                        src={previewUrl || imageUrlPic?.files[0]?.url || 'https://contacts.zoho.in/file?ID=60028830319&fs=thumb'} 
                        alt={`${employee?.first_name} ${employee?.last_name}`} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-2xl font-bold">
                        {employee?.first_name ? employee.first_name[0] : ''}
                      </div>
                    )}
                  </div>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold">{employee?.first_name || employee?.name} {employee?.last_name}</h1>
                  <p className="text-blue-100 text-lg">{employee?.designation}</p>
                  <div className="flex items-center mt-2">
                    <Building className="w-4 h-4 mr-2" />
                    <span>{employee?.department}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                {edit && (
                  <button
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center"
                    onClick={handleImageUpload}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Photo
                  </button>
                )}
                {user?.role !== "employee" && (
                  <Link 
                    to={`/employees/edit/${employee?._id}`} 
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center border border-white/30"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center">
                    <UserCheck className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Attendance</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    status?.status === 'present' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {status ? status.status : "Absent"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Experience</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">
                    {Math.floor((new Date().getTime() - new Date(employee.joining_date).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-amber-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Leave Balance</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{leaveBalance} days</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Performance</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">4.5/5</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm">{employee?.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm">{employee?.phone || "9876543210"}</span>
                </div>
                {employee?.address_line && (
                  <div className="flex items-start text-gray-600">
                    <MapPin className="w-4 h-4 mr-3 text-gray-400 mt-1" />
                    <span className="text-sm">
                      {employee?.address}, {employee?.city}, {employee?.state}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <nav className="flex space-x-6 overflow-x-auto">
                {['overview', 'performance', 'documents', 'activity'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-gray-800">{employee?.first_name || employee?.name} {employee?.last_name}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Employee ID</label>
                        <p className="text-gray-800">{employee?.userId}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-800">{employee?.email}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-800">{employee?.phone || "9876543210"}</p>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-500">Address</label>
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                        </div>
                        <p className="text-gray-800">
                          {employee?.address?.address_line}, {employee?.address?.city}, {employee?.address?.state} {employee?.address?.pincode}, {employee?.address?.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Employment Information */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Employment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Department</label>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-800">{employee?.department}</p>
                          <button
                            onClick={() => setIsDepartmentModalOpen(true)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Designation</label>
                        <p className="text-gray-800">{employee?.designation}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Employment Type</label>
                        <p className="text-gray-800">{employee?.role}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Joining Date</label>
                        <p className="text-gray-800">{new Date(employee?.joining_date).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          employee.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : employee.status === 'on-leave'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.status === 'active' ? 'Active' :
                           employee.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderPerformanceMetric('Overall Rating', 4.5, 5, Star)}
                    {renderPerformanceMetric('Project Completion', 12, 15, TrendingUp)}
                    {renderPerformanceMetric('Work Efficiency', 92, 100, TrendingUp)}
                    {renderPerformanceMetric('Team Collaboration', 4.8, 5, UserCheck)}
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Recent Achievements</h4>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-green-50 rounded-xl">
                        <Award className="w-5 h-5 text-green-600 mr-3" />
                        <span className="text-sm text-gray-700">Employee of the Month - June 2023</span>
                      </div>
                      <div className="flex items-center p-3 bg-blue-50 rounded-xl">
                        <Star className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-sm text-gray-700">Exceeded Q2 Targets by 25%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Edit Address</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'address_line', label: 'Address Line', placeholder: 'Enter address line' },
                { name: 'village', label: 'Village', placeholder: 'Enter village' },
                { name: 'city', label: 'City', placeholder: 'Enter city' },
                { name: 'state', label: 'State', placeholder: 'Enter state' },
                { name: 'pincode', label: 'Pincode', placeholder: 'Enter 6-digit pincode' },
                { name: 'country', label: 'Country', placeholder: 'Enter country' },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    name={name}
                    value={address[name] || ''}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={editDressloading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {editDressloading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDepartmentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Edit Department</h2>
              <button onClick={() => setIsDepartmentModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Enter department"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsDepartmentModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDepartmentSave}
                disabled={departmentLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {departmentLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;