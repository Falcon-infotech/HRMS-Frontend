import { useEffect, useRef, useState } from "react"
import api from "../constants/axiosInstance"
import { API, BASE_URL } from "../constants/api"
import toast from "react-hot-toast"
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import { useParams } from "react-router-dom";

type Task = {
  date: string
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

  const isEdit = !!id;
  const isTaskEdit = !!taskid;
  // ✅ Form state
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

  const loaddepartments = async () => {
    try {
      const response = await api.get(`${BASE_URL}/api/employee/department`,);
      setDepartment(response.data.data);
      // console.log(response.data.data)
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }

  const [formErrors, setFormErrors] = useState<TaskErrors>({})
  const [resetCounter, setResetCounter] = useState(0)

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
    if (isEdit && isTaskEdit) {
      const fetchTask = async () => {
        try {
          const response = await api.get(`${BASE_URL}/api/daily_reports/${id}`);
          const report = response.data.report;
          const match = report.reports.find((item: any) => item._id === taskid);
          setTask({
            date: match.date,
            taskGiven: match.taskGiven,
            taskGivenBy: match.taskGivenBy,
            concernedDepartment: match.concernedDepartment,
            objective: match.objective,
            remark: match.remark,
            status: match.status,
          });
          // console.log(match)
        } catch (error) {
          console.error("Error fetching task:", error);
        }
      };
      fetchTask();
    }
  }, [id, taskid])

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
          toast.success("task updated successfully")
        }
      } else {
        const response = await api.post(`${BASE_URL}/api/daily_reports/create`, cleanTask)
        if (response.status === 201) {
          toast.success("task created successfully")

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
        setResetCounter(pre => prev + 1)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const handleQuillChange = (field: string, value: string) => {

    setTask({ ...task, [field]: value })
  }



  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium text-neutral-800 mb-4">Task Information</h3>
            {/* <div className="flex gap-5 max-sm:flex-col">
              <button type="button" onClick={handleView} className="btn btn-primary flex items-center">View Reports</button>
              <button type="button" className="btn btn-primary flex items-center">Export Reports</button>
            </div> */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Date */}
            <div className="form-group">
              <label htmlFor="date" className="form-label">Date *</label>
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
              <label htmlFor="concernedDepartment" className="form-label">
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

                {department.map((debt) => (
                  <option key={debt._id} value={debt?.name}>
                    {debt?.name}
                  </option>
                ))}
              </select>

              {formErrors.concernedDepartment && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.concernedDepartment}
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="status" className="form-label">Status *</label>
              <select
                id="status"
                name="status"
                className={`form-input ${formErrors.status ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                value={task.status || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="In Progress">In Progress </option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              {formErrors.status && <p className="mt-1 text-sm text-red-600">{formErrors.status}</p>}
            </div>


            {/* Task Given By */}
            <div className="form-group">
              <label htmlFor="taskGivenBy" className="form-label">Task Given By *</label>
              <input
                type="text"
                id="taskGivenBy"
                name="taskGivenBy"
                className={`form-input ${formErrors.taskGivenBy ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                value={task.taskGivenBy || ""}
                onChange={handleInputChange}
                required
              />
              {formErrors.taskGivenBy && <p className="mt-1 text-sm text-red-600">{formErrors.taskGivenBy}</p>}
            </div>

          </div>
          <div className="my-6 grid grid-cols-1 gap-6">
            {/* Task Given */}
            <div className="form-group">
              <label htmlFor="taskGiven" className="form-label">Task Given *</label>
              <ReactQuill
                key={resetCounter + "-taskGiven"}
                theme="snow"
                value={task.taskGiven ? `<p>${task.taskGiven}</p>` : ""}
                onChange={(value) => handleQuillChange("taskGiven", value)}
                placeholder="Write something here..."
              />
              {formErrors.taskGiven && <p className="mt-1 text-sm text-red-600">{formErrors.taskGiven}</p>}
            </div>

            {/* Objective */}
            <div className="form-group ">
              <label htmlFor="objective" className="form-label">Objective *</label>
              <ReactQuill
                key={resetCounter + "-objective"}
                theme="snow"
                value={task.objective ? `<p>${task.objective}</p>` : ""}
                onChange={(value) => handleQuillChange("objective", value)}
                placeholder="Write something here..."
              />
              {formErrors.objective && <p className="mt-1 text-sm text-red-600">{formErrors.objective}</p>}
            </div>

            {/* Remark */}
            <div className="form-group ">
              <label htmlFor="remark" className="form-label">Remark</label>
              <ReactQuill
                key={resetCounter + "-remark"}
                theme="snow"
                value={task.remark ? `<p>${task.remark}</p>` : ""}
                onChange={(value) => handleQuillChange("remark", value)}
                placeholder="Write something here..."
              />
              {formErrors.remark && <p className="mt-1 text-sm text-red-600">{formErrors.remark}</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving Task" : "Save Task"}
          </button>
        </div>
      </form>

    </>
  )
}


