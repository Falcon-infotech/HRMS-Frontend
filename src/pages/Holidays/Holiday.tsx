import React, { useEffect, useState } from 'react'
import HolidayForm from '../../components/HolidayForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Edit2, PlusCircle, Trash2 } from 'lucide-react';
import { BASE_URL } from '../../constants/api';
import Loading from '../../components/Loading';

const Holiday = () => {

    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { user: Users } = useSelector((state: RootState) => state.auth);
    const [holidays, setHolidays] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    const fetchHolidays = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/api/holidays/all_holidays`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
                }
            });


            const data = await response.json();
            // console.log(data.data)
            setHolidays(data.data || [])
        } catch (error) {
            console.error('Error fetching holidays', error);
        }finally {
            setLoading(false);
            }

    }


    useEffect(() => {
        fetchHolidays();
    }, [])

    const handleDeleteHoliday = async (id: string) => {
        try {
            await axios.delete(`${BASE_URL}/api/holidays/delete_holiday/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
                }
            });
            fetchHolidays();
        } catch (error) {
            console.error("Error deleting holiday:", error);
        }
    };

    if (loading) {
        return (
            // <div className="flex items-center justify-center h-screen">
            //     <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            // </div>
            <>
            <Loading text={"Loading Holidays..."}/>
            </>
        );
    }

    return (
        <>

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


                <div className="relative h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {holidays.map((holiday) => {
                            const dateObj = new Date(holiday.date);
                            const day = dateObj.getDate();
                            const month = dateObj.toLocaleString('default', { month: 'short' });
                            const weekday = dateObj.toLocaleString('default', { weekday: 'long' });

                            return (
                                <div
                                    key={holiday.date}
                                    className="bg-white border border-gray-200 rounded-2xl p-5 shadow hover:shadow-lg transition duration-300 flex flex-col justify-between relative"
                                >
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">{holiday.reason}</h3>

                                        <p className="text-gray-500 text-sm mb-1">
                                            {`${day} - ${month}, ${weekday}`}
                                        </p>
                                    </div>
                                    <div>
                                        {(Users?.role === 'admin' || Users?.role === 'hr') && (
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
                                </div>
                            );

                        })}
                    </div>
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
                            {/* Cancel button below form or top right */}
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


        </>
    )
}

export default Holiday