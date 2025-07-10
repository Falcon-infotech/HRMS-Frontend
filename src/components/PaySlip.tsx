import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../constants/api';
import toast from 'react-hot-toast';

const PayslipComponent = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('tokenId');
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/payroll/get_salary_slip/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        const data = res.data.data;
        console.log(data)
        // Format payDate
        data.payDate = data.payDate ? new Date(data.payDate).toISOString().split('T')[0] : '';

        setFormData(data);
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error('Failed to fetch data.');
      }
    };

    fetchData();
  }, [id]);

  const formatCurrency = (value: number) =>
    value?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  if (!formData) return <p className="text-center mt-10">Loading payslip...</p>;

  // Destructure fields from formData
  const {
    userId = {},
    month,
    year,
    totalDays,
    workedDays,
    grossSalary,
    basicSalary,
    hra,
    conveyanceAllowance,
    specialAllowance,
    holidayPayout,
    pfDeduction,
    ptDeduction,
    TDS,
    netSalary,
    PAN,
    payDate
  } = formData;

  return (
    <div className="max-w-full mx-auto border border-black p-4 bg-white text-sm print:text-xs mt-6">
      {/* Header */}
      <div className="text-center border-b border-black pb-2 mb-2">
        <img src="/image.png" alt="Company Logo" className="w-56 mx-auto mb-2" />
        <h2 className="text-xl font-bold">Falcon Multi Services Limited</h2>
        <p className="font-semibold">Salary Statement For {month} {year}</p>
      </div>

      {/* Employee Details */}
      <div className="grid grid-cols-2 gap-4 border-b border-black pb-2 mb-2">
        <div>
          <p><strong>Employee No:</strong> {userId?.userId}</p>
          <p><strong>Employee Name:</strong> {userId?.first_name} {userId?.last_name}</p>
          <p><strong>Department:</strong> {userId?.department}</p>
          <p><strong>Designation:</strong> {userId?.designation}</p>
          <p><strong>Location:</strong> India-Mumbai</p>
          <p><strong>UAN No:</strong> {userId?.payrollDetails?.UNA || 'N/A'}</p>
          <p><strong>Gross Salary:</strong> {formatCurrency(grossSalary)}</p>
        </div>
        <div>
          <p><strong>Total Days:</strong> {totalDays}</p>
          <p><strong>Days Worked:</strong> {workedDays}</p>
          <p><strong>Birth Date:</strong> --</p>
          <p><strong>Joining Date:</strong> {userId?.joining_date ? new Date(userId.joining_date).toLocaleDateString() : '--'}</p>
          <p><strong>PAN:</strong> {PAN || 'N/A'}</p>
          <p><strong>A/C No:</strong> {userId?.payrollDetails?.accountNumber || 'N/A'}</p>
          <p><strong>Bank Name:</strong> {userId?.payrollDetails?.BankName || 'N/A'}</p>
        </div>
      </div>

    
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <h3 className="font-semibold border-b border-black mb-1">Income</h3>
          <div className="flex justify-between"><span>Basic Salary</span><span>{formatCurrency(basicSalary)}</span></div>
          <div className="flex justify-between"><span>H.R.A. Allowance</span><span>{formatCurrency(hra)}</span></div>
          <div className="flex justify-between"><span>Conveyance Allowance</span><span>{formatCurrency(conveyanceAllowance)}</span></div>
          <div className="flex justify-between"><span>Special Allowance</span><span>{formatCurrency(specialAllowance)}</span></div>
          <div className="flex justify-between"><span>Holiday Payout</span><span>{formatCurrency(holidayPayout)}</span></div>
          <div className="flex justify-between font-semibold border-t mt-1 pt-1">
            <span>Total</span>
            <span>
              {formatCurrency(
                basicSalary + hra + conveyanceAllowance + specialAllowance + holidayPayout
              )}
            </span>
          </div>
        </div>

        {/* Deductions */}
        <div>
          <h3 className="font-semibold border-b border-black mb-1">Deductions</h3>
          <div className="flex justify-between"><span>Provident Fund</span><span>{formatCurrency(pfDeduction)}</span></div>
          <div className="flex justify-between"><span>Professional Tax</span><span>{formatCurrency(ptDeduction)}</span></div>
          <div className="flex justify-between"><span>TDS</span><span>{TDS ? formatCurrency(TDS) : '-'}</span></div>
          <div className="flex justify-between font-semibold border-t mt-1 pt-1">
            <span>Total</span>
            <span>{formatCurrency((pfDeduction || 0) + (ptDeduction || 0) + (TDS || 0))}</span>
          </div>
        </div>
      </div>

      {/* Net Salary */}
      <div className="text-right font-bold text-lg border-t border-black pt-2 mb-1">
        Net Salary: {formatCurrency(netSalary)}
      </div>

      {/* Footer */}
      <div className="text-sm italic">
        (Rupees: {netSalary?.toLocaleString('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        })} only.)
      </div>
      <div className="text-center text-xs mt-4 border-t pt-2">
        This is a computer generated statement and does not require signature
      </div>
    </div>
  );
};

export default PayslipComponent;
