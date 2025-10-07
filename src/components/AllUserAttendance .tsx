import React, { useState, useEffect } from "react";
import axios from "../constants/axiosInstance";
import Loading from "./Loading";
import { BASE_URL } from "../constants/api";

const USERS_PER_PAGE = 10;

const AllUserAttendance = ({ attendanceData, isLoading }) => {
  console.log(attendanceData)
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [attendanceHistory, setAttendanceHistory] = useState([]); // store fetched history
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [currentPage2, setCurrentPage2] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(attendanceData.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const currentUsers = attendanceData.slice(startIndex, startIndex + USERS_PER_PAGE);

  // fetch attendance when userId changes
  useEffect(() => {
    if (!selectedUserId) return;

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/attendance/single_user_attendance_history/${selectedUserId}`
        );
        setAttendanceHistory(res.data?.data?.reverse() || []);
      } catch (err) {
        console.error("Error fetching attendance history", err);
        setAttendanceHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [selectedUserId]);

  // pagination for inner drawer
  const totalItems = attendanceHistory.length;
  const totalPages2 = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = [...attendanceHistory]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice((currentPage2 - 1) * itemsPerPage, currentPage2 * itemsPerPage);

    const handlePrevious = () => currentPage > 1 && setCurrentPage(p => p - 1);
    const handleNext = () => currentPage < totalPages && setCurrentPage(p => p + 1);

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId === selectedUserId ? null : userId);
    setCurrentPage2(1);
  };

  const handlePageSelect = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // page numbers for main table
  const renderPageNumbers2 = () => {
    let pageNumbers = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
    if (endPage - startPage < 3) {
      startPage = Math.max(1, endPage - 3);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-3 py-1 text-sm rounded border ${i === currentPage
              ? "bg-primary-500 text-white border-primary-500"
              : "border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  // page numbers for drawer table
  const renderPageNumbers = () => {
    let pageNumbers = [];
    let startPage = Math.max(1, currentPage2 - 1);
    let endPage = Math.min(totalPages2, currentPage2 + 1);
    if (endPage - startPage < 3) {
      startPage = Math.max(1, endPage - 3);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-3 py-1 text-sm rounded border ${i === currentPage2
              ? "bg-primary-600 text-white border-blue-500"
              : "border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
          onClick={() => setCurrentPage2(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading text="Loading attendance data..." />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-full mx-auto">
      <h2 className="text-2xl font-semibold mb-4">User Attendance</h2>

      {/* Main Users Table */}
      <div className="overflow-x-auto rounded-lg border shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">User ID</th>
              <th className="px-4 py-3 text-left">Full Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.userId}
                className={`cursor-pointer hover:bg-gray-100 border bprder-t ${selectedUserId === user.user.userId ? "bg-gray-100" : ""
                  }`}
                onClick={() => handleUserSelect(user.user.userId)}
              >
                <td className="px-4 py-3">{user.user.empId}</td>
                <td className="px-4 py-3">{user.user.name}</td>
                <td className="px-4 py-3">{user.user.email}</td>
                <td className="px-4 py-3">{user.user.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-700">Click to view</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main pagination */}
      <div className="mt-4 flex justify-end items-center space-x-2">
        <button onClick={handlePrevious} disabled={currentPage === 1} className="border px-3 py-1 rounded-md text-primary-600">
          Previous
        </button>
        {renderPageNumbers2()}
        <button onClick={handleNext} disabled={currentPage === totalPages} className="border px-3 py-1 rounded text-primary-600">
          Next
        </button>
      </div>

      {/* Drawer for attendance */}
      {selectedUserId && (
        <div className="fixed top-0 right-0 h-full w-full sm:w-[50%] bg-white shadow-xl z-50">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h2 className="text-xl font-semibold">Attendance Details</h2>
            <button onClick={() => setSelectedUserId(null)}>&times;</button>
          </div>

          <div className="p-4 overflow-y-auto h-full">
            {loadingHistory ? (
              <Loading text="Loading user history..." />
            ) : attendanceHistory.length === 0 ? (
              <p>No records found</p>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 textl">Date</th>
                      <th className="px-4 py-2 textl">Check-In</th>
                      <th className="px-4 py-2 textl">Check-Out</th>
                      <th className="px-4 py-2 textl">Duration</th>
                      <th className="px-4 py-2 textl">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((att, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-center">{att.date}</td>
                        <td className="px-4 py-2 text-center">
                          {att.inTime
                            ? new Date(att.inTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            : "--"}
                        </td>
                        <td className="px-4 py- text-center2">
                          {att.outTime
                            ? new Date(att.outTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            : "--"}
                        </td>
                        <td className="px-4 py-2 text-center">{att.duration || "--"}</td>
                        <td className="px-4 py- text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs ${att.status === "Absent"
                                ? "bg-red-500 text-white"
                                : att.status === "Half Day"
                                  ? "bg-yellow-400 text-gray-800"
                                  : "bg-green-500 text-white"
                              }`}
                          >
                            {att.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination inside drawer */}
                <div className="flex justify-end mt-4 gap-2 text-primary-600">
                  <button
                    onClick={() =>
                      setCurrentPage2((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage2 === 1}
                    className="border px-3 py-1 rounded-md text-primary-600"
                  >
                    Prev
                  </button>
                  {renderPageNumbers()}
                  <button
                    onClick={() =>
                      setCurrentPage2((prev) =>
                        Math.min(prev + 1, totalPages2)
                      )
                    }
                    disabled={currentPage2 === totalPages2}
                    className="border px-3 py-1 rounded-md"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUserAttendance;
