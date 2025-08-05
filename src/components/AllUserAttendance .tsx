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
        className={`px-3 py-1 text-sm rounded border ${
          i === currentPage2 ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 text-gray-700 hover:bg-gray-200"
        }`}
        onClick={() => setCurrentPage2(i)} // 👈 Correct one
      >
        {i}
      </button>
    );
  }
  return pageNumbers;
};

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
        className={`px-3 py-1 text-sm rounded border ${
          i === currentPage ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 text-gray-700 hover:bg-gray-200"
        }`}
        onClick={() => setCurrentPage(i)} // 👈 For outer table
      >
        {i}
      </button>
    );
  }
  return pageNumbers;
};






  const paginatedData = selectedUser
    ? [...selectedUser.attendanceHistory] // copy to avoid mutating original
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
      .slice((currentPage2 - 1) * itemsPerPage, currentPage2 * itemsPerPage)
    : [];

  // console.log(paginatedData)

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

        {/* {[...Array(totalPages)].map((_, i) => {
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
        })} */}
        {renderPageNumbers2()}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border text-gray-700 ${currentPage === totalPages ? "cursor-not-allowed bg-gray-100 text-gray-400" : "hover:bg-gray-200"}`}
        >
          Next
        </button>
      </div>

      {/* Attendance details */}
      {/* Right Drawer for Attendance Details */}
      {selectedUser && (
        <div className={`fixed top-0 right-0 h-full w-full sm:w-[50%] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${selectedUserId ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h2 className="text-xl font-semibold">Attendance Details</h2>
            <button
              onClick={() => setSelectedUserId(null)}
              className="text-gray-600 hover:text-gray-800 text-lg font-bold"
            >
              &times;
            </button>
          </div>

          <div className="p-4 overflow-y-auto h-full">
            <h3 className="text-lg font-semibold mb-2 text-blue-600">
              {selectedUser.userName}
            </h3>

            {selectedUser.attendanceHistory.length === 0 ? (
              <p className="text-gray-500 italic">No attendance records available.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">Date</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">Check-In</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">Check-Out</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">Duration</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedData.map((att, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 text-gray-800">{att.date}</td>
                        <td className="px-4 py-2 text-gray-600">{new Date(att.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '--'}</td>
                        <td className="px-4 py-2 text-gray-600">{new Date(att.outTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) || '--'}</td>
                        <td className="px-4 py-2 text-gray-600">{att.duration || '--'}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full text-white ${att.status === "Absent" ? "bg-red-500" : att.status === "Half Day" ? "bg-yellow-400 text-gray-800" : "bg-green-500"}`}>
                            {att.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination inside drawer */}
                {totalPages2 > 1 && (
                  <div className="flex justify-end items-center gap-2 p-4 bg-gray-50 rounded-b-xl">
                    <button
                      onClick={() => setCurrentPage2((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage2 === 1}
                      className="px-3 py-1 text-sm rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
                    >
                      Previous
                    </button>

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
        </div>
      )}

    </div>
  );
};

export default AllUserAttendance;
