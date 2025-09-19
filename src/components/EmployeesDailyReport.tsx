import React, { useEffect, useState } from "react";
import api from "../constants/axiosInstance";
import { BASE_URL } from "../constants/api";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from "lucide-react";

const EmployeesDailyReport = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const responsefetch = async () => {
      try {
        const res = await api.get(`${BASE_URL}/api/daily_reports/all`);
        setReports(res.data.reports);
        setFilteredReports(res.data.reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    responsefetch();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let result = reports;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(report =>
        report.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reports.some(task =>
          task.taskGivenBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.concernedDepartment?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(report =>
        report.reports.some(task => task.status === statusFilter)
      );
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      result = result.filter(report =>
        report.reports.some(task => task.concernedDepartment === departmentFilter)
      );
    }

    // Apply date filter
    if (dateFilter) {
      result = result.filter(report => {
        const reportDate = new Date(report.date).toISOString().split('T')[0];
        return reportDate === dateFilter;
      });
    }

    setFilteredReports(result);
  }, [searchTerm, statusFilter, departmentFilter, dateFilter, reports]);

  // Sort functionality
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedReports = [...filteredReports].sort((a, b) => {
      if (key === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return direction === 'ascending' ? dateA - dateB : dateB - dateA;
      } else if (key === 'email') {
        const emailA = a.userId?.email || '';
        const emailB = b.userId?.email || '';
        return direction === 'ascending'
          ? emailA.localeCompare(emailB)
          : emailB.localeCompare(emailA);
      } else if (key === 'department') {
        const deptA = a.reports[0]?.concernedDepartment || '';
        const deptB = b.reports[0]?.concernedDepartment || '';
        return direction === 'ascending'
          ? deptA.localeCompare(deptB)
          : deptB.localeCompare(deptA);
      }
      return 0;
    });

    setFilteredReports(sortedReports);
  };

  const toggleRowExpansion = (reportId) => {
    setExpandedRows(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={16} className="text-green-500" />;
      case "In Progress":
        return <Clock size={16} className="text-yellow-500" />;
      case "Pending":
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  const getUniqueDepartments = () => {
    const departments = new Set();
    reports.forEach(report => {
      report.reports.forEach(task => {
        if (task.concernedDepartment) {
          departments.add(task.concernedDepartment);
        }
      });
    });
    return ["all", ...Array.from(departments)].sort();
  };

  const exportToCSV = () => {
    // Simple CSV export implementation
    const headers = ["Date", "Employee Email", "Role", "Task", "Given By", "Department", "Objective", "Remark", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredReports.flatMap(report =>
        report.reports.map(task =>
          [
            new Date(report.date).toLocaleDateString(),
            report.userId?.email || "N/A",
            report.userId?.role || "N/A",
            task.taskGiven?.replace(/<[^>]*>/g, ""),
            task.taskGivenBy,
            task.concernedDepartment,
            task.objective?.replace(/<[^>]*>/g, ""),
            task.remark?.replace(/<[^>]*>/g, ""),
            task.status
          ].map(field => `"${field}"`).join(",")
        )
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "daily_reports.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Employees Daily Reports</h2>
        <p className="text-gray-600">Track and manage daily task reports from your team</p>
      </div> */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Employees Daily Reports</h1>
            <p className="text-blue-100 mt-2">Track and manage daily task reports from your team</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-sm text-blue-100">Today is </span>
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by email, department, or assigner..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <Filter size={18} className="text-gray-400 mr-2" />
              <select
                className="w-full  text-primary-600 "
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <User size={18} className="text-gray-400 mr-2" />
              <select
                className="w-full focus:outline-none"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {getUniqueDepartments().filter(dept => dept !== "all").map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <Calendar size={18} className="text-gray-400 mr-2" />
              <input
                type="date"
                className="w-full focus:outline-none"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {filteredReports.length} of {reports.length} reports
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={18} className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('date')}>
                <div className="flex items-center">
                  Date
                  {sortConfig.key === 'date' && (
                    sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                <div className="flex items-center">
                  Employee
                  {sortConfig.key === 'email' && (
                    sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('department')}>
                <div className="flex items-center">
                  Department
                  {sortConfig.key === 'department' && (
                    sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <React.Fragment key={report._id}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleRowExpansion(report._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(report.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                          {report.userId?.email?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{report.userId?.email || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{report.userId?.role || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {report.reports[0]?.concernedDepartment || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {report.reports.length} task{report.reports.length !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {report.reports.slice(0, 2).map((task) => (
                          <div
                            key={task._id}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : task.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : task.status === "Pending"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {getStatusIcon(task.status)}
                            <span className="ml-1">{task.status}</span>
                          </div>
                        ))}
                        {report.reports.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{report.reports.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={"/allEmloyeesTask/" + report._id}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded row with task details */}
                  {expandedRows[report._id] && (
                    <tr className="bg-blue-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {report.reports.map((task) => (
                            <div key={task._id} className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-medium text-gray-900">Task Details</h4>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === "In Progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : task.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : task.status === "Pending"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}>
                                  {getStatusIcon(task.status)}
                                  <span className="ml-1">{task.status}</span>
                                </div>
                              </div>

                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">Task: </span>
                                  <div dangerouslySetInnerHTML={{ __html: task.taskGiven }} />
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Given By: </span>
                                  <span>{task.taskGivenBy}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Department: </span>
                                  <span>{task.concernedDepartment}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Objective: </span>
                                  <div dangerouslySetInnerHTML={{ __html: task.objective }} />
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Remark: </span>
                                  <div dangerouslySetInnerHTML={{ __html: task.remark }} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-lg">No reports found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {reports.length === 0
                      ? "No daily reports have been submitted yet."
                      : "Try adjusting your filters to see more results."}
                  </p>
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