import React, { useEffect, useState } from 'react'
import HolidayForm from '../../components/HolidayForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Edit2, PlusCircle, Trash2 } from 'lucide-react';
import { BASE_URL } from '../../constants/api';
import Loading from '../../components/Loading';
import axios from '../../constants/axiosInstance';

const Holiday = () => {
    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { user: Users } = useSelector((state: RootState) => state.auth);
    const [holidays, setHolidays] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [branches, setBranches] = useState([]); // dropdown list
    const [selectedBranch, setSelectedBranch] = useState("all");

    const fetchHolidays = async () => {
        try {
            setLoading(true);
            let response;
            if (selectedBranch === "all") {
                response = await axios.get(`${BASE_URL}/api/holidays/all_holidays`);
                setHolidays(response.data.data || []);
            } else {
                response = await axios.get(`${BASE_URL}/api/holidays/holidays_by_branch/${selectedBranch}`);
                setHolidays(response.data.holidays || []);
            }
        } catch (error) {
            console.error('Error fetching holidays', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/branch`);
            setBranches(response.data.branches || []);
        } catch (error) {
            console.error("Error fetching branches", error);
        }
    };

    useEffect(() => {
        fetchHolidays();
        fetchBranches();
    }, []);

    useEffect(() => {
        if (selectedBranch) {
            fetchHolidays();
        }
    }, [selectedBranch]);

    const handleDeleteHoliday = async (id: string) => {
        try {
            await axios.delete(`${BASE_URL}/api/holidays/delete_holiday/${id}`);
            fetchHolidays();
        } catch (error) {
            console.error("Error deleting holiday:", error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-3xl">🎉</span>
                    <p>All Holidays</p>
                </div>

                {(Users?.role === 'admin' || Users?.role === 'hr') && (
                    <button
                        onClick={() => {
                            setSelectedHoliday(null);
                            setIsEditMode(false);
                            setIsFormOpen(true);
                        }}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition duration-200"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>Add</span>
                    </button>
                )}
            </h2>

            {(Users?.role === 'admin' || Users?.role === 'hr') && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Branch
                    </label>
                    <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">-- All Holidays --</option>
                        {branches.map((branch) => (
                            <option key={branch._id} value={branch._id}>
                                {branch.branchName}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* ✅ Only holidays section shows loader */}
            <div className="relative h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loading text="Loading Holidays..." />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {holidays.length === 0 ? (
                            <div className="col-span-3 text-center text-gray-500">
                                No holidays found.
                            </div>
                        ) : (
                            holidays.map((holiday) => {
                                const dateObj = new Date(holiday.date);
                                const day = dateObj.getDate();
                                const month = dateObj.toLocaleString("default", { month: "short" });
                                const weekday = dateObj.toLocaleString("default", { weekday: "long" });

                                return (
                                    <div
                                        key={holiday._id}
                                        className="bg-white border border-gray-200 rounded-2xl p-5 shadow hover:shadow-lg transition duration-300 flex flex-col justify-between relative"
                                    >
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                {holiday.reason}{" "}
                                                <span className="text-green-500 text-xs">
                                                    {holiday.isOptional ? "(Optional)" : ""}
                                                </span>
                                            </h3>
                                            <p className="text-gray-500 text-sm mb-1">
                                                {`${day} - ${month}, ${weekday}`}
                                            </p>
                                        </div>

                                        {(Users?.role === "admin" || Users?.role === "hr") && (
                                            <div className="absolute top-3 right-3 flex flex-col gap-2 items-center">
                                                <button
                                                    title="Delete"
                                                    onClick={() => handleDeleteHoliday(holiday._id)}
                                                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition duration-200"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    title="Edit"
                                                    onClick={() => {
                                                        setSelectedHoliday(holiday);
                                                        setIsEditMode(true);
                                                        setIsFormOpen(true);
                                                    }}
                                                    className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 transition duration-200"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {isFormOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setIsFormOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <HolidayForm
                            isEdit={isEditMode}
                            holidayId={selectedHoliday?._id}
                            existingData={selectedHoliday}
                            onSuccess={() => {
                                setIsFormOpen(false);
                                fetchHolidays();
                            }}
                        />
                        <button
                            onClick={() => setIsFormOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            aria-label="Cancel"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Holiday;
