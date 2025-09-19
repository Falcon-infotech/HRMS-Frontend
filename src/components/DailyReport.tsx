import { useEffect, useRef, useState } from "react"
import api from "../constants/axiosInstance"
import { API, BASE_URL } from "../constants/api"
import toast from "react-hot-toast"
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineStatusOnline } from "react-icons/hi";

import {
  Calendar,
  Building,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Save,
  FileText,
  Target,
  MessageSquare
} from "lucide-react";

type Task = {
  date?: string
  taskGiven: string
  taskGivenBy: string
  concernedDepartment: string
  objective: string
  remark: string
  status: string
}

type TaskErrors = Partial<Record<keyof Task, string>>

export default function DailyReportForm() {
  const { id, taskid } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const isTaskEdit = !!taskid;

  const [task, setTask] = useState<Task>({
    date: "",
    taskGiven: "",
    taskGivenBy: "",
    concernedDepartment: "",
    objective: "",
    remark: "",
    status: "",
  })
  const [department, setDepartment] = useState([]);
  const [loading, setLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<TaskErrors>({})
  const [resetCounter, setResetCounter] = useState(0)
  const [isLoadingTask, setIsLoadingTask] = useState(false)

  const loaddepartments = async () => {
    try {
      const response = await api.get(`${BASE_URL}/api/employee/department`,);
      setDepartment(response.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setTask({ ...task, [name]: value })
    setFormErrors({ ...formErrors, [name]: "" })
  }

  useEffect(() => {
    loaddepartments()
  }, [])

  const validate = () => {
    const errors: TaskErrors = {}
    if (!task.date) errors.date = "Date is required"
    if (!task.taskGiven.trim()) errors.taskGiven = "Task is required"
    if (!task.taskGivenBy.trim()) errors.taskGivenBy = "Task given by is required"
    if (!task.concernedDepartment.trim()) errors.concernedDepartment = "Department is required"
    if (!task.objective.trim()) errors.objective = "Objective is required"
    if (!task.status) errors.status = "Status is required"
    if (!task.remark.trim()) errors.remark = "Remark is required"
    return errors
  }

  useEffect(() => {
    let isMounted = true;
    
    if (id && taskid) {
      setIsLoadingTask(true);
      const fetchTask = async () => {
        try {
          const response = await api.get(`${BASE_URL}/api/daily_reports/${id}`);
          const report = response.data.report;

          // Find the matching subtask by id
          const match = report.reports.find(
            (item: any) => String(item._id) === String(taskid)
          );

          if (!match) {
            console.error("Task not found for taskid:", taskid);
            toast.error("Task not found");
            return;
          }

          const formattedDate = report.date ? report.date.split("T")[0] : "";

          if (isMounted) {
            setTask({
              date: formattedDate,
              taskGiven: match.taskGiven || "",
              taskGivenBy: match.taskGivenBy || "",
              concernedDepartment: match.concernedDepartment || "",
              objective: match.objective || "",
              remark: match.remark || "",
              status: match.status || "",
            });
          }
        } catch (error) {
          console.error("Error fetching task:", error);
          toast.error("Error loading task data");
        } finally {
          if (isMounted) {
            setIsLoadingTask(false);
          }
        }
      };
      fetchTask();
    }
    
    return () => {
      isMounted = false;
    };
  }, [id, taskid]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setLoading(true)
    try {
      const cleanTask = {
        ...task,
        taskGiven: DOMPurify.sanitize(task.taskGiven, { ALLOWED_TAGS: [] }),
        objective: DOMPurify.sanitize(task.objective, { ALLOWED_TAGS: [] }),
        remark: DOMPurify.sanitize(task.remark, { ALLOWED_TAGS: [] }),
      };
      if (isEdit && isTaskEdit) {
        const response = await api.put(`${BASE_URL}/api/daily_reports/update_report/${id}/${taskid}`, cleanTask)
        if (response.status === 200) {
          toast.success("Task updated successfully")
          navigate(-1); // Navigate back after successful update
        }
      } else {
        const response = await api.post(`${BASE_URL}/api/daily_reports/create`, cleanTask)
        if (response.status === 201) {
          toast.success("Task created successfully")
        }
        setTask({
          concernedDepartment: "",
          date: "",
          objective: "",
          remark: "",
          status: "",
          taskGiven: "",
          taskGivenBy: ""
        })
        setResetCounter(prev => prev + 1)
      }
    } catch (error) {
      console.error(error)
      toast.error("Error saving task. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleQuillChange = (field: string, value: string) => {
    setTask({ ...task, [field]: value })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={18} className="text-green-500" />;
      case "In Progress":
        return <Clock size={18} className="text-yellow-500" />;
      case "Pending":
        return <AlertCircle size={18} className="text-red-500" />;
      default:
        return <FileText size={18} className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit && isTaskEdit ? "Edit Task" : "Create Daily Report"}
              </h1>
              <p className="text-gray-600 mt-2">
                {isEdit && isTaskEdit
                  ? "Update your task details below"
                  : "Fill in the details to create a new daily task report"}
              </p>
            </div>

            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText size={32} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
            <h2 className="text-xl font-semibold">Task Information</h2>
            <p className="text-blue-100">Please provide all required information</p>
          </div>

          <div className="p-6 space-y-6">
            {isLoadingTask ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-4 text-gray-600">Loading task data...</span>
              </div>
            ) : (
              <>
                {/* Basic Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date */}
                  <div className="form-group">
                    <label htmlFor="date" className="form-label !flex items-center ">
                      <Calendar size={18} className="mr-2 text-gray-500" />
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      className={`form-input ${formErrors.date ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                      value={task.date || ""}
                      onChange={handleInputChange}
                      required
                    />
                    {formErrors.date && <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>}
                  </div>

                  {/* Concerned Department */}
                  <div className="form-group">
                    <label htmlFor="concernedDepartment" className="form-label !flex items-center">
                      <Building size={18} className="mr-2 text-gray-500" />
                      Concerned Department *
                    </label>
                    <select
                      id="concernedDepartment"
                      name="concernedDepartment"
                      className={`form-input ${formErrors.concernedDepartment ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                      value={task.concernedDepartment || ""}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {department.map((dept:any) => (
                        <option key={dept._id} value={dept?.name}>
                          {dept?.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.concernedDepartment && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.concernedDepartment}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="form-group">
                    <label htmlFor="status" className="form-label !flex items-center">
                      <HiOutlineStatusOnline size={18} className="mr-2" />
                      Status *
                    </label>
                    <div className="relative">
                      <select
                        id="status"
                        name="status"
                        className={`form-input pl-10 ${formErrors.status ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                        value={task.status || ""}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <div className="absolute inset-y-0 left-28 flex items-center pointer-events-none ">
                        {task.status ? getStatusIcon(task.status) : <FileText size={18} className="text-gray-400" />}
                      </div>
                    </div>
                    {formErrors.status && <p className="mt-1 text-sm text-red-600">{formErrors.status}</p>}
                  </div>

                  {/* Task Given By */}
                  <div className="form-group">
                    <label htmlFor="taskGivenBy" className="form-label !flex items-center">
                      <User size={18} className="mr-2 text-gray-500" />
                      Task Given By *
                    </label>
                    <input
                      type="text"
                      id="taskGivenBy"
                      name="taskGivenBy"
                      className={`form-input ${formErrors.taskGivenBy ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""} `}
                      value={task.taskGivenBy || ""}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter name or email"
                    />
                    {formErrors.taskGivenBy && <p className="mt-1 text-sm text-red-600">{formErrors.taskGivenBy}</p>}
                  </div>
                </div>

                {/* Rich Text Editors */}
                <div className="space-y-6">
                  {/* Task Given */}
                  <div className="form-group">
                    <label htmlFor="taskGiven" className="form-label !flex !items-center gap-2 text-gray-700"
                    >
                      <FileText size={18} className="mr-2 text-gray-500" />
                      Task Given *
                    </label>
                    <div className={`border rounded-lg ${formErrors.taskGiven ? "border-red-300" : "border-gray-300"}`}>
                      <ReactQuill
                        key={resetCounter + "-taskGiven"}
                        theme="snow"
                        value={task.taskGiven}
                        onChange={(value) => handleQuillChange("taskGiven", value)}
                        placeholder="Describe the task in detail..."
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['link', 'clean']
                          ]
                        }}
                      />
                    </div>
                    {formErrors.taskGiven && <p className="mt-1 text-sm text-red-600">{formErrors.taskGiven}</p>}
                  </div>

                  {/* Objective */}
                  <div className="form-group">
                    <label htmlFor="objective" className="form-label !flex !items-center gap-2 text-gray-700">
                      <Target size={18} className="mr-2 text-gray-500" />
                      Objective *
                    </label>
                    <div className={`border rounded-lg ${formErrors.objective ? "border-red-300" : "border-gray-300"}`}>
                      <ReactQuill
                        key={resetCounter + "-objective"}
                        theme="snow"
                        value={task.objective}
                        onChange={(value) => handleQuillChange("objective", value)}
                        placeholder="What is the goal or objective of this task?"
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['link', 'clean']
                          ]
                        }}
                      />
                    </div>
                    {formErrors.objective && <p className="mt-1 text-sm text-red-600">{formErrors.objective}</p>}
                  </div>

                  {/* Remark */}
                  <div className="form-group">
                    <label htmlFor="remark" className="form-label !flex !items-center gap-2 text-gray-700"
                    >
                      <MessageSquare size={18} className="mr-2 text-gray-500" />
                      Remark *
                    </label>
                    <div className={`border rounded-lg ${formErrors.remark ? "border-red-300" : "border-gray-300"}`}>
                      <ReactQuill
                        key={resetCounter + "-remark"}
                        theme="snow"
                        value={task.remark}
                        onChange={(value) => handleQuillChange("remark", value)}
                        placeholder="Add any additional remarks or comments..."
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['link', 'clean']
                          ]
                        }}
                      />
                    </div>
                    {formErrors.remark && <p className="mt-1 text-sm text-red-600">{formErrors.remark}</p>}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Form Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              * indicates required fields
            </div>
            <button
              type="submit"
              disabled={loading || isLoadingTask}
              className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  {isEdit && isTaskEdit ? "Update Task" : "Save Task"}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Tips for effective task reporting:</h3>
          <ul className="text-blue-700 text-sm list-disc list-inside space-y-1">
            <li>Be specific and detailed in your task descriptions</li>
            <li>Set clear objectives that are measurable</li>
            <li>Update status regularly to keep stakeholders informed</li>
            <li>Use remarks to document challenges or additional context</li>
          </ul>
        </div>
      </div>

      <style>{`
        .form-label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .form-input {
          display: block;
          width: 100%;
          padding: 0.625rem;
          border: 1px solid #D1D5DB;
          border-radius: 0.5rem;
          color: #111827;
          background-color: white;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-group {
          margin-bottom: 0;
        }
        
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: #D1D5DB;
        }
        
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: #D1D5DB;
          min-height: 120px;
          font-family: inherit;
        }
        
        .ql-editor {
          min-height: 120px;
        }
      `}</style>
    </div>
  )
}