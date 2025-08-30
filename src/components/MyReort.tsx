import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../constants/axiosInstance";
import { BASE_URL } from "../constants/api";

const MyReport = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const res = await api.get(`${BASE_URL}/api/daily_reports/my_reports`);
        setData(res.data.reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    handleFetch();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-neutral-800">My Reports</h3>
        <Link to={"/createTask"}>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
          >
            Create Report
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="px-4 py-3 border">Date</th>
              <th className="px-4 py-3 border">Task</th>
              <th className="px-4 py-3 border">Given By</th>
              <th className="px-4 py-3 border">Department</th>
              <th className="px-4 py-3 border">Objective</th>
              <th className="px-4 py-3 border">Remark</th>
              <th className="px-4 py-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data.map((report) =>
                report.reports.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border">
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 border">{task.taskGiven}</td>
                    <td className="px-4 py-3 border">{task.taskGivenBy}</td>
                    <td className="px-4 py-3 border">{task.concernedDepartment}</td>
                    <td className="px-4 py-3 border">{task.objective}</td>
                    <td className="px-4 py-3 border">{task.remark}</td>
                    <td className="px-4 py-3 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          task.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : task.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gray-500 border"
                >
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyReport;
