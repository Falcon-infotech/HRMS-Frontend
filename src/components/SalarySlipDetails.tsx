import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/api';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const SalarySlipForm: React.FC = ({type}) => {
  console.log(type)
  const [formData, setFormData] = useState({
    basicSalary: "",
    medicalAllowance: "",
    travelingAllowance: "",
    conveyanceAllowance: "",
    specialAllowance: "",
    holidayPayout: "",
    hra: "",
    bonuses: "",
    pfDeduction: "",
    loanDeduction: "",
    ptDeduction: "",
    tds: "",
    paymentMethod: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    una: '',
    payDate: '',
    panNumber: '',
    totalDays: "",
    daysWorked: "",
    status: 'pending' as 'pending' | 'processed' | 'paid',
    grossSalary: "",
    netSalary: ""
  });

  const { id } = useParams();

  const totalAllowances =
    +formData.basicSalary +
    +formData.medicalAllowance +
    +formData.travelingAllowance +
    +formData.conveyanceAllowance +
    +formData.specialAllowance +
    +formData.holidayPayout +
    +formData.hra +
    +formData.bonuses;

  const totalDeductions =
    +formData.pfDeduction +
    +formData.loanDeduction +
    +formData.ptDeduction +
    +formData.tds;

  const netSalary = totalAllowances - totalDeductions;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name in prev && typeof prev[name as keyof typeof prev] === 'number'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      totalAllowances,
      totalDeductions,
      netSalary,
    };

    try {
      const token = localStorage.getItem('tokenId');
     if(type==='add'){
       const res = await axios.post(`${BASE_URL}/api/payroll/add_payroll_basic_info/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
     }else{
        const res = await axios.put(`${BASE_URL}/api/payroll/update_payroll_basic_info/:id `, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
     }

      // console.log('Salary slip submitted:', res.data);
      toast.success('Submitted successfully!');

      setFormData({
        basicSalary: "",
        medicalAllowance: "",
        travelingAllowance: "",
        conveyanceAllowance: "",
        specialAllowance: "",
        holidayPayout: "",
        hra: "",
        bonuses: "",
        pfDeduction: "",
        loanDeduction: "",
        ptDeduction: "",
        tds: "",
        paymentMethod: '',
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        una: '',
        payDate: '',
        panNumber: '',
        totalDays: "",
        daysWorked: "",
        status: 'pending',
        grossSalary: "",
        netSalary: ""
      });
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Submission failed.');
    }
  };

  return (
    <form className="p-6 max-w-full mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-extrabold mb-6">Add Payroll Details:</h2>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Earnings */}
        {[
          ['basicSalary', 'Basic Salary'],
          ['medicalAllowance', 'Medical Allowance'],
          ['travelingAllowance', 'Traveling Allowance'],
          ['conveyanceAllowance', 'Conveyance Allowance'],
          ['specialAllowance', 'Special Allowance'],
          ['holidayPayout', 'Holiday Payout'],
          ['hra', 'HRA'],
          ['bonuses', 'Bonuses'],
          ['grossSalary', 'Gross Salary'],
          ['netSalary', 'Net Salary'],
        ].map(([key, label]) => (
          <Field
            key={key}
            name={key}
            label={label}
            value={formData[key as keyof typeof formData]}
            onChange={handleChange}
          />
        ))}

        {/* Deductions */}
        {[
          ['pfDeduction', 'PF Deduction'],
          ['loanDeduction', 'Loan Deduction'],
          ['ptDeduction', 'Professional Tax'],
          ['tds', 'TDS'],
        ].map(([key, label]) => (
          <Field
            key={key}
            name={key}
            label={label}
            value={formData[key as keyof typeof formData]}
            onChange={handleChange}
          />
        ))}

        {/* Bank & Metadata */}
        {[
          // ['accountNumber', 'Account Number'],
          // ['bankName', 'Bank Name'],
          // ['ifscCode', 'IFSC Code'],
          // ['una', 'UNA'],
          ['panNumber', 'PAN Number'],
          ['totalDays', 'Total Days'],
          ['daysWorked', 'Days Worked'],
          ['payDate', 'Pay Date'],
        ].map(([key, label]) => (
          <Field
            key={key}
            name={key}
            label={label}
            value={formData[key as keyof typeof formData]}
            onChange={handleChange}
            type={key === 'payDate' ? 'date' : 'text'}
          />
        ))}

        {/* Payment Method */}
        <div className="col-span-1 md:col-span-1">
          <label className="block mb-1 font-medium text-neutral-700">Payment Method</label>
          <select
            name="paymentMethod"
            className="w-full input border border-neutral-300 rounded px-3 py-2"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="">Select Method</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        {/* Status */}
        <div className="col-span-1 md:col-span-1">
          <label className="block mb-1 font-medium text-neutral-700">Status</label>
          <select
            name="status"
            className="w-full input border border-neutral-300 rounded px-3 py-2"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="processed">Processed</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Totals Summary */}
      <div className="mt-8 p-4 bg-neutral-100 rounded-lg text-sm border border-neutral-300">
        <p><strong>Total Allowances:</strong> ₹{totalAllowances.toLocaleString()}</p>
        <p><strong>Total Deductions:</strong> ₹{totalDeductions.toLocaleString()}</p>
        <p><strong>Net Salary:</strong> ₹{netSalary.toLocaleString()}</p>
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-right">
        <button type="submit" className="btn btn-primary px-6 py-2 rounded">
          Submit Salary Slip
        </button>
      </div>
    </form>
  );
};

const Field = ({
  name,
  label,
  value,
  onChange,
  type = 'number'
}: {
  name: string;
  label: string;
  value: any;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
}) => (
  <div>
    <label htmlFor={name} className="block mb-1 font-medium text-neutral-700">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full input border border-neutral-300 rounded px-3 py-2"
    />
  </div>
);

export default SalarySlipForm;
