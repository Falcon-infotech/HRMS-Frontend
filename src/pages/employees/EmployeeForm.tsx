import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, Trash2 } from 'lucide-react';
import employeesData, { Employee, country, departments, designations } from '../../data/employeeData';
import axios from 'axios';
import { API, BASE_URL } from '../../constants/api';
import toast from 'react-hot-toast';

const EmployeeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [employee, setEmployee] = useState<Partial<Employee>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: "",
    department: '',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'active',
    employeeType: 'full-time',
    address_line: '',
    salary: 0,
    city: '',
    state: '',
    pincode: '',
    country: '',
    empployeeId: "",
    id: ""
  });

  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    relationship: '',
    phone: '',
  });

  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    BankName: '',
    ifscCode: '',
    pfNumber: "",
    UNA: '',
  });




  const [documents, setDocuments] = useState<{ name: string; type: string }[]>([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [editValue, setEditValue] = useState([]);

  useEffect(() => {
    // console.log(isEditMode);
    if (isEditMode) {
      const fetchEmployeeData = async () => {
        try {
          const token = localStorage.getItem('tokenId');

          const response = await axios.get(`${BASE_URL}/api/employee/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const existingEmployee = response.data;
          // console.log(existingEmployee.data)

          // const existingEmployee = employeesData.find(emp => emp.id === id);
          // console.log(existingEmployee)

          if (existingEmployee.data) {
            const emp = existingEmployee.data;

            setEmployee({
              first_name: emp.first_name || '',
              last_name: emp.last_name || '',
              email: emp.email || '',
              phone: emp.phone || '',
              password: '',
              department: emp.department || '',
              designation: emp.designation || '',
              joiningDate: emp.joining_date ? new Date(emp.joining_date).toISOString().split('T')[0] : '',
              status: emp.status || 'active',
              employeeType: emp.employeeType || 'full-time',
              address_line: emp.address?.address_line || '',
              city: emp.address?.city || '',
              state: emp.address?.state || '',
              pincode: emp.address?.pincode || '',
              country: emp.address?.country || '',
              salary: emp.salary || 0,
              empployeeId: emp._id || '',
              village: emp?.address?.village,
              id: emp.userId
            });

            // if (existingEmployee.emergencyContact) {
            //   setEmergencyContact(existingEmployee.emergencyContact);
            // }

            // if (existingEmployee.bankDetails) {
            //   setBankDetails(existingEmployee.bankDetails);
            // }

            // if (existingEmployee.documents) {
            //   setDocuments(
            //     existingEmployee.documents.map((doc) => ({
            //       name: doc.name,
            //       type: doc.type,
            //     })
            //   )
            //   );
            // }
          }
        } catch (error) {
          console.error("Failed to fetch employee data:", error);
        }
      };

      fetchEmployeeData();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // const handleEmergencyContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setEmergencyContact(prev => ({ ...prev, [name]: value }));
  // };

  // const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setBankDetails(prev => ({ ...prev, [name]: value }));
  // };

  const handleAddDocument = () => {
    setDocuments(prev => [...prev, { name: '', type: 'PDF' }]);
  };

  const handleDocumentChange = (index: number, field: string, value: string) => {
    setDocuments(prev => {
      const newDocuments = [...prev];
      newDocuments[index] = { ...newDocuments[index], [field]: value };
      return newDocuments;
    });
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Basic validations
    if (!employee.first_name?.trim()) errors.firstName = 'First name is required';
    if (!employee.last_name?.trim()) errors.lastName = 'Last name is required';
    if (!employee.email?.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(employee.email)) errors.email = 'Email is invalid';
    if (!employee.phone?.length === 0) errors.phone = 'Phone number is required';
    if (!employee.department?.trim()) errors.department = 'Department is required';
    if (!employee.designation?.trim()) errors.designation = 'Designation is required';
    if (!employee.joiningDate?.trim()) errors.joiningDate = 'Joining date is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const payload = {
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        phone: employee.phone || '',
        email: employee.email || '',
        password: employee.password,
        department: employee.department || '',
        role: 'employee',
        designation: employee.designation || '',
        joining_date: new Date(employee.joiningDate || '').toISOString(),
        salary: employee.salary || 0,
        status: employee.status || 'active',
        employeeId: employee.empployeeId,
        address: {
          country: employee.country || '',
          state: employee.state || '',
          city: employee.city || '',
          village: employee.village,
          address_line: employee.address_line || '',
          pincode: employee.pincode || ''
        },
        userId: employee.id || '',
      };

      try {
        const token = localStorage.getItem("tokenId")
        console.log("running")
        if (isEditMode && id) {
          const response = await axios.put(`${BASE_URL}/api/employee/${id}`, payload, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });
          toast.success("Employee updated successfully")
        } else {
          const response = await axios.post(`${BASE_URL}/api/auth/register`, payload, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          toast.success("Employee created successfully")
        }
        // const successMessage = isEditMode
        //   ? `Employee ${employee.first_Name} ${employee.last_Name} updated successfully!`
        //   : `Employee ${employee.first_Name} ${employee.last_Name} added successfully!`;

        // alert(successMessage);

        navigate('/employees');
      } catch (error) {
        console.error("Error submitting employee data:", error);
        toast.error("Something went wrong while submitting the employee data.");
      }
    } else {
      // Scroll to the first error
      const firstErrorField = Object.keys(formErrors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  const [bankError, setBankError] = useState<{ [key: string]: string }>({});
  const validateBankDetails = () => {

    const bankErrors: { [key: string]: string } = {};

    if (!bankDetails.accountNumber.trim()) {
      bankErrors.accountNumber = 'Account number is required';
    }
    if (!bankDetails.ifscCode.trim()) {
      bankErrors.ifscCode = 'IFSC code is required';
    }

    if (!bankDetails.BankName.trim()) {
      bankErrors.BankName = 'Bank name is required';
    }

    if (!bankDetails.pfNumber.trim()) {
      bankErrors.pfNumber = 'PF Number is required';
    }
    if (!bankDetails.UNA.trim()) {
      bankErrors.UNA = 'UNA is required';
    }
    setBankError(bankErrors);
    return Object.keys(bankErrors).length === 0;

  }



  async function handleSubmitBankDetails() {

    if (validateBankDetails()) {

      try {
        let payrollDetails = {
          BankName: bankDetails.BankName, accountNumber: bankDetails.accountNumber, pfNumber: bankDetails.pfNumber, ifscCode: bankDetails.ifscCode, UNA: bankDetails.UNA
        }
        const response = await axios.put(`${BASE_URL}/api/employee/${id}`, { payrollDetails }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("tokenId")}`,
          }

        });
        toast.success("bankDetails Submitted successfully")
        setBankDetails({ BankName: "", accountNumber: "", ifscCode: "", pfNumber: "", UNA: "" });

      } catch (error) {
        console.error("Error submitting bank details:", error);
        toast.error("Something went wrong while submitting the bank details.");

      }
    } else {
      toast.error("interal server error")
    }


  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center">
          <Link to="/employees" className="mr-4 text-neutral-500 hover:text-neutral-700">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">{isEditMode ? 'Edit Employee' : 'Add Employee'}</h1>
            <p className="text-neutral-500 mt-1">{isEditMode ? 'Update employee information' : 'Create a new employee record'}</p>
          </div>
        </div>
      </div>

      {/* Form Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="border-b border-neutral-200">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-4 text-sm font-medium ${activeTab === 'basic'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-neutral-500 hover:text-neutral-700'
                }`}
              onClick={() => setActiveTab('basic')}
            >
              Basic Information
            </button>
            {/* <button 
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === 'additional' 
                  ? 'border-b-2 border-primary-600 text-primary-600' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
              onClick={() => setActiveTab('additional')}
            >
              Additional Information
            </button> */}
            <button
              className={`px-4 py-4 text-sm font-medium ${activeTab === 'employment'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-neutral-500 hover:text-neutral-700'
                }`}
              onClick={() => setActiveTab('employment')}
            >
              Employment Details
            </button>
            {isEditMode && (
              <button
                className={`px-4 py-4 text-sm font-medium ${activeTab === 'bankDetails'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                onClick={() => setActiveTab('bankDetails')}
              >
                Bank Details
              </button>
            )}
            {/* <button 
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === 'documents' 
                  ? 'border-b-2 border-primary-600 text-primary-600' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button> */}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label htmlFor="firstName" className="form-label">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="first_name"
                        className={`form-input ${formErrors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        value={employee.first_name || ''}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.first_name && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>

                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="last_name"
                        className={`form-input ${formErrors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        value={employee.last_name || ''}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.last_name && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`form-input ${formErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        value={employee.email || ''}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={`form-input ${formErrors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        value={employee.phone || ''}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">Password *</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder='*********'
                        className={`form-input ${formErrors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        value={employee.password || ''}
                        onChange={handleInputChange}
                        required
                        disabled={isEditMode}
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group md:col-span-1">
                      <label htmlFor="address" className="form-label">Street Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address_line"
                        className="form-input"
                        value={employee.address_line}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="country" className="form-label">Country</label>
                      <select
                        id="country"
                        name="country"
                        className="form-input"
                        value={employee.country}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a country</option>
                        {country.countries.map((c, index) => (
                          <option key={index} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>


                    <div className="form-group">
                      <label htmlFor="village" className="form-label">Village</label>
                      <input
                        type="text"
                        id="village"
                        name="village"
                        className="form-input"
                        value={employee.village}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state" className="form-label">State/Province</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        className="form-input"
                        value={employee.state}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="postalCode" className="form-label">Postal Code</label>
                      <input
                        type="text"
                        id="postalCode"
                        name="pincode"
                        className="form-input"
                        value={employee.pincode}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city" className="form-label">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        className="form-input"
                        value={employee.city}
                        onChange={handleInputChange}
                      />
                    </div>


                  </div>
                </div>
              </div>
            )}

            {/* Additional Information Tab */}
            {/* {activeTab === 'additional' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label htmlFor="emergencyName" className="form-label">Contact Name</label>
                      <input
                        type="text"
                        id="emergencyName"
                        name="name"
                        className="form-input"
                        value={emergencyContact.name}
                        onChange={handleEmergencyContactChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="emergencyRelationship" className="form-label">Relationship</label>
                      <input
                        type="text"
                        id="emergencyRelationship"
                        name="relationship"
                        className="form-input"
                        value={emergencyContact.relationship}
                        onChange={handleEmergencyContactChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="emergencyPhone" className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        id="emergencyPhone"
                        name="phone"
                        className="form-input"
                        value={emergencyContact.phone}
                        onChange={handleEmergencyContactChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-4">Bank Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label htmlFor="accountName" className="form-label">Account Holder Name</label>
                      <input
                        type="text"
                        id="accountName"
                        name="accountName"
                        className="form-input"
                        value={bankDetails.accountName}
                        onChange={handleBankDetailsChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="accountNumber" className="form-label">Account Number</label>
                      <input
                        type="text"
                        id="accountNumber"
                        name="accountNumber"
                        className="form-input"
                        value={bankDetails.accountNumber}
                        onChange={handleBankDetailsChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="bankName" className="form-label">Bank Name</label>
                      <input
                        type="text"
                        id="bankName"
                        name="bankName"
                        className="form-input"
                        value={bankDetails.bankName}
                        onChange={handleBankDetailsChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ifscCode" className="form-label">IFSC Code</label>
                      <input
                        type="text"
                        id="ifscCode"
                        name="ifscCode"
                        className="form-input"
                        value={bankDetails.ifscCode}
                        onChange={handleBankDetailsChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {/* Employment Details Tab */}
            {activeTab === 'employment' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-4">Job Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isEditMode && (
                      <div className="form-group">
                        <label htmlFor="id" className="form-label">Employee ID</label>
                        <input
                          type="text"
                          id="id"
                          name="id"
                          className="form-input bg-neutral-50"
                          value={employee?.id}
                          onChange={handleInputChange}
                          // readOnly
                          // disabled
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label htmlFor="department" className="form-label">Department *</label>
                      <select
                        id="department"
                        name="department"
                        className={`form-select ${formErrors.department ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        value={employee.department || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      {formErrors.department && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="designation" className="form-label">Designation *</label>
                      <select
                        id="designation"
                        name="designation"
                        className={`form-select ${formErrors.designation ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        value={employee.designation || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Designation</option>
                        {designations.map(desig => (
                          <option key={desig} value={desig}>{desig}</option>
                        ))}
                      </select>
                      {formErrors.designation && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.designation}</p>
                      )}
                    </div>
                    {!isEditMode &&
                      <div className="form-group">
                        <label htmlFor="employeeType" className="form-label">EmployeeID</label>
                        <input
                          id="empployeeId"
                          name="id"
                          type='text'
                          className="form-select"
                          value={employee?.id || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    }
                    {/* <div className="form-group">
                      <label htmlFor="employeeType" className="form-label">Employment Type</label>
                      <select
                        id="employeeType"
                        name="employeeType"
                        className="form-select"
                        value={employee.employeeType || ''}
                        onChange={handleInputChange}
                      >
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div> */}

                    <div className="form-group">
                      <label htmlFor="joininsalarygDate" className="form-label">Salary *</label>
                      <input
                        type="number"
                        id="salary"
                        name="salary"
                        className={`form-input ${formErrors.salary ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        value={employee.salary || ''}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.salary && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.salary}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="joiningDate" className="form-label">Joining Date *</label>
                      <input
                        type="date"
                        id="joiningDate"
                        name="joiningDate"
                        className={`form-input ${formErrors.joiningDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        value={employee.joiningDate || ''}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.joiningDate && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.joiningDate}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select
                        id="status"
                        name="status"
                        className="form-select"
                        value={employee.status || ''}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="on-leave">On Leave</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-4">Profile Image</h3>
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0 h-24 w-24 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                      {employee.avatar ? (
                        <img src={employee.avatar} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary-50 text-primary-600 text-lg font-bold">
                          {employee.first_name?.[0] || ''}{employee.last_name?.[0] || ''}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <label className="btn btn-secondary flex items-center cursor-pointer">
                            <Upload size={16} className="mr-2" />
                            Upload Photo
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                            />
                          </label>
                          <p className="mt-1 text-xs text-neutral-500">PNG, JPG or GIF up to 2MB</p>
                        </div>
                        {employee.avatar && (
                          <button
                            type="button"
                            className="text-error-500 hover:text-error-600 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-neutral-800">Employee Documents</h3>
                  <button
                    type="button"
                    className="btn btn-secondary flex items-center"
                    onClick={handleAddDocument}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Document
                  </button>
                </div>

                {documents.length === 0 ? (
                  <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-6 text-center">
                    <div className="mb-3">
                      <Upload size={36} className="mx-auto text-neutral-400" />
                    </div>
                    <h4 className="text-base font-medium text-neutral-700 mb-1">No documents added yet</h4>
                    <p className="text-sm text-neutral-500 mb-4">Upload employee documents like ID proofs, certificates, etc.</p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddDocument}
                    >
                      Add Document
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((document, index) => (
                      <div key={index} className="p-4 border border-neutral-200 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div className="form-group mb-0">
                            <label htmlFor={`docName${index}`} className="form-label">Document Name</label>
                            <input
                              type="text"
                              id={`docName${index}`}
                              value={document.name}
                              onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                              className="form-input"
                              placeholder="e.g., Resume, ID Card"
                            />
                          </div>
                          <div className="form-group mb-0">
                            <label htmlFor={`docType${index}`} className="form-label">Document Type</label>
                            <select
                              id={`docType${index}`}
                              value={document.type}
                              onChange={(e) => handleDocumentChange(index, 'type', e.target.value)}
                              className="form-select"
                            >
                              <option value="PDF">PDF</option>
                              <option value="DOC">DOC</option>
                              <option value="IMAGE">Image</option>
                              <option value="OTHER">Other</option>
                            </select>
                          </div>
                          <div className="flex items-end space-x-3">
                            <div className="form-group mb-0 flex-1">
                              <label className="form-label">File</label>
                              <div className="flex">
                                <label className="flex-1 cursor-pointer px-3 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none">
                                  <span className="flex items-center justify-center">
                                    <Upload size={16} className="mr-1" />
                                    Upload File
                                  </span>
                                  <input
                                    type="file"
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="p-2 text-error-500 hover:text-error-700 mb-1"
                              onClick={() => handleRemoveDocument(index)}
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {
            activeTab === 'bankDetails' && (
              <div className=''>
                <h3 className="text-lg font-medium text-neutral-800 px-4">Employee Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3">
                  {/* Account Number */}
                  <div className=''>
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                      Account Number
                    </label>
                    <input
                      type="number"
                      id="accountNumber"
                      name="accountNumber"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={bankDetails.accountNumber || ''}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    />
                    {
                      bankError.accountNumber && (
                        <p className="mt-1 text-sm text-red-500">Account number is required</p>
                      )
                    }
                  </div>

                  {/* Bank Name */}
                  <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      id="bankName"
                      name="bankName"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={bankDetails.BankName || ''}
                      onChange={(e) => setBankDetails({ ...bankDetails, BankName: e.target.value })}

                    />
                    {
                      bankError.BankName && (
                        <p className="mt-1 text-sm text-red-500">Bank name is required</p>
                      )
                    }
                  </div>

                  {/* IFSC Code */}
                  <div>
                    <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      id="ifscCode"
                      name="ifscCode"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={bankDetails.ifscCode || ''}
                      onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                    />
                    {
                      bankError.ifscCode && (
                        <p className="mt-1 text-sm text-red-500">IFSC code is required</p>
                      )
                    }
                  </div>

                  {/* UNA */}
                  <div>
                    <label htmlFor="una" className="block text-sm font-medium text-gray-700">
                      UNA
                    </label>
                    <input
                      type="text"
                      id="una"
                      name="una"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={bankDetails.UNA || ''}
                      onChange={(e) => setBankDetails({ ...bankDetails, UNA: e.target.value })}
                    />
                    {
                      bankError.una && (
                        <p className="mt-1 text-sm text-red-500">UNA is required
                        </p>
                      )
                    }
                  </div>

                  {/* PF Number */}
                  <div>
                    <label htmlFor="pfNumber" className="block text-sm font-medium text-gray-700">
                      PF Number
                    </label>
                    <input
                      type="text"
                      id="pfNumber"
                      name="pfNumber"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={bankDetails.pfNumber || ''}
                      onChange={(e) => setBankDetails({ ...bankDetails, pfNumber: e.target.value })}
                    />
                    {bankError.pfNumber && (
                      <p className="mt-1 text-sm text-red-500">PF number is required</p>
                    )}
                  </div>
                </div>
              </div>
            )
          }

          {/* Form Actions */}
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end space-x-3">
            {
              activeTab === 'employment' ? (
                <>
                  <Link to="/employees" className="btn btn-secondary">
                    Cancel
                  </Link>
                  <button
                    type="button" className="btn btn-primary" onClick={() => setActiveTab('basic')}>
                    Previous
                  </button>
                  <button type="button" onClick={handleSubmit} className="btn btn-primary">
                    {isEditMode ? 'Update Employee' : 'Add Employee'}
                  </button>

                </>
              ) : activeTab === "bankDetails" ? (
                <>
                  <Link to="/employees" className="btn btn-secondary">
                    Cancel
                  </Link>
                  <button type="button" className="btn btn-primary" onClick={handleSubmitBankDetails}>
                    Submit
                  </button>
                </>
              ) :
                <>
                  <Link to="/employees" className="btn btn-secondary">
                    Cancel
                  </Link>
                  <button type="button" className="btn btn-primary" onClick={() => setActiveTab('employment')}>
                    Next
                  </button>
                </>
            }
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;