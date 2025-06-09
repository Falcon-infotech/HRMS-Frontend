import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../constants/api';

const LeaveDetails = () => {
  const { id } = useParams(); // userId
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/leaves/leaves_byId/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
          },
        });
        setLeaves(res.data.data);
      } catch (error) {
        console.error('Failed to fetch leave details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [id]);

  const totalPages = Math.ceil(leaves.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLeaves = leaves.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (loading) return <div className="text-center py-8">Loading leave details...</div>;

  if (!leaves || leaves.length === 0)
    return <div className="text-center text-gray-600 py-8">No leave records found.</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Leave History</h2>

      <div className="overflow-x-auto rounded-md">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">To</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Taken</th>
              <th className="px-4 py-3">Balance</th>
            </tr>
          </thead>
          <tbody>
            {currentLeaves?.map((leave, index) => (
              <tr key={leave._id} className="border-b bg-white hover:bg-gray-50 transition">
                <td className="px-4 py-3">{startIndex + index + 1}</td>
                <td className="px-4 py-3">
                  {leave.employee.first_name} {leave.employee.last_name}
                </td>
                <td className="px-4 py-3">{leave.employee.email}</td>
                <td className="px-4 py-3">{leave.leaveType}</td>
                <td className="px-4 py-3">{leave.reason}</td>
                <td className="px-4 py-3">{new Date(leave.fromDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{new Date(leave.toDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      leave.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : leave.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
                <td className="px-4 py-3">{leave.leaveTaken}</td>
                <td className="px-4 py-3">{leave.leaveBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, leaves.length)} of{' '}
          {leaves.length}
        </p>

        <div className="flex gap-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-1 rounded-md border ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-blue-50 text-gray-700'
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md border ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-1 rounded-md border ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-blue-50 text-gray-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetails;
