import { useEffect, useState } from "react"
import api from "../constants/axiosInstance"
import { API, BASE_URL } from "../constants/api"
import toast from "react-hot-toast"

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
  const [isOpen, setIsOpen] = useState(false)

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
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setLoading(true)
    try {
      const response = await api.post(`${BASE_URL}/api/daily_reports/create`, task)
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
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }


  // const handleView=async()=>{
  //   setIsOpen(true)
  //   try {
  //     const response=await api.get(`${BASE_URL}/api/daily_reports/all`)
  //     const data=response.data
  //     console.log(data)
  //   } catch (error) {
      
  //   }
  // }

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
                value={task.date}
                onChange={handleInputChange}
                required
              />
              {formErrors.date && <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>}
            </div>

            {/* Task Given */}
            <div className="form-group">
              <label htmlFor="taskGiven" className="form-label">Task Given *</label>
              <textarea
                id="taskGiven"
                name="taskGiven"
                className={`form-input ${formErrors.taskGiven ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                value={task.taskGiven}
                onChange={handleInputChange}
                required
                rows={1}
              />
              {formErrors.taskGiven && <p className="mt-1 text-sm text-red-600">{formErrors.taskGiven}</p>}
            </div>

            {/* Task Given By */}
            <div className="form-group">
              <label htmlFor="taskGivenBy" className="form-label">Task Given By *</label>
              <input
                type="text"
                id="taskGivenBy"
                name="taskGivenBy"
                className={`form-input ${formErrors.taskGivenBy ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                value={task.taskGivenBy}
                onChange={handleInputChange}
                required
              />
              {formErrors.taskGivenBy && <p className="mt-1 text-sm text-red-600">{formErrors.taskGivenBy}</p>}
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
                value={task.concernedDepartment}
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



            {/* Objective */}
            <div className="form-group ">
              <label htmlFor="objective" className="form-label">Objective *</label>
              <textarea
                id="objective"
                name="objective"
                className={`form-input ${formErrors.objective ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                rows={2}
                value={task.objective}
                onChange={handleInputChange}
                required
              />
              {formErrors.objective && <p className="mt-1 text-sm text-red-600">{formErrors.objective}</p>}
            </div>

            {/* Remark */}
            <div className="form-group ">
              <label htmlFor="remark" className="form-label">Remark</label>
              <textarea
                id="remark"
                name="remark"
                className="form-input"
                rows={2}
                value={task.remark}
                onChange={handleInputChange}
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label htmlFor="status" className="form-label">Status *</label>
              <select
                id="status"
                name="status"
                className={`form-input ${formErrors.status ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                value={task.status}
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
      {/* {
        isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setIsOpen(false)}>
          </div>
        )
      }
       <div
        className={`fixed top-0 right-0 h-full w-1/2 max-sm:w-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Designation Details</h2>
          <button
            onClick={() => {
              setIsOpen(false)
            }}
            className="text-gray-600 hover:text-red-500 text-xl font-bold"
          >
            &times;
          </button>
        </div>

       
      </div> */}
    </>
  )
}


