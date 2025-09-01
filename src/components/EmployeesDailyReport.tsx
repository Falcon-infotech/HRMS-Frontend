import React, { useEffect, useState } from "react";
import api from "../constants/axiosInstance";
import { BASE_URL } from "../constants/api";

const EmployeesDailyReport = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const responsefetch = async () => {
      try {
        const res = await api.get(`${BASE_URL}/api/daily_reports/all`);
        setReports(res.data.reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    responsefetch();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Employees Daily Reports</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="px-4 py-3 border">Date</th>
              <th className="px-4 py-3 border">Employee Email</th>
              <th className="px-4 py-3 border">Role</th>
              <th className="px-4 py-3 border">Task</th>
              <th className="px-4 py-3 border">Given By</th>
              <th className="px-4 py-3 border">Department</th>
              <th className="px-4 py-3 border">Objective</th>
              <th className="px-4 py-3 border">Remark</th>
              <th className="px-4 py-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  {/* Date */}
                  <td className="px-4 py-3 border">
                    {new Date(report.date).toLocaleDateString()}
                  </td>

                  {/* UserId info */}
                  <td className="px-4 py-3 border">{report.userId?.email || "N/A"}</td>
                  <td className="px-4 py-3 border">{report.userId?.role || "N/A"}</td>

                  {/* Task Given */}
                  <td className="px-4 py-3 border">
                    {report.reports.map((task) => (
                      <div key={task._id} dangerouslySetInnerHTML={{ __html: task.taskGiven }} />
                    ))}
                  </td>

                  {/* Task Given By */}
                  <td className="px-4 py-3 border">
                    {report.reports.map((task) => (
                      <div key={task._id}>{task.taskGivenBy}</div>
                    ))}
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3 border">
                    {report.reports.map((task) => (
                      <div key={task._id}>{task.concernedDepartment}</div>
                    ))}
                  </td>

                  {/* Objective */}
                  <td className="px-4 py-3 border">
                    {report.reports.map((task) => (
                      <div key={task._id} dangerouslySetInnerHTML={{ __html: task.objective }} />
                    ))}
                  </td>

                  {/* Remark */}
                  <td className="px-4 py-3 border">
                    {report.reports.map((task) => (
                      <div key={task._id} dangerouslySetInnerHTML={{ __html: task.remark }} />
                    ))}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 border flex flex-col">
                    {report.reports.map((task) => (
                      <div
                        key={task._id}
                        className={`px-2 py-1 my-1 inline-block rounded text-xs font-medium ${task.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : task.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : task.status === "Pending"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {task.status}
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-gray-500 border"
                >
                  No reports available
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesDailyReport;
