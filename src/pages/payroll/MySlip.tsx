import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { BASE_URL } from '../../constants/api';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import { ArrowUpDown } from 'lucide-react';

const MySlip = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [data,setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const token = localStorage.getItem('accessToken');
  useEffect(() => {
    let fetchPayslips =async () => {
      try {
        setLoading(true);
        const resonse =await fetch(`${BASE_URL}/api/payroll/get_singleUser_payroll_data/${user._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const data=await resonse.json();
        console.log(data)
        setData(data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setLoading(false);
      }
    }

    fetchPayslips();
  }, [user?._id]);
  
  return (
    <div>
      <div className="overflow-x-auto">
          <table className="table">
            <thead>
              {loading ? (
                <tr>
                  <th colSpan={8} className="text-center text-neutral-500 py-4">
                    Loading payroll data...
                  </th>
                </tr>
              ) : data.length > 0 ? (
                <tr>
                  <th>
                    <div className="flex items-center">
                      Bank-Name <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Month <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Basic-Salary <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Gross-Salary <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Net-Salary <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Payment-Method <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center">
                      Status <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                    </div>
                  </th>
                  <th>Actions</th>
                </tr>
              ) : (
                <tr>
                  <th colSpan={8} className="text-center text-neutral-500 py-4">
                    No payroll data available for the selected filters
                  </th>
                </tr>
              )}
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6">
                    <Loading text="Loading payroll..." />
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data
                .filter((item)=>item.status!=="pending")
                .map((item) => (
                  <tr key={item._id} className="hover:bg-neutral-50">
                    <td>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                          <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-sm font-medium">
                            {/* {item?.bankName?.charAt(0) ?? 'B'} */}
                            {item?.bankName?.charAt(0).toUpperCase() ?? 'U'}
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-neutral-900">{item?.bankName||"Bank"}</p>
                          <p className="text-xs text-neutral-500">{item?.accountNumber || "--"}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">{item?.month || "----"} {item?.year || "----"}</span>
                    </td>
                    <td>
                      <span className="text-sm">₹ {item?.basicSalary}</span>
                    </td>
                    <td>
                      <span className="text-sm">₹ {item?.grossSalary || ""}</span>
                    </td>
                    <td>
                      <span className="text-sm">₹ {item?.netSalary || ""}</span>
                    </td>
                    <td>
                      <span className="text-sm">{item?.paymentMethod}</span>
                    </td>
                    <td>
                      <span className={`badge ${item?.status === 'paid' ? 'badge-success' :
                        item?.status === 'pending' ? 'badge-danger' :
                          'badge-warning'
                        }`}>
                        {item?.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        {/* <Link
                          to={`/payroll/updateSlip/${item?._id}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium text-green-500"
                        >
                          Update-Slip
                        </Link> */}
                        <Link
                          to={`/payslip/${item?._id}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium text-green-500"
                        >
                         View Payslip
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>
        </div>
    </div>
  )
}

export default MySlip