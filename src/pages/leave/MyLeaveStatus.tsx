import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../constants/api';
import Loading from '../../components/Loading';

const MyLeaveStatus = () => {
    const [leaveData, setLeaveData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaveData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/leaves/my_leaves`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('tokenId')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLeaveData(data.data || []);
            } catch (error) {
                console.error('Error fetching leave data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaveData();
    }, []);

    return (
        <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">My Leave Status</h2>

            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Loading text={"Loading leave status..."} />
                </div>
            ) : leaveData.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    You have not applied for any leave yet.
                </div>
            ) : (
                <div className="overflow-y-auto max-h-[500px] border rounded">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100 text-gray-700 text-sm sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-2 text-left">Leave Type</th>
                                <th className="px-4 py-2 text-left">From</th>
                                <th className="px-4 py-2 text-left">To</th>
                                <th className="px-4 py-2 text-left">Days</th>
                                <th className="px-4 py-2 text-left">Reason</th>
                                <th className="px-4 py-2 text-left">Applied At</th>
                                <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaveData
                                .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
                                .map((leave) => (
                                    <tr key={leave._id} className="border-t hover:bg-gray-50 text-sm">
                                        <td className="px-4 py-2 capitalize">{leave.leaveType}</td>
                                        <td className="px-4 py-2">{new Date(leave.fromDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{new Date(leave.toDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{leave.leaveTaken}</td>
                                        <td className="px-4 py-2">{leave.reason}</td>
                                        <td className="px-4 py-2">{new Date(leave.appliedAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">
                                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                  ${leave.status === 'approved'
                                                    ? 'bg-green-100 text-green-700'
                                                    : leave.status === 'rejected'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

export default MyLeaveStatus;
