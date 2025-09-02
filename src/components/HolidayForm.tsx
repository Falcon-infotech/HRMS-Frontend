import { useEffect, useState } from "react";
import axios from "../constants/axiosInstance";
import { BASE_URL } from "../constants/api";

const HolidayForm = ({ isEdit = false, existingData = {}, holidayId = null, onSuccess }) => {
    const safeExistingData = existingData || {};
    const [branches, setBranches] = useState([]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const [formData, setFormData] = useState({
        date: formatDate(safeExistingData.date) || "",
        reason: safeExistingData.reason || "",
        isOptional: safeExistingData?.isOptional || false,
        branch: safeExistingData?.branch || "",
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`${BASE_URL}/api/holidays/edit_holiday/${holidayId}`, formData,);
            } else {
                await axios.post(`${BASE_URL}/api/holidays/add_custom_holiday`, formData,);
            }
            onSuccess?.();
        } catch (error) {
            console.error("Error saving holiday", error);
        }
    };


    useEffect(() => {
        const fetchBranch = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/branch`);
                setBranches(response.data.branches);
            } catch (error) {
                console.error("Error fetching branches", error);
            }
        };
        fetchBranch();
    }, []);

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md space-y-4 w-full max-w-md mx-auto sm:mx-0"
        >
            <h3 className="text-xl font-bold text-gray-800 text-center sm:text-left">
                {isEdit ? "Update Holiday" : "Add Custom Holiday"}
            </h3>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Date <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Reason <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="reason"
                    required
                    placeholder="e.g. Independence Day"
                    value={formData.reason}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className=" flex flex-col">
                <label htmlFor="">Branch</label>
                <select className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" name="branch" value={formData.branch} onChange={handleChange}
                >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                        <option key={branch.id} value={branch._id}>
                            {branch?.branchName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Optional <span className="text-red-500">*</span>
                </label>
                <input
                    type="checkbox"
                    name="isOptional"
                    checked={formData.isOptional}
                    onChange={handleChange}
                    // className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    className="w-10 h-4"
                />
            </div>


            <div className="flex justify-center sm:justify-end">
                <button
                    type="submit"
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded"
                >
                    {isEdit ? "Update" : "Add"} Holiday
                </button>
            </div>
        </form>

    );
};

export default HolidayForm;
