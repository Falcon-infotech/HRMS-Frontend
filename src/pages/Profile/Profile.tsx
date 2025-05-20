import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import toast from 'react-hot-toast';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const capitalize = (str: string = "") =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


  const handleFilechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...fileArray])
    }
  }

  const handleDelete = (indexs: number) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexs))
  }

  const tabs = [
    "Personal",
    "Job",
    "Documents",
    "Time off",
    "Performance",
    "Time",
    "Tasks",
    "More",
  ];
  const [activeTab, setActiveTab] = useState("Personal");

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (selectedFiles.length === 0) {
      toast.error('No file selected');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("tokenId");
    if (!title.trim()) {
      toast.error('Please enter a document name');
      setLoading(false);
      return;
    }
    try {
      let userId = user?._id!;
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });



      formData.append('userId', userId);
      formData.append('title', title);

      const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      toast.success('Files uploaded successfully!');
      setSelectedFiles([]);
      setTitle("")
    } catch (error) {
      console.error(error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const renderTabContent = () => {
    switch (activeTab) {
      case "Personal":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg font-bold text-gray-700">
            <div><span className="font-medium">First Name:</span> {capitalize(user?.first_name)}</div>
            <div><span className="font-medium">Last Name:</span> {capitalize(user?.last_name)}</div>
            <div><span className="font-medium">Email:</span> {user?.email}</div>
            <div>
              <span className="font-medium">Status:</span>{' '}
              <span
                className={`inline-block px-2 py-0.5 rounded text-white text-sm font-semibold ${user?.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}
              >
                {capitalize(user?.status)}
              </span>
            </div>
            <div><span className="font-medium">Role:</span> {capitalize(user?.role)}</div>
            <div><span className="font-medium">Joining Date:</span> {formatDate(user?.joining_date)}</div>
            <div className="md:col-span-2">

              <p className="">
                <span className="font-medium">Address : </span>
                {user?.address?.address_line}, {user?.address?.village}, {user?.address?.city}, {user?.address?.state}, {user?.address?.country}
              </p>
            </div>
          </div>
        );
      case "Job":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg font-bold text-gray-700">
            <div><span className="font-medium">Department:</span> {user?.department}</div>
            <div><span className="font-medium">Designation:</span> {user?.designation}</div>
            <div><span className="font-medium">Salary:</span> ₹{user?.salary}</div>
          </div>
        );


      case "Documents":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Upload Document</h3>
              <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="cursor-pointer bg-blue-600 text-white w-max px-4 py-2 rounded hover:bg-blue-700 transition">
                    Select File
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFilechange}
                    />
                  </label>

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Document Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Resume, Offer Letter"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className={`px-4 py-2 rounded-md text-white ${loading || !title.trim() ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>


                {selectedFiles.length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">Selected Documents</h4>
                    <ul className="space-y-3">
                      {selectedFiles.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-4 py-2 hover:shadow-sm transition"
                        >
                          <div className="text-gray-700 text-sm">
                            📄 <span className="font-medium">{file.name}</span> – {(file.size / 1024).toFixed(2)} KB
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDelete(index)}
                            className="text-red-500 hover:text-red-600 text-sm font-semibold"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </form>
            </div>

            {/* Uploaded documents list */}
            {/* <div>
      <h3 className="text-lg font-semibold mb-2">Uploaded Documents</h3>
      <ul className="space-y-2">
        {[
          { name: 'Resume.pdf', uploadedAt: '2025-05-01' },
          { name: 'Offer_Letter.pdf', uploadedAt: '2025-05-03' },
        ].map((doc, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded border"
          >
            <div>
              <p className="font-medium">{doc.name}</p>
              <p className="text-sm text-gray-500">Uploaded on {doc.uploadedAt}</p>
            </div>
            <button className="text-blue-600 hover:underline">Download</button>
          </li>
        ))}
      </ul>
    </div> */}
          </div>
        )
      default:
        return (
          <p className="text-gray-600 mt-2">This is the content for the "{activeTab}" tab.</p>
        );
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white rounded-md shadow-md overflow-hidden">
      {/* Cover Image */}
      <div className='h-60 relative bg-gray-200'>
        <img
          src="https://img.freepik.com/free-vector/paper-style-dynamic-lines-background_23-2149008629.jpg?semt=ais_hybrid&w=740"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {/* Profile Picture */}
        <div className='absolute -bottom-20 left-6'>
          <img
            src="https://img.freepik.com/premium-vector/man-professional-business-casual-young-avatar-icon-illustration_1277826-623.jpg?ga=GA1.1.1218145876.1747648595&semt=ais_hybrid&w=740"
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
          />
        </div>
      </div>

      {/* Name and Role */}
      <div className="mt-20 px-6 pb-4">
        <h1 className="text-2xl font-semibold">
          {capitalize(user?.first_name) + " " + capitalize(user?.last_name)}
        </h1>
        <p className="text-gray-600">{user?.designation}</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 px-6 py-3 border-b overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-sm font-medium rounded ${activeTab === tab
              ? "bg-gray-200 text-black"
              : "text-gray-500 hover:text-black"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">{renderTabContent()}</div>
    </div>
  );
};

export default Profile;
