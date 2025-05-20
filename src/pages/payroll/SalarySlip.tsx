import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { payrollData } from '../../data/payrollData';
import employeesData from '../../data/employeeData';
import PageHeader from '../../components/common/PageHeader';

const SalarySlip: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const payslip = payrollData.find(item => item.id === id);
  const employee = payslip ? employeesData.find(emp => emp.id === payslip.employeeId) : null;

  if (!payslip || !employee) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Salary Slip Not Found</h2>
        <p className="text-neutral-600 mb-6">The requested salary slip could not be found.</p>
        <Link to="/payroll" className="btn btn-primary">
          Back to Payroll
        </Link>
      </div>
    );
  }

  const totalEarnings = payslip.earnings.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = payslip.deductions.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Salary Slip"
        description={`${payslip.period} - ${employee.firstName} ${employee.lastName}`}
        breadcrumbs={[
          { name: 'Payroll', href: '/payroll' },
          { name: 'Salary Slip' }
        ]}
        actions={
          <div className="flex gap-2">
            <button className="btn btn-secondary flex items-center">
              <Printer size={16} className="mr-1" />
              Print
            </button>
            <button className="btn btn-primary flex items-center">
              <Download size={16} className="mr-1" />
              Download PDF
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">HRMS</h1>
              <p className="text-neutral-600 mt-1">Human Resource Management System</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <h2 className="text-lg font-semibold text-neutral-800">Salary Slip</h2>
              <p className="text-neutral-600">{payslip.period}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Employee Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {employee.firstName} {employee.lastName}</p>
                <p><span className="font-medium">Employee ID:</span> {employee.id}</p>
                <p><span className="font-medium">Department:</span> {employee.department}</p>
                <p><span className="font-medium">Designation:</span> {employee.designation}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Payment Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Payment Date:</span> {payslip.paymentDate}</p>
                <p><span className="font-medium">Payment Method:</span> {payslip.paymentMethod}</p>
                <p><span className="font-medium">Bank Account:</span> {employee.bankDetails?.accountNumber}</p>
                <p><span className="font-medium">Bank Name:</span> {employee.bankDetails?.bankName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Earnings</h3>
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="space-y-3">
                  {payslip.earnings.map((earning, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-neutral-600">{earning.type}</span>
                      <span className="font-medium">${earning.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
                    <span className="font-medium text-neutral-800">Total Earnings</span>
                    <span className="font-semibold text-neutral-800">
                      ${totalEarnings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Deductions</h3>
              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="space-y-3">
                  {payslip.deductions.map((deduction, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-neutral-600">{deduction.type}</span>
                      <span className="font-medium">${deduction.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
                    <span className="font-medium text-neutral-800">Total Deductions</span>
                    <span className="font-semibold text-neutral-800">
                      ${totalDeductions.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="mt-6 p-4 bg-primary-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-primary-800">Net Salary</h4>
                <p className="text-primary-600">Total Earnings - Total Deductions</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-800">
                  ${(totalEarnings - totalDeductions).toLocaleString()}
                </p>
                <p className="text-primary-600">
                  {payslip.paymentStatus === 'processed' ? 'Paid' : 'Pending'}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Notes</h3>
            <div className="bg-neutral-50 rounded-lg p-4 text-sm text-neutral-600">
              <ul className="list-disc list-inside space-y-2">
                <li>This is a computer generated salary slip and does not require signature.</li>
                <li>Please report any discrepancies to the HR department within 5 working days.</li>
                <li>Salary is transferred to your registered bank account on or before the 5th of every month.</li>
                <li>For tax related queries, please contact the finance department.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySlip;