// import React, { useState } from 'react'
// import { useSelector } from 'react-redux';
// import { RootState } from '../../store/store';
// import toast from 'react-hot-toast';
// import axios from 'axios';
// import { BASE_URL } from '../../constants/api';

// const Profile: React.FC = () => {
//   const { user } = useSelector((state: RootState) => state.auth);

//   const [loading, setLoading] = useState(false);
//   const [title, setTitle] = useState("");
//   const capitalize = (str: string = "") =>
//     str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


//   const handleFilechange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const fileArray = Array.from(e.target.files);
//       setSelectedFiles((prev) => [...prev, ...fileArray])
//     }
//   }

//   const handleDelete = (indexs: number) => {
//     setSelectedFiles((prev) => prev.filter((_, index) => index !== indexs))
//   }

//   const tabs = [
//     "Personal",
//     "Job",
//     "Documents",
//     "Time off",
//     "Performance",
//     "Time",
//     "Tasks",
//     "More",
//   ];
//   const [activeTab, setActiveTab] = useState("Personal");

//   const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     if (selectedFiles.length === 0) {
//       toast.error('No file selected');
//       setLoading(false);
//       return;
//     }

//     const token = localStorage.getItem("tokenId");
//     if (!title.trim()) {
//       toast.error('Please enter a document name');
//       setLoading(false);
//       return;
//     }
//     try {
//       let userId = user?._id!;
//       const formData = new FormData();
//       selectedFiles.forEach((file) => {
//         formData.append('files', file);
//       });



//       formData.append('userId', userId);
//       formData.append('title', title);

//       const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log(response.data);
//       toast.success('Files uploaded successfully!');
//       setSelectedFiles([]);
//       setTitle("")
//     } catch (error) {
//       console.error(error);
//       toast.error('Upload failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };



//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "Personal":
//         return (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg font-bold text-gray-700">
//             <div><span className="font-medium">First Name:</span> {capitalize(user?.first_name)}</div>
//             <div><span className="font-medium">Last Name:</span> {capitalize(user?.last_name)}</div>
//             <div><span className="font-medium">Email:</span> {user?.email}</div>
//             <div>
//               <span className="font-medium">Status:</span>{' '}
//               <span
//                 className={`inline-block px-2 py-0.5 rounded text-white text-sm font-semibold ${user?.status === 'active' ? 'bg-green-500' : 'bg-red-500'
//                   }`}
//               >
//                 {capitalize(user?.status)}
//               </span>
//             </div>
//             <div><span className="font-medium">Role:</span> {capitalize(user?.role)}</div>
//             <div><span className="font-medium">Joining Date:</span> {formatDate(user?.joining_date)}</div>
//             <div className="md:col-span-2">

//               <p className="">
//                 <span className="font-medium">Address : </span>
//                 {user?.address?.address_line}, {user?.address?.village}, {user?.address?.city}, {user?.address?.state}, {user?.address?.country}
//               </p>
//             </div>
//           </div>
//         );
//       case "Job":
//         return (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg font-bold text-gray-700">
//             <div><span className="font-medium">Department:</span> {user?.department}</div>
//             <div><span className="font-medium">Designation:</span> {user?.designation}</div>
//             <div><span className="font-medium">Salary:</span> ₹{user?.salary}</div>
//           </div>
//         );


//       case "Documents":
//         return (
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-semibold">Upload Document</h3>
//               <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
//                 <div>
//                   <label className="cursor-pointer bg-blue-600 text-white w-max px-4 py-2 rounded hover:bg-blue-700 transition">
//                     Select File
//                     <input
//                       type="file"
//                       className="hidden"
//                       onChange={handleFilechange}
//                     />
//                   </label>

//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Document Name</label>
//                   <input
//                     type="text"
//                     placeholder="e.g. Resume, Offer Letter"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={loading || !title.trim()}
//                   className={`px-4 py-2 rounded-md text-white ${loading || !title.trim() ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
//                 >
//                   {loading ? "Uploading..." : "Upload"}
//                 </button>


