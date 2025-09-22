import React, { useEffect, useState } from 'react'
import HolidayForm from '../../components/HolidayForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Edit2, PlusCircle, Trash2, Calendar, MapPin, Filter, Download, ChevronDown, ChevronUp, X } from 'lucide-react';
import { BASE_URL } from '../../constants/api';
import Loading from '../../components/Loading';
import axios from '../../constants/axiosInstance';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

const Holiday = () => {
    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { user: Users } = useSelector((state: RootState) => state.auth);
    const [holidays, setHolidays] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredHolidays, setFilteredHolidays] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [monthFilter, setMonthFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("all");
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [itemToDelete, setItemToDelete] = useState()
    const [isDeleting, setIsDeleting] = useState(false)


    const { user } = useSelector((state: RootState) => state.auth)

    const fetchHolidays = async (flag?: boolean) => {
        try {
            if (flag) setLoading(true);
            let response;
            if (selectedBranch === "all") {
                response = await axios.get(`${BASE_URL}/api/holidays/holidays_by_user`);
                setHolidays(response.data.holidays || []);
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
            // console.log(response.data)
            setBranches(response.data.branches || []);
        } catch (error) {
            console.error("Error fetching branches", error);
        }
    };

    useEffect(() => {
        fetchHolidays();
        if (user?.role === "admin") {
            fetchBranches();
        }
    }, []);

    useEffect(() => {
        if (selectedBranch) {
            fetchHolidays();
        }
    }, [selectedBranch]);

    useEffect(() => {
        let result = holidays;

        // Apply search filter
        if (searchTerm) {
            result = result.filter(holiday =>
                holiday.reason.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply year filter
        result = result.filter(holiday => {
            const holidayYear = new Date(holiday.date).getFullYear();
            return holidayYear === yearFilter;
        });

        // Apply month filter
        if (monthFilter !== "all") {
            result = result.filter(holiday => {
                const holidayMonth = new Date(holiday.date).getMonth() + 1;
                return holidayMonth === parseInt(monthFilter);
            });
        }

        // Apply type filter
        if (typeFilter !== "all") {
            result = result.filter(holiday => {
                if (typeFilter === "optional") return holiday.isOptional;
                if (typeFilter === "fixed") return !holiday.isOptional;
                return true;
            });
        }

        setFilteredHolidays(result);
    }, [holidays, searchTerm, yearFilter, monthFilter, typeFilter]);

    const handleDeleteHoliday = async (id: string) => {

        try {
            setIsDeleting(true)
            await axios.delete(`${BASE_URL}/api/holidays/delete_holiday/${id}`);
            fetchHolidays(false);
        } catch (error) {
            console.error("Error deleting holiday:", error);
        } finally {
            setIsDeleting(false)
            setIsOpen(false)
        }

    };
    const onConfirm = () => {
        handleDeleteHoliday(itemToDelete!?._id)
    }
    const getHolidayStats = () => {
        const totalHolidays = filteredHolidays.length;
        const fixedHolidays = filteredHolidays.filter(h => !h.isOptional).length;
        const optionalHolidays = filteredHolidays.filter(h => h.isOptional).length;

        return { totalHolidays, fixedHolidays, optionalHolidays };
    };
    const CloseModal = () => {
        setIsOpen(false)
    }
    const stats = getHolidayStats();
    const months = [
        { value: "all", label: "All Months" },
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className=" mx-auto">
                {/* Header */}
                {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Holiday Calendar</h1>
                        <p className="text-gray-500 mt-1">Manage and view all holidays in your organization</p>
                    </div>

                    {(Users?.role === 'admin' || Users?.role === 'hr') && (
                        <button
                            onClick={() => {
                                setSelectedHoliday(null);
                                setIsEditMode(false);
                                setIsFormOpen(true);
                            }}
                            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm"
                        >
                            <PlusCircle className="w-5 h-5 mr-1" />
                            Add Holiday
                        </button>
                    )}
                </div> */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Holiday Calendar</h1>
                            <p className="text-blue-100 mt-2">Manage and view all holidays in your organization</p>
                        </div>
                        <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                            {(Users?.role === 'admin' || Users?.role === 'hr') && (
                                <button
                                    onClick={() => {
                                        setSelectedHoliday(null);
                                        setIsEditMode(false);
                                        setIsFormOpen(true);
                                    }}
                                    // className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm"
                                    className='flex gap-2 items-center'
                                >
                                    <PlusCircle className="w-5 h-5 mr-1" />
                                    Add Holiday
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Holidays</p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalHolidays}</h3>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Fixed Holidays</p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.fixedHolidays}</h3>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Optional Holidays</p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.optionalHolidays}</h3>
                            </div>
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <Calendar className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="relative w-full sm:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search holidays..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    <Filter className="w-5 h-5 mr-1" />
                                    Filters
                                    {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                                </button>

                                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                    <Download className="w-5 h-5 mr-1" />
                                    Export
                                </button>
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                    <select
                                        value={yearFilter}
                                        onChange={(e) => setYearFilter(parseInt(e.target.value))}
                                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                                    <select
                                        value={monthFilter}
                                        onChange={(e) => setMonthFilter(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {months.map(month => (
                                            <option key={month.value} value={month.value}>{month.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="fixed">Fixed Holidays</option>
                                        <option value="optional">Optional Holidays</option>
                                    </select>
                                </div>
                            

                                {(Users?.role === 'admin' || Users?.role === 'hr') && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                                        <select
                                            value={selectedBranch}
                                            onChange={(e) => setSelectedBranch(e.target.value)}
                                            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="all">All Branches</option>
                                            {branches.map((branch) => (
                                                <option key={branch._id} value={branch._id}>
                                                    {branch?.branchName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Holidays Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
                        <Loading text="Loading holidays..." />
                    </div>
                ) : filteredHolidays.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No holidays found</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm || yearFilter !== currentYear || monthFilter !== "all" || typeFilter !== "all"
                                ? "Try adjusting your filters to see more results"
                                : "Get started by adding your first holiday"}
                        </p>
                        {(Users?.role === 'admin' || Users?.role === 'hr') && (
                            <button
                                onClick={() => {
                                    setSelectedHoliday(null);
                                    setIsEditMode(false);
                                    setIsFormOpen(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
                            >
                                <PlusCircle className="w-5 h-5 mr-1" />
                                Add Holiday
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredHolidays.map((holiday) => {
                            const dateObj = new Date(holiday.date);
                            const day = dateObj.getDate();
                            const month = dateObj.toLocaleString("default", { month: "short" });
                            const year = dateObj.getFullYear();
                            const weekday = dateObj.toLocaleString("default", { weekday: "short" });
                            const isPast = dateObj < new Date();

                            return (
                                <div
                                    key={holiday._id}
                                    className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-300 flex flex-col relative overflow-hidden ${isPast ? "opacity-80" : "border-gray-200"
                                        } ${holiday.isOptional ? "border-amber-200" : "border-blue-200"}`}
                                >
                                    {/* Decorative element based on holiday type */}
                                    <div className={`absolute top-0 left-0 w-full h-1 ${holiday.isOptional ? "bg-amber-400" : "bg-blue-500"}`}></div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-lg ${holiday.isOptional ? "bg-amber-100" : "bg-blue-100"}`}>
                                            <Calendar className={`w-5 h-5 ${holiday.isOptional ? "text-amber-600" : "text-blue-600"}`} />
                                        </div>

                                        {(Users?.role === "admin" || Users?.role === "hr") && (
                                            <div className="flex gap-1">
                                                <button
                                                    title="Edit"
                                                    onClick={() => {
                                                        setSelectedHoliday(holiday);
                                                        setIsEditMode(true);
                                                        setIsFormOpen(true);
                                                    }}
                                                    className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 transition duration-200"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    title="Delete"
                                                    onClick={() => {
                                                        setItemToDelete(holiday)
                                                        setIsOpen(true)
                                                    }}
                                                    className="p-1.5 rounded-md bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition duration-200"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                                            {holiday.reason}
                                        </h3>

                                        <div className="flex items-center text-sm text-gray-500 mb-1"> <MapPin className="w-4 h-4 mr-1" /> {holiday.branch ? branches.find((b) => b._id === holiday.branch)?.branchName : "Unknown Branch"} </div>
                                        {holiday.isOptional && (
                                            <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full mb-3">
                                                Optional Holiday
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <div className="text-2xl font-bold text-gray-800">{day}</div>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500">{weekday}</div>
                                                <div className="text-sm font-medium text-gray-700">{month} {year}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Holiday Form Modal */}
                {isFormOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setIsFormOpen(false)}
                    >
                        <div
                            className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                {isEditMode ? "Edit Holiday" : "Add New Holiday"}
                            </h2>

                            <HolidayForm
                                isEdit={isEditMode}
                                holidayId={selectedHoliday?._id}
                                existingData={selectedHoliday}
                                onSuccess={() => {
                                    setIsFormOpen(false);
                                    fetchHolidays();
                                }}
                                onCancel={() => setIsFormOpen(false)}
                            />
                        </div>
                    </div>
                )}


                {
                    isOpen && (
                        <DeleteConfirmationModal
                            isOpen={open}
                            onClose={CloseModal}
                            onConfirm={onConfirm}
                            title="Delete Employee Record"
                            description="This will permanently delete the Holiday record from the system."
                            itemName={itemToDelete?.reason}
                            confirmText="Yes, Delete"
                            cancelText="No, Keep It"
                            isLoading={isDeleting}
                        />
                    )
                }
            </div>
        </div>
    );
};

export default Holiday;