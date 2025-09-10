import { useEffect, useState } from "react";
import axios from "../constants/axiosInstance";
import { BASE_URL } from "../constants/api";
import { 
  Calendar, 
  MapPin, 
  Info, 
  X, 
  Save, 
  Edit3,
  ChevronDown,
  AlertCircle
} from "lucide-react";

const HolidayForm = ({ isEdit = false, existingData = {}, holidayId = null, onSuccess, onCancel }) => {
    const safeExistingData = existingData || {};
    const [branches, setBranches] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        
        // Clear error when field is updated
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.date) {
            newErrors.date = "Date is required";
        } else {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                newErrors.date = "Cannot select a past date";
            }
        }
        
        if (!formData.reason.trim()) {
            newErrors.reason = "Reason is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        try {
            if (isEdit) {
                await axios.put(`${BASE_URL}/api/holidays/edit_holiday/${holidayId}`, formData);
            } else {
                await axios.post(`${BASE_URL}/api/holidays/add_custom_holiday`, formData);
            }
            onSuccess?.();
        } catch (error) {
            console.error("Error saving holiday", error);
            setErrors({ submit: error.response?.data?.message || "Failed to save holiday. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/branch`);
                setBranches(response.data.branches || []);
            } catch (error) {
                console.error("Error fetching branches", error);
            }
        };
        fetchBranches();
    }, []);

    const getDayOfWeek = (dateStr) => {
        if (!dateStr) return "";
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date(dateStr);
        return days[date.getDay()];
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
                className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${isEdit ? "bg-blue-100" : "bg-green-100"}`}>
                            <Calendar className={`w-5 h-5 ${isEdit ? "text-blue-600" : "text-green-600"}`} />
                        </div>
                        <h2 className="ml-3 text-xl font-bold text-gray-800">
                            {isEdit ? "Update Holiday" : "Add New Holiday"}
                        </h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{errors.submit}</p>
                        </div>
                    )}

                    {/* Date Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className={`w-full border ${errors.date ? "border-red-300" : "border-gray-300"} rounded-lg px-3 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        {formData.date && (
                            <p className="text-sm text-gray-500 mt-1">
                                {getDayOfWeek(formData.date)}
                            </p>
                        )}
                        {errors.date && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {errors.date}
                            </p>
                        )}
                    </div>

                    {/* Reason Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reason <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="reason"
                            required
                            placeholder="e.g., Independence Day, Company Anniversary"
                            value={formData.reason}
                            onChange={handleChange}
                            className={`w-full border ${errors.reason ? "border-red-300" : "border-gray-300"} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.reason && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {errors.reason}
                            </p>
                        )}
                    </div>

                    {/* Branch Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Branch
                        </label>
                        <div className="relative">
                            <select 
                                name="branch" 
                                value={formData.branch} 
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Branches</option>
                                {branches.map((branch) => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch?.branchName}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Optional Holiday Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                <Info className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Optional Holiday
                                </label>
                                <p className="text-xs text-gray-500">
                                    Employees can choose to take this day off or work
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isOptional"
                                checked={formData.isOptional}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            ) : isEdit ? (
                                <Edit3 className="w-4 h-4 mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {isEdit ? "Update" : "Add"} Holiday
                        </button>
                    </div>
                </form>

                {/* Info Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-start">
                        <Info className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-xs text-gray-500">
                            Holidays added here will be visible to all employees in the selected branch. 
                            Optional holidays allow employees to choose whether to take the day off.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HolidayForm;