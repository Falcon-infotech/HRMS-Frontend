import React, { useState } from 'react';
import { 
  Calendar, Clock, Users, Video, MapPin, Filter, Plus, 
  RefreshCw, ArrowUpDown, Eye, Edit, XCircle 
} from 'lucide-react';
import { interviews } from '../../data/recruitmentData';
import employeesData from '../../data/employeeData';
import PageHeader from '../../components/common/PageHeader';

const InterviewSchedule: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'badge-warning';
      case 'completed': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      case 'no-show': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'video': return <Video size={14} className="mr-1" />;
      case 'phone': return <Clock size={14} className="mr-1" />;
      case 'in-person': return <MapPin size={14} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Interview Schedule"
        description="Manage and track candidate interviews"
        actions={
          <button className="btn btn-primary flex items-center">
            <Plus size={16} className="mr-1" />
            Schedule Interview
          </button>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Today's Interviews</p>
              <p className="text-2xl font-semibold">
                {interviews.filter(i => 
                  new Date(i.scheduledDate).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-warning-100 flex items-center justify-center text-warning-600 mr-3">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Scheduled</p>
              <p className="text-2xl font-semibold">
                {interviews.filter(i => i.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-success-100 flex items-center justify-center text-success-600 mr-3">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Completed</p>
              <p className="text-2xl font-semibold">
                {interviews.filter(i => i.status === 'completed').length}
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
              <p className="text-sm text-neutral-500">Cancelled</p>
              <p className="text-2xl font-semibold">
                {interviews.filter(i => i.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interview List */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                className="form-input"
                placeholder="Search interviews..."
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
                  {Array.from(new Set(interviews.map(i => i.jobId))).map(jobId => {
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
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>
              <div>
                <label className="form-label">Location</label>
                <select
                  className="form-select"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  <option value="video">Video Call</option>
                  <option value="phone">Phone</option>
                  <option value="in-person">In Person</option>
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
                    Round
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    Date & Time
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>Interviewers</th>
                <th>Location</th>
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
              {interviews.map(interview => (
                <tr key={interview.id} className="hover:bg-neutral-50">
                  <td>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {interview.candidateName}
                      </p>
                      <p className="text-xs text-neutral-500">ID: {interview.candidateId}</p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="text-sm font-medium">{interview.title}</p>
                      <p className="text-xs text-neutral-500">Round {interview.round}</p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="text-sm">
                        {new Date(interview.scheduledDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {interview.scheduledTime} ({interview.duration} mins)
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="flex -space-x-2">
                      {interview.interviewers.map((interviewer, index) => (
                        <div 
                          key={interviewer.id}
                          className="h-8 w-8 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center"
                          title={interviewer.name}
                        >
                          <span className="text-xs font-medium">
                            {interviewer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center text-sm">
                      {getLocationIcon(interview.location)}
                      <span className="capitalize">
                        {interview.location.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(interview.status)}`}>
                      {interview.status.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button className="text-neutral-500 hover:text-primary-600" title="View Details">
                        <Eye size={18} />
                      </button>
                      {interview.status === 'scheduled' && (
                        <>
                          <button className="text-neutral-500 hover:text-warning-500" title="Edit">
                            <Edit size={18} />
                          </button>
                          <button className="text-neutral-500 hover:text-error-500" title="Cancel">
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
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
                <span className="font-medium">{interviews.length}</span> results
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

export default InterviewSchedule;