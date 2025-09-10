import React, { useEffect, useState } from 'react';
import {
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon,
  TrendingUp, 
  Users, 
  Download, 
  Calendar, 
  DollarSign,
  FileText,
  Eye,
  X,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../constants/axiosInstance';
import { BASE_URL } from '../../constants/api';
import * as XLSX from "xlsx";

interface ReportData {
  [key: string]: any;
}

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<{
    startDate?: string;
    endDate?: string;
    dateOrder?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [previewData, setPreviewData] = useState<ReportData[] | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [actionType, setActionType] = useState<'preview' | 'download' | null>(null);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'ascending' | 'descending'}>({
    key: '',
    direction: 'ascending'
  });

  // Reset success message after 3 seconds
  useEffect(() => {
    if (downloadSuccess) {
      const timer = setTimeout(() => {
        setDownloadSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [downloadSuccess]);

  const validate = () => {
    const newErrors: {
      startDate?: string,
      endDate?: string
      dateOrder?: string
    } = {}

    if (!startDate) {
      newErrors.startDate = "Please select start date"
    }
    if (!endDate) {
      newErrors.endDate = "Please select end date"
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.dateOrder = "End date should be after start date"
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0
  }

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    
    if (previewData) {
      const sortedData = [...previewData].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      setPreviewData(sortedData);
    }
  };

  const processReport = async (endpoint: string, action: 'preview' | 'download') => {
    if (!validate()) return;
    
    setActionType(action);
    setLoading(true);
    
    try {
      const response = await api.get(
        `${BASE_URL}${endpoint}?startDate=${startDate}&endDate=${endDate}`, {
        responseType: 'blob'
      });
      
      const arrayBuffer = await response.data.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(workSheet);
      
      if (action === 'preview') {
        setPreviewData(jsonData);
        setShowPreview(true);
      } else {
        // Download the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${selectedReport}_report_${startDate}_to_${endDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setDownloadSuccess(true);
      }
    } catch (error) {
      console.error("Error processing report:", error);
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const reportConfig = {
    overview: {
      title: "Overall Reports",
      description: "Comprehensive analytics across all departments",
      endpoint: "/api/report/over_all_report",
      color: "blue",
      icon: <BarChartIcon className="h-5 w-5" />
    },
    attendance: {
      title: "Attendance Reports",
      description: "Track employee presence and punctuality",
      endpoint: "/api/attendance/all_user_attendance_report",
      color: "green",
      icon: <Calendar className="h-5 w-5" />
    },
    leave: {
      title: "Leave Reports & Analytics",
      description: "Manage and analyze employee time off",
      endpoint: "/api/leaves/all_user_leave_report",
      color: "amber",
      icon: <Calendar className="h-5 w-5" />
    },
    payroll: {
      title: "Payroll Reports",
      description: "Financial summaries and compensation data",
      endpoint: "/api/report/all_user_payroll_report",
      color: "purple",
      icon: <DollarSign className="h-5 w-5" />
    }
  };

  const colorMap = {
    blue: {
      bg: "bg-blue-500",
      hover: "hover:bg-blue-600",
      lightBg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      ring: "ring-blue-200"
    },
    green: {
      bg: "bg-green-500",
      hover: "hover:bg-green-600",
      lightBg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      ring: "ring-green-200"
    },
    amber: {
      bg: "bg-amber-500",
      hover: "hover:bg-amber-600",
      lightBg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      ring: "ring-amber-200"
    },
    purple: {
      bg: "bg-purple-500",
      hover: "hover:bg-purple-600",
      lightBg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      ring: "ring-purple-200"
    }
  };

  const currentReport = reportConfig[selectedReport as keyof typeof reportConfig];
  const currentColor = colorMap[currentReport.color as keyof typeof colorMap];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className=" mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
          <p className="text-gray-600 mt-2">Generate, preview, and download detailed organizational reports</p>
        </motion.div>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(reportConfig).map(([key, report]) => {
            const color = colorMap[report.color as keyof typeof colorMap];
            const isSelected = selectedReport === key;

            return (
              <motion.button
                key={key}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`p-5 rounded-xl border transition-all duration-200 flex flex-col items-start ${isSelected
                  ? `${color.lightBg} ${color.border} ${color.text} shadow-md ring-2 ${color.ring}`
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => setSelectedReport(key)}
              >
                <div className={`p-2 rounded-lg ${isSelected ? color.bg : 'bg-gray-100'} mb-3`}>
                  {React.cloneElement(report.icon, {
                    className: `h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-600'}`
                  })}
                </div>
                <span className="text-sm font-semibold mb-1">{report.title.split(' ')[0]}</span>
                <span className="text-xs text-gray-500">{report.title}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Report Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedReport}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentReport.title}</h2>
                  <p className="text-gray-600 mt-1">{currentReport.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${currentColor.bg}`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report
                  </span>
                </div>
              </div>

              {/* Date Selection Form */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Date Range</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setErrors((prev) => ({ ...prev, startDate: "", dateOrder: "" }));
                      }}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors?.startDate ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors?.startDate && <p className="text-red-500 text-sm mt-1">{errors?.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setErrors((prev) => ({ ...prev, endDate: "", dateOrder: "" }));
                      }}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${errors?.endDate || errors?.dateOrder ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                    {errors.dateOrder && <p className="text-red-500 text-sm mt-1">{errors.dateOrder}</p>}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => processReport(currentReport.endpoint, 'preview')}
                    disabled={loading}
                    className={`flex-1 ${currentColor.bg} ${currentColor.hover} text-white font-medium py-3 px-6 rounded-lg shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
                  >
                    {loading && actionType === 'preview' ? (
                      <>
                        <div className="w-5 h-5 border-2 rounded-full border-white border-t-transparent animate-spin" />
                        <span>Loading Preview...</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-5 w-5" />
                        Preview Report
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => processReport(currentReport.endpoint, 'download')}
                    disabled={loading}
                    className={`flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
                  >
                    {loading && actionType === 'download' ? (
                      <>
                        <div className="w-5 h-5 border-2 rounded-full border-white border-t-transparent animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        Download Excel
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {downloadSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mb-6 p-4 rounded-lg ${currentColor.lightBg} border ${currentColor.border}`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${currentColor.bg} mr-3`}>
                        <Download className="text-white h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Report downloaded successfully!</p>
                        <p className="text-sm text-gray-600">Your {selectedReport} report is ready.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Data Preview */}
              {showPreview && previewData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-gray-200 overfl max-h-[1000px] overflow-y-auto"
                >
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Data Preview ({previewData.length} records)
                    </h3>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full ">
                      <thead className="bg-gray-50">
                        <tr>
                          {previewData.length > 0 && Object.keys(previewData[0]).map((key) => (
                            <th
                              key={key}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort(key)}
                            >
                              <div className="flex items-center">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                {sortConfig.key === key && (
                                  sortConfig.direction === 'ascending' ? 
                                    <ChevronUp className="h-4 w-4 ml-1" /> : 
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previewData.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {Object.values(row).map((value: any, cellIndex) => (
                              <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {previewData.length > 10 && (
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
                      Showing  {previewData.length} records
                    </div>
                  )}
                </motion.div>
              )}

              {!showPreview && (
                <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900">Report Preview</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Select a date range and click "Preview Report" to view your data
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Reports;