//                 {selectedFiles.length > 0 && (
//                   <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//                     <h4 className="text-lg font-semibold mb-3 text-gray-800">Selected Documents</h4>
//                     <ul className="space-y-3">
//                       {selectedFiles.map((file, index) => (
//                         <li
//                           key={index}
//                           className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-4 py-2 hover:shadow-sm transition"
//                         >
//                           <div className="text-gray-700 text-sm">
//                             📄 <span className="font-medium">{file.name}</span> – {(file.size / 1024).toFixed(2)} KB
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => handleDelete(index)}
//                             className="text-red-500 hover:text-red-600 text-sm font-semibold"
//                           >
//                             Remove
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//               </form>
//             </div>

//             {/* Uploaded documents list */}
//             {/* <div>
//       <h3 className="text-lg font-semibold mb-2">Uploaded Documents</h3>
//       <ul className="space-y-2">
//         {[
//           { name: 'Resume.pdf', uploadedAt: '2025-05-01' },
//           { name: 'Offer_Letter.pdf', uploadedAt: '2025-05-03' },
//         ].map((doc, index) => (
//           <li
//             key={index}
//             className="flex items-center justify-between p-3 bg-gray-50 rounded border"
//           >
//             <div>
//               <p className="font-medium">{doc.name}</p>
//               <p className="text-sm text-gray-500">Uploaded on {doc.uploadedAt}</p>
//             </div>
//             <button className="text-blue-600 hover:underline">Download</button>
//           </li>
//         ))}
//       </ul>
//     </div> */}
//           </div>
//         )
//       default:
//         return (
//           <p className="text-gray-600 mt-2">This is the content for the "{activeTab}" tab.</p>
//         );
//     }
//   };

//   return (
//     <div className="max-w-full mx-auto bg-white rounded-md shadow-md overflow-hidden">
//       {/* Cover Image */}
//       <div className='h-60 relative bg-gray-200'>
//         <img
//           src="https://img.freepik.com/free-vector/paper-style-dynamic-lines-background_23-2149008629.jpg?semt=ais_hybrid&w=740"
//           alt="Cover"
//           className="w-full h-full object-cover"
//         />
//         {/* Profile Picture */}
//         <div className='absolute -bottom-20 left-6'>
//           <img
//             src="https://img.freepik.com/premium-vector/man-professional-business-casual-young-avatar-icon-illustration_1277826-623.jpg?ga=GA1.1.1218145876.1747648595&semt=ais_hybrid&w=740"
//             alt="Profile"
//             className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
//           />
//         </div>
//       </div>

//       {/* Name and Role */}
//       <div className="mt-20 px-6 pb-4">
//         <h1 className="text-2xl font-semibold">
//           {capitalize(user?.first_name) + " " + capitalize(user?.last_name)}
//         </h1>
//         <p className="text-gray-600">{user?.designation}</p>
//       </div>

//       {/* Tabs */}
//       <div className="flex space-x-4 px-6 py-3 border-b overflow-x-auto scrollbar-hide">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-3 py-1 text-sm font-medium rounded ${activeTab === tab
//               ? "bg-gray-200 text-black"
//               : "text-gray-500 hover:text-black"
//               }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Tab Content */}
//       <div className="p-6">{renderTabContent()}</div>
//     </div>
//   );
// };

// export default Profile;




import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Edit, Mail, Phone, MapPin, Briefcase, Calendar, Clock, UserCheck, FileText,
  DollarSign, Clipboard, ChevronDown, Download
} from 'lucide-react';

