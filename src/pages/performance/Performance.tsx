import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, Filter, RefreshCw, ArrowUpDown, Star, TrendingUp, 
  Target, Users, Download 
} from 'lucide-react';
import { performanceReviews, getEmployeePerformanceReviews } from '../../data/performanceData';
import employeesData from '../../data/employeeData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageHeader from '../../components/common/PageHeader';

const Performance: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  // Get unique review periods
  const periods = Array.from(new Set(performanceReviews.map(review => review.reviewPeriod))).sort().reverse();

  // Calculate department averages
  const departmentAverages = employeesData.reduce((acc, employee) => {
    const dept = employee.department;
    if (!acc[dept]) {
      const reviews = getEmployeePerformanceReviews(employee.id);
      if (reviews.length > 0) {
        const sum = reviews.reduce((total, review) => total + review.overallRating, 0);
        acc[dept] = { total: sum, count: reviews.length };
      }
    } else {
      const reviews = getEmployeePerformanceReviews(employee.id);
      acc[dept].total += reviews.reduce((total, review) => total + review.overallRating, 0);
      acc[dept].count += reviews.length;
    }
    return acc;
  }, {} as { [key: string]: { total: number; count: number } });

  const departmentData = Object.entries(departmentAverages)
    .map(([department, data]) => ({
      department,
      rating: Math.round((data.total / data.count) * 10) / 10
    }))
    .sort((a, b) => b.rating - a.rating);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Performance Management"
        description="Track and manage employee performance reviews"
        actions={
          <div className="flex gap-2">
            <Link to="/performance/review/new" className="btn btn-primary flex items-center">
              <Award size={16} className="mr-1" />
              New Review
            </Link>
            <button className="btn btn-secondary flex items-center">
              <Download size={16} className="mr-1" />
              Export
            </button>
          </div>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
              <Star size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Average Rating</p>
              <p className="text-2xl font-semibold">4.2</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-success-100 flex items-center justify-center text-success-600 mr-3">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Completed Reviews</p>
              <p className="text-2xl font-semibold">
                {performanceReviews.filter(review => review.status === 'finalized').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-warning-100 flex items-center justify-center text-warning-600 mr-3">
              <Target size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Pending Reviews</p>
              <p className="text-2xl font-semibold">
                {performanceReviews.filter(review => review.status === 'draft' || review.status === 'submitted').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 mr-3">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Top Performers</p>
              <p className="text-2xl font-semibold">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Department Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="department" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="rating" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                className="form-input"
                placeholder="Search reviews..."
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
                <label className="form-label">Department</label>
                <select 
                  className="form-select"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {Array.from(new Set(employeesData.map(emp => emp.department))).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Review Period</label>
                <select
                  className="form-select"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="">All Periods</option>
                  {periods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Rating</label>
                <select
                  className="form-select"
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                >
                  <option value="">All Ratings</option>
                  <option value="4.5">4.5+ (Exceptional)</option>
                  <option value="4.0">4.0+ (Exceeds Expectations)</option>
                  <option value="3.0">3.0+ (Meets Expectations)</option>
                  <option value="2.0">2.0+ (Needs Improvement)</option>
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
                    Employee
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
                    Review Period
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    Rating
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>
                  <div className="flex items-center">
                    Review Date
                    <ArrowUpDown size={16} className="ml-1 text-neutral-400" />
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {performanceReviews.map(review => {
                const employee = employeesData.find(emp => emp.id === review.employeeId);

                return (
                  <tr key={review.id} className="hover:bg-neutral-50">
                    <td>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                          {employee?.avatar ? (
                            <img src={employee.avatar} alt={review.employeeName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-sm font-medium">
                              {review.employeeName.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-neutral-900">{review.employeeName}</p>
                          <p className="text-xs text-neutral-500">{employee?.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">{employee?.department}</span>
                    </td>
                    <td>
                      <span className="text-sm">{review.reviewPeriod}</span>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">{review.overallRating.toFixed(1)}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= review.overallRating ? 'text-yellow-400 fill-current' : 'text-neutral-300'}
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        review.status === 'finalized' ? 'badge-success' :
                        review.status === 'acknowledged' ? 'badge-info' :
                        review.status === 'submitted' ? 'badge-warning' :
                        'badge-neutral'
                      }`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm">
                        {new Date(review.reviewDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/performance/review/${review.id}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View
                        </Link>
                        {review.status === 'draft' && (
                          <button className="text-sm text-neutral-600 hover:text-neutral-700 font-medium">
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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
                <span className="font-medium">{performanceReviews.length}</span> results
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

export default Performance;