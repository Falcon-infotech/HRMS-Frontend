import { useEffect, useState } from "react";
import axios from "../constants/axiosInstance";
import { BASE_URL } from "../constants/api";

const HolidayForm = ({ isEdit = false, existingData = {}, holidayId = null, onSuccess }) => {
    const safeExistingData = existingData || {};


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
        reason: safeExistingData.reason || ""
    });


    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    useEffect(() => {
        console.log(formData)
    }, [])

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
