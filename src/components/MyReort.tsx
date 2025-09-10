import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../constants/axiosInstance";
import { BASE_URL } from "../constants/api";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Edit,
  Eye,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  User,
  Building,
  Target,
  MessageSquare
} from "lucide-react";

const MyReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [expandedTask, setExpandedTask] = useState(null);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const res = await api.get(`${BASE_URL}/api/daily_reports/my_reports`);
        setData(res.data.reports);
        setFilteredData(res.data.reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    handleFetch();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let result = data;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(report => 
        report.reports.some(task => 
          task.taskGiven?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    
    setFilteredData(result);
  }, [searchTerm, statusFilter, departmentFilter, dateFilter, data]);

  // Sort functionality
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    
    const sortedData = [...filteredData].sort((a, b) => {
      if (key === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return direction === 'ascending' ? dateA - dateB : dateB - dateA;
      } else if (key === 'givenBy') {
        const givenByA = a.reports[0]?.taskGivenBy || '';
        const givenByB = b.reports[0]?.taskGivenBy || '';
        return direction === 'ascending' 
          ? givenByA.localeCompare(givenByB) 
          : givenByB.localeCompare(givenByA);
      } else if (key === 'department') {
        const deptA = a.reports[0]?.concernedDepartment || '';
        const deptB = b.reports[0]?.concernedDepartment || '';
        return direction === 'ascending' 
          ? deptA.localeCompare(deptB) 
          : deptB.localeCompare(deptA);
      }
      return 0;
    });
    
    setFilteredData(sortedData);
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
    data.forEach(report => {
      report.reports.forEach(task => {
        if (task.concernedDepartment) {
          departments.add(task.concernedDepartment);
        }
      });
    });
    return ["all", ...Array.from(departments)].sort();
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const exportToCSV = () => {
    // Simple CSV export implementation
    const headers = ["Date", "Task", "Given By", "Department", "Objective", "Remark", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredData.flatMap(report => 
        report.reports.map(task => 
          [
            new Date(report.date).toLocaleDateString(),
            task.taskGiven?.replace(/<[^>]*>/g, ""), // Strip HTML tags
            task.taskGivenBy,
            task.concernedDepartment,
            task.objective?.replace(/<[^>]*>/g, ""), // Strip HTML tags
            task.remark?.replace(/<[^>]*>/g, ""), // Strip HTML tags
            task.status
          ].map(field => `"${field}"`).join(",")
        )
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "my_reports.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const flattenTasks = () => {
    return filteredData.flatMap(report => 
      report.reports.map(task => ({ ...task, reportDate: report.date, reportId: report._id }))
    );
  };

  const flattenedTasks = flattenTasks();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Daily Reports</h1>
            <p className="text-gray-600 mt-1">Track and manage your daily task reports</p>
          </div>
          <Link 
            to="/createTask"
            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Create Report
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search tasks, departments, or assigners..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <Filter size={18} className="text-gray-400 mr-2" />
              <select
                className="w-full focus:outline-none"
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
              <Building size={18} className="text-gray-400 mr-2" />
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
            Showing {flattenedTasks.length} of {data.flatMap(report => report.reports).length} tasks
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

      {/* Reports Cards/Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-8 bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-1 cursor-pointer" onClick={() => handleSort('date')}>
            <div className="flex items-center">
              Date
              {sortConfig.key === 'date' && (
                sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
              )}
            </div>
          </div>
          <div className="col-span-2">Task</div>
          <div className="col-span-1 cursor-pointer" onClick={() => handleSort('givenBy')}>
            <div className="flex items-center">
              Given By
              {sortConfig.key === 'givenBy' && (
                sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
              )}
            </div>
          </div>
          <div className="col-span-1 cursor-pointer" onClick={() => handleSort('department')}>
            <div className="flex items-center">
              Department
              {sortConfig.key === 'department' && (
                sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
              )}
            </div>
          </div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        {/* Reports List */}
        <div className="divide-y divide-gray-200">
          {flattenedTasks.length > 0 ? (
            flattenedTasks.map((task, index) => (
              <div key={`${task.reportId}-${task._id}-${index}`} className="px-6 py-4 hover:bg-gray-50">
                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-8 gap-4 items-center">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(task.reportDate).toLocaleDateString()}
                  </div>
                  <div className="col-span-2">
                    <div 
                      className="text-sm text-gray-900 line-clamp-2" 
                      dangerouslySetInnerHTML={{ __html: task.taskGiven || "No task description" }} 
                    />
                  </div>
                  <div className="text-sm text-gray-900">{task.taskGivenBy}</div>
                  <div className="text-sm text-gray-900">{task.concernedDepartment}</div>
                  <div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : task.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {getStatusIcon(task.status)}
                      <span className="ml-1">{task.status}</span>
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-center space-x-2">
                    <Link 
                      to={`/createTask/${task.reportId}/${task._id}`}
                      className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Link>
                    <button 
                      onClick={() => toggleTaskExpansion(`${task.reportId}-${task._id}`)}
                      className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </button>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(task.reportDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{task.taskGivenBy}</div>
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : task.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {getStatusIcon(task.status)}
                      <span className="ml-1">{task.status}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-sm text-gray-900 font-medium">{task.concernedDepartment}</div>
                    <div 
                      className="text-sm text-gray-700 mt-1 line-clamp-2" 
                      dangerouslySetInnerHTML={{ __html: task.taskGiven || "No task description" }} 
                    />
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <Link 
                      to={`/createTask/${task.reportId}/${task._id}`}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Link>
                    <button 
                      onClick={() => toggleTaskExpansion(`${task.reportId}-${task._id}`)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye size={16} className="mr-1" />
                      Details
                    </button>
                  </div>
                </div>

                {/* Expanded Task Details */}
                {expandedTask === `${task.reportId}-${task._id}` && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-3">Task Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center text-gray-700 mb-1">
                          <Target size={16} className="mr-2 text-gray-500" />
                          <span className="font-medium">Objective:</span>
                        </div>
                        <div 
                          className="text-gray-600 ml-6" 
                          dangerouslySetInnerHTML={{ __html: task.objective || "No objective provided" }} 
                        />
                      </div>
                      <div>
                        <div className="flex items-center text-gray-700 mb-1">
                          <MessageSquare size={16} className="mr-2 text-gray-500" />
                          <span className="font-medium">Remark:</span>
                        </div>
                        <div 
                          className="text-gray-600 ml-6" 
                          dangerouslySetInnerHTML={{ __html: task.remark || "No remarks provided" }} 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-lg">No reports found</p>
              <p className="text-gray-400 text-sm mt-1">
                {data.length === 0 
                  ? "You haven't created any daily reports yet." 
                  : "Try adjusting your filters to see more results."}
              </p>
              {data.length === 0 && (
                <Link 
                  to="/createTask"
                  className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} className="mr-2" />
                  Create Your First Report
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReport;