import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/api';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const SalarySlipForm: React.FC = () => {
  const [formData, setFormData] = useState({
    basicSalary: 0,
    medicalAllowance: 0,
    travelingAllowance: 0,
    hra: 0,
    bonuses: 0,
    pfDeduction: 0,
    loanDeduction: 0,
    ptDeduction: 0,
    paymentMethod: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    una: '',
    payDate: '',
    status: 'pending' as 'pending' | 'processed' | 'paid',
  });
 const {id}=useParams();
//   console.log(id)

  const totalAllowances =
    formData.basicSalary +
    formData.medicalAllowance +
    formData.travelingAllowance +
    formData.hra +
    formData.bonuses;

  const totalDeductions =
    formData.pfDeduction + formData.loanDeduction + formData.ptDeduction;

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
      const token= localStorage.getItem('tokenId');
      const res = await axios.post(`${BASE_URL}/api/payroll/add_payroll_basic_info/${id}`, payload,{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      }); // Adjust your API endpoint
      console.log('Salary slip submitted:', res.data);
      toast.success('Submitted successfully!');
      setFormData({
        basicSalary: 0,
        medicalAllowance: 0,
        travelingAllowance: 0,
        hra: 0,
        bonuses: 0,
        paymentMethod: '',
        pfDeduction: 0,
        loanDeduction: 0,
        ptDeduction: 0,
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        una: '',
        payDate: '',
        status: 'pending',
      })
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Submission failed.');
    }
  };

  return (
    <form className="p-6 max-w-full mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Add Salary Slip</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earnings Fields */}
        {[
          ['basicSalary', 'Basic Salary'],
          ['medicalAllowance', 'Medical Allowance'],
          ['travelingAllowance', 'Traveling Allowance'],
          ['hra', 'HRA'],
          ['bonuses', 'Bonuses'],
        ].map(([key, label]) => (
          <Field key={key} name={key} label={label} value={formData[key as keyof typeof formData]} onChange={handleChange} />
        ))}

        {/* Deductions Fields */}
        {[
          ['pfDeduction', 'PF Deduction'],
          ['loanDeduction', 'Loan Deduction'],
          ['ptDeduction', 'Professional Tax'],
        ].map(([key, label]) => (
          <Field key={key} name={key} label={label} value={formData[key as keyof typeof formData]} onChange={handleChange} />
        ))}

        {/* Bank & Payment Details */}
        {[
          ['accountNumber', 'Account Number'],
          ['bankName', 'Bank Name'],
          ['ifscCode', 'IFSC Code'],
          ['una', 'UNA'],
          ['payDate', 'Pay Date'],
        ].map(([key, label]) => (
          <Field key={key} name={key} label={label} value={formData[key as keyof typeof formData]} onChange={handleChange} type={key === 'payDate' ? 'date' : 'text'} />
        ))}

        <div className="col-span-1 md:col-span-2">
          <label className="block mb-1 font-medium text-neutral-700">Payment Method</label>
          <select name="paymentMethod" className="w-full input" value={formData.paymentMethod} onChange={handleChange}>
            <option value="">Select Method</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block mb-1 font-medium text-neutral-700">Status</label>
          <select name="status" className="w-full input" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="processed">Processed</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Totals */}
      <div className="mt-6 p-4 bg-neutral-100 rounded-lg text-sm">
        <p><strong>Total Allowances:</strong> ${totalAllowances.toLocaleString()}</p>
        <p><strong>Total Deductions:</strong> ${totalDeductions.toLocaleString()}</p>
        <p><strong>Net Salary:</strong> ${netSalary.toLocaleString()}</p>
      </div>

      <button type="submit" className="btn btn-primary mt-6">Submit Salary Slip</button>
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
