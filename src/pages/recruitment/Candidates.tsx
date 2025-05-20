import React, { useState } from 'react';
import { 
  Users, Filter, RefreshCw, ArrowUpDown, Star, 
  MapPin, Briefcase, Mail, Phone, Download, Eye, 
  MessageSquare, UserPlus, XCircle 
} from 'lucide-react';
import { candidates } from '../../data/recruitmentData';
import employeesData from '../../data/employeeData';
import PageHeader from '../../components/common/PageHeader';

const Candidates: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSource, setSelectedSource] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hired': return 'badge-success';
      case 'rejected': return 'badge-danger';
      case 'interview': return 'badge-warning';
      case 'assessment': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Candidates"
        description="Manage and track job applicants"
        actions={
          <div className="flex gap-2">
            <button className="btn btn-secondary flex items-center">
              <Download size={16} className="mr-1" />
              Export
            </button>
            <button className="btn btn-primary flex items-center">
              <UserPlus size={16} className="mr-1" />
              Add Candidate
            </button>
          </div>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Candidates</p>
              <p className="text-2xl font-semibold">{candidates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-warning-100 flex items-center justify-center text-warning-600 mr-3">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">In Interview</p>
              <p className="text-2xl font-semibold">
                {candidates.filter(c => c.status === 'interview').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-success-100 flex items-center justify-center text-success-600 mr-3">
              <UserPlus size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Hired</p>
              <p className="text-2xl font-semibold">
                {candidates.filter(c => c.status === 'hired').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-error-100 flex items-center justify-center text-error-600 mr-3">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Rejected</p>
              <p className="text-2xl font-semibold">
                {candidates.filter(c => c.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                className="form-input"
                placeholder="Search candidates..."
              />
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
                <label className="form-label">Job Position</label>
                <select 
                  className="form-select"
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                >
                  <option value="">All Positions</option>
                  {Array.from(new Set(candidates.map(c => c.jobId))).map(jobId => {
                    const job = employeesData.find(j => j.id === jobId);
                    return (
                      <option key={jobId} value={jobId}>
                        {job ? job.designation : jobId}
                      </option>
                    );
                  })}
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
                  <option value="applied">Applied</option>
                  <option value="screening">Screening</option>
                  <option value="interview">Interview</option>
                  <option value="assessment">Assessment</option>
                  <option value="offer">Offer</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="form-label">Source</label>
                <select
                  className="form-select"
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                >
                  <option value="">All Sources</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="indeed">Indeed</option>
                  <option value="referral">Referral</option>
                  <option value="website">Company Website</option>
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
                    Candidate
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    Applied For
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>Contact</th>
                <th>Experience</th>
                <th>
                  <div className="flex items-center">
                    Applied Date
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(candidate => (
                <tr key={candidate.id} className="hover:bg-neutral-50">
                  <td>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{candidate.name}</p>
                      <div className="flex items-center text-xs text-neutral-500">
                        <MapPin size={12} className="mr-1" />
                        {candidate.location}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="text-sm font-medium">{candidate.currentPosition || 'N/A'}</p>
                      <p className="text-xs text-neutral-500">{candidate.currentCompany || 'N/A'}</p>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail size={14} className="text-neutral-400 mr-1" />
                        {candidate.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone size={14} className="text-neutral-400 mr-1" />
                        {candidate.phone}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center text-sm">
                      <Briefcase size={14} className="text-neutral-400 mr-1" />
                      {candidate.experience} years
                    </div>
                  </td>
                  <td>
                    <span className="text-sm">
                      {new Date(candidate.appliedDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(candidate.status)}`}>
                      {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{candidate.rating}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= candidate.rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'}
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button className="text-neutral-500 hover:text-primary-600" title="View Profile">
                        <Eye size={18} />
                      </button>
                      <button className="text-neutral-500 hover:text-warning-500" title="Schedule Interview">
                        <MessageSquare size={18} />
                      </button>
                      <button className="text-neutral-500 hover:text-success-500" title="Mark as Hired">
                        <UserPlus size={18} />
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
                <span className="font-medium">{candidates.length}</span> results
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

export default Candidates;