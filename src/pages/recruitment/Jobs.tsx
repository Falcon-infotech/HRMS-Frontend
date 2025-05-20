import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Users, Clock, MapPin, Filter, Plus, Search, 
  RefreshCw, ArrowUpDown, Edit, Trash2, Eye 
} from 'lucide-react';
import { jobs } from '../../data/recruitmentData';
import PageHeader from '../../components/common/PageHeader';

const Jobs: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  const [selectedStatus, setSelectedStatus] = useState('');

  const activeJobs = jobs.filter(job => job.status === 'open').length;
  const totalCandidates = jobs.reduce((sum, job) => sum + job.candidates, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Job Postings"
        description="Manage and track job openings"
        actions={
          <Link to="/recruitment/jobs/new" className="btn btn-primary flex items-center">
            <Plus size={16} className="mr-1" />
            Post New Job
          </Link>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Active Jobs</p>
              <p className="text-2xl font-semibold">{activeJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-success-100 flex items-center justify-center text-success-600 mr-3">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Candidates</p>
              <p className="text-2xl font-semibold">{totalCandidates}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-warning-100 flex items-center justify-center text-warning-600 mr-3">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Time to Hire</p>
              <p className="text-2xl font-semibold">25 days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 mr-3">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Locations</p>
              <p className="text-2xl font-semibold">4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="Search jobs..."
                />
              </div>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
              <button 
                className="btn btn-secondary flex items-center justify-center"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter size={16} className="mr-1" />
                Filter
              </button>
              <button 
                className="btn btn-secondary flex items-center justify-center"
              >
                <RefreshCw size={16} className="mr-1" />
                Reset
              </button>
            </div>
          </div>

          {filterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-200">
              <div>
                <label className="form-label">Department</label>
                <select 
                  className="form-select"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {Array.from(new Set(jobs.map(job => job.department))).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Job Type</label>
                <select
                  className="form-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <div className="flex items-center">
                    Job Title
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    Department
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    Type
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>Location</th>
                <th>
                  <div className="flex items-center">
                    Posted Date
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>Candidates</th>
                <th>
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-neutral-50">
                  <td>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{job.title}</p>
                      <p className="text-xs text-neutral-500">ID: {job.id}</p>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm">{job.department}</span>
                  </td>
                  <td>
                    <span className="badge bg-primary-100 text-primary-800">
                      {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center text-sm">
                      <MapPin size={14} className="text-neutral-400 mr-1" />
                      {job.location}
                    </div>
                  </td>
                  <td>
                    <span className="text-sm">
                      {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <Users size={14} className="text-neutral-400 mr-1" />
                      <span className="text-sm font-medium">{job.candidates}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      job.status === 'open' ? 'badge-success' :
                      job.status === 'closed' ? 'badge-danger' :
                      job.status === 'draft' ? 'badge-warning' :
                      'badge-neutral'
                    }`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button className="text-neutral-500 hover:text-primary-600" title="View">
                        <Eye size={18} />
                      </button>
                      <button className="text-neutral-500 hover:text-warning-500" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="text-neutral-500 hover:text-error-500" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="btn btn-secondary">Previous</button>
            <button className="btn btn-secondary">Next</button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">10</span> of{' '}
                <span className="font-medium">{jobs.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="btn btn-secondary rounded-l-md">Previous</button>
                <button className="btn btn-primary">1</button>
                <button className="btn btn-secondary">2</button>
                <button className="btn btn-secondary">3</button>
                <button className="btn btn-secondary rounded-r-md">Next</button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;