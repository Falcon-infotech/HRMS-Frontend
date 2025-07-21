import React, { useState } from "react";
import Loading from "./Loading";

const USERS_PER_PAGE = 10;

const AllUserAttendance = ({ attendanceData, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentPage2, setCurrentPage2] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(attendanceData.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const currentUsers = attendanceData.slice(startIndex, startIndex + USERS_PER_PAGE);

  const selectedUser = attendanceData.find(u => u.userId === selectedUserId);

  const totalItems = selectedUser?.attendanceHistory.length || 0;
  const totalPages2 = Math.ceil(totalItems / itemsPerPage);

  // const paginatedData = selectedUser?.attendanceHistory.slice(
  //   (currentPage2 - 1) * itemsPerPage,
  //   currentPage2 * itemsPerPage
  // );


  const renderPageNumbers = () => {
    let pageNumbers = []
    let startPage = Math.max(1, currentPage2 - 1);
    let endPage = Math.min(totalPages2, currentPage2 + 1);
    if (endPage - startPage < 3) {
      startPage = Math.max(1, endPage - 3);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`btn flex gap-5 ${i === currentPage2 ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  }
  const renderPageNumbers2 = () => {
    let pageNumbers = []
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
    if (endPage - startPage < 3) {
      startPage = Math.max(1, endPage - 3);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`btn flex gap-5 ${i === currentPage ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  }





  const paginatedData = selectedUser
    ? [...selectedUser.attendanceHistory] // copy to avoid mutating original
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
      .slice((currentPage2 - 1) * itemsPerPage, currentPage2 * itemsPerPage)
    : [];

  console.log(paginatedData)

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading text={"Loading attendance data..."} />
        {/* <span className="ml-4 text-blue-600 font-semibold">Loading attendance data...</span> */}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-full mx-auto">
      <h2 className="text-2xl font-semibold mb-4">User Attendance</h2>

      <div className="overflow-x-auto rounded-lg border shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Records</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}

            {currentUsers.map(user => (
              <tr
                key={user.userId}
                className={`cursor-pointer hover:bg-gray-100 ${selectedUserId === user.userId ? "bg-gray-100" : ""}`}
                onClick={() => handleUserSelect(user.userId)}
                aria-expanded={selectedUserId === user.userId}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleUserSelect(user.userId);
                  }
                }}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{user?.empId}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{user?.userName}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{user?.userEmail}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{user?.userPhone}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {user?.attendanceHistory?.length} record{user?.attendanceHistory?.length !== 1 ? "s" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User pagination */}
      <div className="mt-4 flex justify-end items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded border text-gray-700 ${currentPage === 1 ? "cursor-not-allowed bg-gray-100 text-gray-400" : "hover:bg-gray-200"}`}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => handlePageSelect(page)}
              className={`px-3 py-1 rounded border text-sm ${isActive ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 text-gray-700 hover:bg-gray-200"}`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border text-gray-700 ${currentPage === totalPages ? "cursor-not-allowed bg-gray-100 text-gray-400" : "hover:bg-gray-200"}`}
        >
          Next
        </button>
      </div>

      {/* Attendance details */}
      {selectedUser && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Attendance Details for: <span className="text-blue-600">{selectedUser.userName}</span>
          </h3>

          {selectedUser.attendanceHistory.length === 0 ? (
            <p className="text-gray-500 italic">No attendance records available.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">Check-In</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">Check-Out</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">Duration</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedData.map((att, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-800">{att.date}</td>
                      <td className="px-6 py-4 text-gray-600">{att.inTime || "--"}</td>
                      <td className="px-6 py-4 text-gray-600">{att.outTime || "--"}</td>
                      <td className="px-6 py-4 text-gray-600">{att.duration || "--"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full text-white ${att.status === "Absent" ? "bg-red-500" : att.status === "Half Day" ? "bg-yellow-400 text-gray-800" : "bg-green-500"}`}>
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Attendance pagination */}
              {totalPages2 > 1 && (
                <div className="flex justify-end items-center gap-2 p-4 bg-gray-50 rounded-b-xl">
                  <button
                    onClick={() => setCurrentPage2((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage2 === 1}
                    className="px-3 py-1 text-sm rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {/* {[...Array(totalPages2)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage2(i + 1)}
                      className={`px-3 py-1 text-sm rounded border ${currentPage2 === i + 1 ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
                    >
                      {i + 1}
                    </button>
                  ))} */}
                  {renderPageNumbers()}

                  <button
                    onClick={() => setCurrentPage2((prev) => Math.min(prev + 1, totalPages2))}
                    disabled={currentPage2 === totalPages2}
                    className="px-3 py-1 text-sm rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllUserAttendance;