import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import Loading from '../../components/Loading';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const EmployeeDetail: React.FC = () => {
  // const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('info');
  const [employee, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const{user}=useSelector((state:RootState)=>state.auth)
const id=user?._id;
  useEffect(() => {
    // console.log(user?._id,"user")
    
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('tokenId');
        const response = await axios.get(`${BASE_URL}/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API response:', response.data.data);

        setEmployees(response.data.data);
      } catch (error) {
        console.log('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const [status,setStatus] = useState<any>("null");
  useEffect(() => {
    const fetchStatus = async () => {
      console.log("starrt")
      try {
        const res = await axios.get(`${BASE_URL}/api/attendance/single_user_today_attendance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
          }
        });

        setStatus(res.data.attendance)
    
      } catch (error) {
        console.error('Failed to fetch status', error);
      }
    };
    fetchStatus();
  }, []);


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
          setLeaveBalance(response.data.count);
        }
      } catch (error) {
        console.error('Error fetching leave balance:', error);
        // toast.error('Failed to   fetch leave balance. Please try again later.');
      }
    }

    Alluseleaves();
  },[])

  if (isLoading) {
    return (
      <Loading />
    );
  }



  if (!employee) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border border-neutral-200 text-center">
        <h2 className="text-xl font-semibold mb-2">Employee Not Found</h2>
        <p className="text-neutral-600 mb-4">The employee you are looking for does not exist or has been removed.</p>
        <Link to="/employees" className="btn btn-primary">
          Back to Employees
        </Link>
      </div>
    );
  }

  // Get employee data
  // const attendance = getEmployeeAttendance(employee._id);
  // const leaveRequests = getEmployeeLeaveRequests(employee._id);
  // const leaveBalance = getEmployeeLeaveBalance(employee._id);
  // const payrolls = getEmployeePayrolls(employee._id);
  // const performanceReviews = getEmployeePerformanceReviews(employee._id);
  // const averageRating = getEmployeeAverageRating(employee._id);

  // Calculate statistics
  // const attendanceThisMonth = attendance.filter(record => {
  //   const recordDate = new Date(record.date);
  //   const today = new Date();
  //   return recordDate.getMonth() === today.getMonth() && recordDate.getFullYear() === today.getFullYear();
  // });

  // const presentDays = attendanceThisMonth.filter(record => record.status === 'present').length;
  // const totalWorkdays = attendanceThisMonth.filter(record => 
  //   record.status !== 'weekend' && record.status !== 'holiday'
  // ).length;

  // const attendanceRate = totalWorkdays > 0 ? Math.round((presentDays / totalWorkdays) * 100) : 0;

  return (
    <div className="animate-fade-in">
      {/* employees Header */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 mb-6 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4 bg-primary-50 p-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-md mb-4">
              {employee.avatar ? (
                <img src={employee.avatar} alt={`${employee.first_name} ${employee.last_name}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-3xl font-bold">
                  {employee.role==="admin" ? employee.first_name[0]: employee.first_name[0]}
                </div>
              )}
            </div>
            <h1 className="text-xl font-bold text-neutral-800 text-center">{employee.first_name || employee.name} {employee.last_name}</h1>
            <p className="text-neutral-600 mt-1 text-center">{employee.designation}</p>
            <div className="mt-3">
              <span className={`badge ${employee.status === 'active' ? 'badge-success' :
                employee.status === 'on-leave' ? 'badge-warning' : 'badge-danger'
                }`}>
                {employee.status === 'active' ? 'Active' :
                  employee.status === 'on-leave' ? 'On Leave' : 'Inactive'}
              </span>
            </div>
            <div className="mt-6 w-full space-y-3">
              <div className="flex items-center text-sm text-neutral-600">
                <Mail size={16} className="mr-2 text-neutral-400" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center text-sm text-neutral-600">
                <Phone size={16} className="mr-2 text-neutral-400" />
                <span>{employee?.phone || "9876543210"}</span>
              </div>
              {employee.address_line && (
                <div className="flex items-center text-sm text-neutral-600">
                  <MapPin size={16} className="mr-2 text-neutral-400" />
                  <span className="truncate">{employee.address}, {employee.city}, {employee.state}</span>
                </div>
              )}
              <div className="flex items-center text-sm text-neutral-600">
                <Briefcase size={16} className="mr-2 text-neutral-400" />
                <span>{employee.department} - {employee.employeeType}</span>
              </div>
              <div className="flex items-center text-sm text-neutral-600">
                <Calendar size={16} className="mr-2 text-neutral-400" />
                <span>Joined {new Date(employee.joiningDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-8 w-full">
              <Link to={`/employees/edit/${employee._id}`} className="btn btn-primary w-full flex items-center justify-center">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="md:w-2/3 lg:w-3/4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-neutral-800">Employee Information</h2>
              <div className="flex space-x-2">
                <button className="btn btn-secondary flex items-center">
                  <FileText size={16} className="mr-1" />
                  Reports
                </button>
                <button className="btn btn-secondary flex items-center">
                  <Download size={16} className="mr-1" />
                  Export
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Attendance</p>
                    {/* <p className="text-lg font-semibold">{attendanceRate}%</p> */}
                    {status ? status.status:"Absent"}
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Experience</p>
                    <p className="text-lg font-semibold">
                      {Math.floor((new Date().getTime() - new Date(employee.joining_date).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Leave Balance</p>
                    <p className="text-lg font-semibold">
                      {/* {leaveBalance ? leaveBalance.sick.available + leaveBalance.casual.available + leaveBalance.annual.available : 0} days */}
                      {leaveBalance}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <Clipboard size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Performance</p>
                    {/* <p className="text-lg font-semibold">{averageRating.toFixed(1)}/5.0</p> */}
                    Good
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-neutral-200 mb-6">
              <nav className="flex space-x-6">
                <button
                  className={`pb-3 text-sm font-medium border-b-2 ${activeTab === 'info'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                    }`}
                  onClick={() => setActiveTab('info')}
                >
                  Personal Info
                </button>
                <button
                  className={`pb-3 text-sm font-medium border-b-2 ${activeTab === 'attendance'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                    }`}
                  onClick={() => setActiveTab('attendance')}
                >
                  Attendance
                </button>
                <button
                  className={`pb-3 text-sm font-medium border-b-2 ${activeTab === 'leave'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                    }`}
                  onClick={() => setActiveTab('leave')}
                >
                  Leave
                </button>
                <button
                  className={`pb-3 text-sm font-medium border-b-2 ${activeTab === 'payroll'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                    }`}
                  onClick={() => setActiveTab('payroll')}
                >
                  Payroll
                </button>
                <button
                  className={`pb-3 text-sm font-medium border-b-2 ${activeTab === 'performance'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                    }`}
                  onClick={() => setActiveTab('performance')}
                >
                  Performance
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-neutral-800 mb-3">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-500">Full Name</p>
                        <p className="text-sm font-medium">{employee?.first_name || employee?.name} {employee?.last_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Email</p>
                        <p className="text-sm font-medium">{employee?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Phone</p>
                        <p className="text-sm font-medium">{employee?.phone || "9876543210"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Address</p>
                        <p className="text-sm font-medium">
                          {employee?.address?.address_line}, {employee?.address?.city}, {employee?.address?.state} {employee?.address?.pincode}, {employee?.address?.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-base font-medium text-neutral-800 mb-3">Employment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-500">Employee ID</p>
                        <p className="text-sm font-medium">{employee?.userId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Department</p>
                        <p className="text-sm font-medium">{employee?.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Designation</p>
                        <p className="text-sm font-medium">{employee?.designation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Employment Type</p>
                        <p className="text-sm font-medium">{employee?.employeeType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Joining Date</p>
                        <p className="text-sm font-medium">{new Date(employee?.joining_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Status</p>
                        <p className="text-sm font-medium">
                          <span className={`badge ${employee.status === 'active' ? 'badge-success' :
                            employee.status === 'on-leave' ? 'badge-warning' : 'badge-danger'
                            }`}>
                            {employee.status === 'active' ? 'Active' :
                              employee.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* {employee.emergencyContact && (
                    <div className="border-t border-neutral-200 pt-6">
                      <h3 className="text-base font-medium text-neutral-800 mb-3">Emergency Contact</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-neutral-500">Name</p>
                          <p className="text-sm font-medium">{employee.emergencyContact.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Relationship</p>
                          <p className="text-sm font-medium">{employee.emergencyContact.relationship}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Phone</p>
                          <p className="text-sm font-medium">{employee.emergencyContact.phone}</p>
                        </div>
                      </div>
                    </div>
                  )} */}

                  {/* {employee.bankDetails && (
                    <div className="border-t border-neutral-200 pt-6">
                      <h3 className="text-base font-medium text-neutral-800 mb-3">Bank Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-neutral-500">Account Name</p>
                          <p className="text-sm font-medium">{employee.bankDetails.accountName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Account Number</p>
                          <p className="text-sm font-medium">{employee.bankDetails.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Bank Name</p>
                          <p className="text-sm font-medium">{employee.bankDetails.bankName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">IFSC Code</p>
                          <p className="text-sm font-medium">{employee.bankDetails.ifscCode}</p>
                        </div>
                      </div>
                    </div>
                  )} */}

                  {employee.documents && employee.documents.length > 0 && (
                    <div className="border-t border-neutral-200 pt-6">
                      <h3 className="text-base font-medium text-neutral-800 mb-3">Documents</h3>
                      <div className="space-y-3">
                        {employee.documents.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-md">
                            <div className="flex items-center">
                              <FileText size={20} className="text-neutral-500 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-neutral-700">{doc.name}</p>
                                <p className="text-xs text-neutral-500">Uploaded on {new Date(doc.uploadedOn).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* {activeTab === 'attendance' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium text-neutral-800">Attendance Records</h3>
                    <Link to="/attendance" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Full Calendar
                    </Link>
                  </div>

                  <div className="bg-neutral-50 rounded-md p-4 mb-6 flex flex-wrap gap-4">
                    <div>
                      <span className="text-sm text-neutral-500 block">Attendance Rate (This Month)</span>
                      <span className="text-lg font-semibold">{attendanceRate}%</span>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500 block">Present Days</span>
                      <span className="text-lg font-semibold">{presentDays} / {totalWorkdays}</span>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500 block">Avg. Check-in Time</span>
                      <span className="text-lg font-semibold">9:05 AM</span>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500 block">Avg. Check-out Time</span>
                      <span className="text-lg font-semibold">5:45 PM</span>
                    </div>
                  </div>

                  <div className="table-container mb-4">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Check-in</th>
                          <th>Check-out</th>
                          <th>Working Hours</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.slice(0, 10).map(record => (
                          <tr key={record.id}>
                            <td>{new Date(record.date).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge ${record.status === 'present' ? 'badge-success' :
                                record.status === 'absent' ? 'badge-danger' :
                                  record.status === 'half-day' ? 'badge-warning' :
                                    record.status === 'leave' ? 'badge-info' : 'bg-neutral-100 text-neutral-800'
                                }`}>
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </span>
                            </td>
                            <td>{record.checkIn || '-'}</td>
                            <td>{record.checkOut || '-'}</td>
                            <td>{record.workHours ? `${record.workHours} hrs` : '-'}</td>
                            <td className="text-sm">{record.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-center">
                    <button className="btn btn-secondary text-sm">
                      Load More Records
                    </button>
                  </div>
                </div>
              )} */}

              {/* {activeTab === 'leave' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium text-neutral-800">Leave Details</h3>
                    <Link to="/leave" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Apply for Leave
                    </Link>
                  </div>

                  {leaveBalance && (
                    <div className="bg-neutral-50 rounded-md p-4 mb-6">
                      <h4 className="text-sm font-medium text-neutral-700 mb-4">Leave Balance ({new Date().getFullYear()})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-neutral-600">Sick Leave</span>
                            <span className="text-sm font-medium">{leaveBalance.sick.available} / {leaveBalance.sick.total}</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${(leaveBalance.sick.available / leaveBalance.sick.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-neutral-600">Casual Leave</span>
                            <span className="text-sm font-medium">{leaveBalance.casual.available} / {leaveBalance.casual.total}</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div
                              className="bg-warning-500 h-2 rounded-full"
                              style={{ width: `${(leaveBalance.casual.available / leaveBalance.casual.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-neutral-600">Annual Leave</span>
                            <span className="text-sm font-medium">{leaveBalance.annual.available} / {leaveBalance.annual.total}</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div
                              className="bg-accent-500 h-2 rounded-full"
                              style={{ width: `${(leaveBalance.annual.available / leaveBalance.annual.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="table-container mb-4">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Leave ID</th>
                          <th>Type</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Days</th>
                          <th>Status</th>
                          <th>Applied On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaveRequests.length > 0 ? (
                          leaveRequests.map(leave => (
                            <tr key={leave.id}>
                              <td>{leave.id}</td>
                              <td className="capitalize">{leave.leaveType}</td>
                              <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                              <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                              <td>{leave.daysCount}</td>
                              <td>
                                <span className={`badge ${leave.status === 'approved' ? 'badge-success' :
                                  leave.status === 'pending' ? 'badge-warning' :
                                    leave.status === 'rejected' ? 'badge-danger' : 'badge-info'
                                  }`}>
                                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                </span>
                              </td>
                              <td>{new Date(leave.appliedOn).toLocaleDateString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center py-4 text-neutral-500">
                              No leave records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )} */}

              {/* {activeTab === 'payroll' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium text-neutral-800">Salary & Payroll</h3>
                    <Link to="/payroll" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View All Payslips
                    </Link>
                  </div>

                  {employees.salary && (
                    <div className="bg-neutral-50 rounded-md p-4 mb-6">
                      <h4 className="text-sm font-medium text-neutral-700 mb-4">Salary Structure</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-neutral-500">Basic Salary</p>
                          <p className="text-base font-medium">${employee.salary.basic.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">House Rent Allowance</p>
                          <p className="text-base font-medium">${employee.salary.houseRentAllowance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Medical Allowance</p>
                          <p className="text-base font-medium">${employee.salary.medicalAllowance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Travel Allowance</p>
                          <p className="text-base font-medium">${employee.salary.travelAllowance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Dearness Allowance</p>
                          <p className="text-base font-medium">${employee.salary.dearnessAllowance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Provident Fund</p>
                          <p className="text-base font-medium">${employee.salary.providentFund.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Income Tax</p>
                          <p className="text-base font-medium">${employee.salary.incomeTax.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Professional Tax</p>
                          <p className="text-base font-medium">${employee.salary.professionalTax.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between">
                        <div>
                          <p className="text-sm text-neutral-500">Gross Salary</p>
                          <p className="text-lg font-semibold text-neutral-800">
                            ${(
                              employee.salary.basic +
                              employee.salary.houseRentAllowance +
                              employee.salary.medicalAllowance +
                              employee.salary.travelAllowance +
                              employee.salary.dearnessAllowance
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Net Salary</p>
                          <p className="text-lg font-semibold text-neutral-800">
                            ${(
                              employee.salary.basic +
                              employee.salary.houseRentAllowance +
                              employee.salary.medicalAllowance +
                              employee.salary.travelAllowance +
                              employee.salary.dearnessAllowance -
                              employee.salary.providentFund -
                              employee.salary.incomeTax -
                              employee.salary.professionalTax
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="table-container mb-4">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Payslip ID</th>
                          <th>Pay Period</th>
                          <th>Gross Salary</th>
                          <th>Deductions</th>
                          <th>Net Salary</th>
                          <th>Payment Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payrolls.slice(0, 10).map(payroll => {
                          const totalDeductions = payroll.deductions.reduce((sum, ded) => sum + ded.amount, 0);

                          return (
                            <tr key={payroll.id}>
                              <td>{payroll.id}</td>
                              <td>{payroll.period}</td>
                              <td>${payroll.grossSalary.toLocaleString()}</td>
                              <td>${totalDeductions.toLocaleString()}</td>
                              <td>${payroll.netSalary.toLocaleString()}</td>
                              <td>{new Date(payroll.paymentDate).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge ${payroll.paymentStatus === 'processed' ? 'badge-success' :
                                  payroll.paymentStatus === 'pending' ? 'badge-warning' : 'badge-danger'
                                  }`}>
                                  {payroll.paymentStatus.charAt(0).toUpperCase() + payroll.paymentStatus.slice(1)}
                                </span>
                              </td>
                              <td>
                                <Link
                                  to={`/payroll/slip/${payroll.id}`}
                                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )} */}

              {/* {activeTab === 'performance' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium text-neutral-800">Performance Reviews</h3>
                    <div className="text-sm font-medium">
                      Average Rating: <span className="text-primary-600">{averageRating.toFixed(1)}/5.0</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {performanceReviews.slice(0, 5).map(review => (
                      <div key={review.id} className="border border-neutral-200 rounded-md overflow-hidden">
                        <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-medium text-neutral-800">{review.reviewPeriod} Performance Review</h4>
                            <p className="text-xs text-neutral-500">Reviewed on {new Date(review.reviewDate).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center bg-primary-50 text-primary-600 px-3 py-1 rounded-full">
                              <span className="text-sm font-medium mr-1">{review.overallRating.toFixed(1)}</span>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className={`ml-3 text-xs font-medium px-2 py-1 rounded-full ${review.status === 'finalized' ? 'bg-green-100 text-green-800' :
                              review.status === 'acknowledged' ? 'bg-blue-100 text-blue-800' :
                                review.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                              {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-neutral-700 mb-2">Section Ratings</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {review.sections.slice(0, 4).map((section, idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                  <span className="text-sm text-neutral-600">{section.name}</span>
                                  <div className="flex items-center bg-neutral-50 px-2 py-1 rounded">
                                    <span className="text-sm font-medium">{section.rating.toFixed(1)}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500 ml-1">
                                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {review.sections.length > 4 && (
                              <button className="text-primary-600 hover:text-primary-700 text-sm mt-2">
                                + {review.sections.length - 4} more sections
                              </button>
                            )}
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-sm font-medium text-neutral-700">Performance Goals</h5>
                              <button className="text-primary-600 hover:text-primary-700 text-xs font-medium">
                                View All Goals
                              </button>
                            </div>
                            <div className="mt-2 space-y-2">
                              {review.goals.slice(0, 2).map(goal => (
                                <div key={goal.id} className="border border-neutral-200 rounded p-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h6 className="text-sm font-medium text-neutral-800">{goal.title}</h6>
                                      <p className="text-xs text-neutral-500 mt-1">
                                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                                      goal.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                        goal.status === 'not-started' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-gray-100 text-gray-800'
                                      }`}>
                                      {goal.status.split('-').map(word =>
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                      ).join(' ')}
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>Progress</span>
                                      <span>{goal.progress}%</span>
                                    </div>
                                    <div className="w-full bg-neutral-200 rounded-full h-1.5">
                                      <div
                                        className={`${goal.status === 'completed' ? 'bg-green-500' :
                                          'bg-primary-600'
                                          } h-1.5 rounded-full`}
                                        style={{ width: `${goal.progress}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h5 className="text-sm font-medium text-neutral-700 mb-2">Strengths</h5>
                              <ul className="list-disc list-inside space-y-1">
                                {review.strengths.map((strength, idx) => (
                                  <li key={idx} className="text-sm text-neutral-600">{strength}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-neutral-700 mb-2">Areas for Improvement</h5>
                              <ul className="list-disc list-inside space-y-1">
                                {review.improvements.map((improvement, idx) => (
                                  <li key={idx} className="text-sm text-neutral-600">{improvement}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-neutral-700 mb-2">Comments</h5>
                            <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded">{review.comments}</p>
                          </div>

                          <div className="mt-4 text-right">
                            <Link
                              to={`/performance/review/${review.id}`}
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                              View Full Review
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
