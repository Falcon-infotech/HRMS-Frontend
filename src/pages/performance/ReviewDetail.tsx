import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Star, Award, Target, MessageSquare, 
  CheckCircle, XCircle, Clock, Download, Printer 
} from 'lucide-react';
import { performanceReviews } from '../../data/performanceData';
import employeesData from '../../data/employeeData';
import PageHeader from '../../components/common/PageHeader';

const ReviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const review = performanceReviews.find(r => r.id === id);
  const employee = review ? employeesData.find(emp => emp.id === review.employeeId) : null;

  if (!review || !employee) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Review Not Found</h2>
        <p className="text-neutral-600 mb-6">The requested performance review could not be found.</p>
        <Link to="/performance" className="btn btn-primary">
          Back to Performance
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success-500';
      case 'in-progress': return 'text-warning-500';
      case 'not-started': return 'text-neutral-500';
      case 'deferred': return 'text-error-500';
      default: return 'text-neutral-500';
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Performance Review"
        description={`${review.reviewPeriod} - ${employee.firstName} ${employee.lastName}`}
        breadcrumbs={[
          { name: 'Performance', href: '/performance' },
          { name: 'Review Details' }
        ]}
        actions={
          <div className="flex gap-2">
            <button className="btn btn-secondary flex items-center">
              <Printer size={16} className="mr-1" />
              Print
            </button>
            <button className="btn btn-primary flex items-center">
              <Download size={16} className="mr-1" />
              Export PDF
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overall Rating */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-neutral-800">Overall Rating</h2>
                <p className="text-neutral-500 mt-1">Performance evaluation for {review.reviewPeriod}</p>
              </div>
              <div className="flex items-center">
                <div className="text-3xl font-bold text-primary-600 mr-3">{review.overallRating.toFixed(1)}</div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={star <= review.overallRating ? 'text-yellow-400 fill-current' : 'text-neutral-300'}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-neutral-700 mb-2">Strengths</h3>
                <ul className="space-y-2">
                  {review.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle size={16} className="text-success-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-neutral-600">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-neutral-700 mb-2">Areas for Improvement</h3>
                <ul className="space-y-2">
                  {review.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <Target size={16} className="text-warning-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-neutral-600">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Performance Categories */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-800 mb-6">Performance Categories</h2>
            <div className="space-y-6">
              {review.sections.map((section, index) => (
                <div key={index} className="border-b border-neutral-200 last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-base font-medium text-neutral-800">{section.name}</h3>
                      <p className="text-sm text-neutral-500">{section.description}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold mr-2">{section.rating.toFixed(1)}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= section.rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600">{section.comments}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-800 mb-6">Performance Goals</h2>
            <div className="space-y-4">
              {review.goals.map(goal => (
                <div key={goal.id} className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-medium text-neutral-800">{goal.title}</h3>
                      <p className="text-sm text-neutral-500">{goal.description}</p>
                    </div>
                    <span className={`badge ${
                      goal.status === 'completed' ? 'badge-success' :
                      goal.status === 'in-progress' ? 'badge-warning' :
                      goal.status === 'not-started' ? 'badge-info' :
                      'badge-danger'
                    }`}>
                      {goal.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-neutral-500">Start Date:</span>
                      <span className="ml-2 font-medium">
                        {new Date(goal.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Target Date:</span>
                      <span className="ml-2 font-medium">
                        {new Date(goal.targetDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-500">Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          goal.status === 'completed' ? 'bg-success-500' :
                          goal.status === 'in-progress' ? 'bg-warning-500' :
                          'bg-neutral-400'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  {goal.comments && (
                    <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded">
                      {goal.comments}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Additional Comments</h2>
            <p className="text-neutral-600 whitespace-pre-line">{review.comments}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Review Status */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Review Status</h3>
            <div className="space-y-4">
              <div>
                <span className={`badge ${
                  review.status === 'finalized' ? 'badge-success' :
                  review.status === 'acknowledged' ? 'badge-info' :
                  review.status === 'submitted' ? 'badge-warning' :
                  'badge-neutral'
                }`}>
                  {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                </span>
              </div>

              <div className="text-sm">
                <p className="text-neutral-500">Review Date</p>
                <p className="font-medium">{new Date(review.reviewDate).toLocaleDateString()}</p>
              </div>

              <div className="text-sm">
                <p className="text-neutral-500">Reviewer</p>
                <p className="font-medium">{review.reviewerName}</p>
              </div>

              {review.acknowledgement && (
                <div className="text-sm">
                  <p className="text-neutral-500">Acknowledged On</p>
                  <p className="font-medium">
                    {new Date(review.acknowledgement.date).toLocaleDateString()}
                  </p>
                  <p className="text-neutral-600 mt-2 bg-neutral-50 p-3 rounded text-sm">
                    {review.acknowledgement.comments}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Employee Info */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Employee Information</h3>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                {employee.avatar ? (
                  <img src={employee.avatar} alt={employee.firstName} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-lg font-medium">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </div>
                )}
              </div>
              <div className="ml-3">
                <h4 className="text-base font-medium">{employee.firstName} {employee.lastName}</h4>
                <p className="text-sm text-neutral-500">{employee.designation}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-neutral-500">Department</p>
                <p className="font-medium">{employee.department}</p>
              </div>
              <div>
                <p className="text-neutral-500">Employee ID</p>
                <p className="font-medium">{employee.id}</p>
              </div>
              <div>
                <p className="text-neutral-500">Joining Date</p>
                <p className="font-medium">{new Date(employee.joiningDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="btn btn-secondary w-full flex items-center justify-center">
                <MessageSquare size={16} className="mr-2" />
                Add Comment
              </button>
              <button className="btn btn-secondary w-full flex items-center justify-center">
                <Award size={16} className="mr-2" />
                Schedule Follow-up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;