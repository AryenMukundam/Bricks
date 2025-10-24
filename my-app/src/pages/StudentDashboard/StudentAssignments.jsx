import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { getStudentAssignments } from '../../apiCalls/assignmentCalls';
import Navbar from '../../components/StudentDashboard/Navbar';
import { useNavigate } from 'react-router-dom';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAssignments: 0,
    hasMore: false
  });
  const navigate = useNavigate()

  useEffect(() => {
    fetchAssignments();
  }, [filter, pagination.currentPage]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10
      };

      if (filter !== 'all') {
        params.status = filter;
      }

      const data = await getStudentAssignments(params);
      console.log('Fetched assignments:', data);
      setAssignments(data.assignments || []);
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalAssignments: 0,
        hasMore: false
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError(err.message || 'Failed to fetch assignments');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isOverdue = now > dueDate;

    if (assignment.hasSubmitted) {
      return {
        label: 'Submitted',
        icon: CheckCircle,
        className: 'bg-green-100 text-green-800 border-green-300'
      };
    }

    if (isOverdue) {
      return {
        label: 'Overdue',
        icon: XCircle,
        className: 'bg-red-100 text-red-800 border-red-300'
      };
    }

    return {
      label: 'Pending',
      icon: AlertCircle,
      className: 'bg-amber-100 text-amber-800 border-amber-300'
    };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;

    if (diff < 0) return 'Overdue';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Due soon';
  };

  const filterOptions = [
    { value: 'all', label: 'All Assignments' },
    { value: 'pending', label: 'Pending' },
    { value: 'submitted', label: 'Submitted' }
  ];

  if (loading && assignments.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-orange-600 text-lg font-medium">Loading assignments...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Assignments</h1>
            <p className="text-gray-600 text-lg">View and manage your assignments</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Assignments</p>
                  <p className="text-3xl font-bold text-gray-800">{pagination.totalAssignments}</p>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg">
                  <FileText className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {assignments.filter(a => !a.hasSubmitted && new Date() <= new Date(a.dueDate)).length}
                  </p>
                </div>
                <div className="bg-amber-100 p-4 rounded-lg">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Submitted</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {assignments.filter(a => a.hasSubmitted).length}
                  </p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-3">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilter(option.value);
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                  }}
                  className={`px-6 py-2.5 rounded-lg font-semibold ${
                    filter === option.value
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Assignments List */}
          {assignments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-16 text-center">
              <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No assignments found</h3>
              <p className="text-gray-600 text-lg">No assignments available at the moment</p>
            </div>
          ) : (
            <div className="space-y-6">
              {assignments.map((assignment) => {
                const status = getStatusBadge(assignment);
                const StatusIcon = status.icon;
                const isOverdue = new Date() > new Date(assignment.dueDate);

                return (
                  <div
                    key={assignment._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200"
                  >
                    <div className="p-6">
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-800">
                              {assignment.title}
                            </h3>
                            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${status.className}`}>
                              <StatusIcon className="w-4 h-4" />
                              {status.label}
                            </span>
                          </div>
                          {assignment.description && (
                            <p className="text-gray-600 text-base mt-2 line-clamp-2">
                              {assignment.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Assignment Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <Calendar className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Due Date</p>
                            <p className="text-sm text-gray-800 font-semibold">{formatDate(assignment.dueDate)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={`${isOverdue && !assignment.hasSubmitted ? 'bg-red-100' : 'bg-amber-100'} p-2 rounded-lg`}>
                            <Clock className={`w-5 h-5 ${isOverdue && !assignment.hasSubmitted ? 'text-red-600' : 'text-amber-600'}`} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Time Left</p>
                            <p className={`text-sm font-semibold ${isOverdue && !assignment.hasSubmitted ? 'text-red-600' : 'text-gray-800'}`}>
                              {getTimeRemaining(assignment.dueDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Assignment Info</p>
                            <p className="text-sm text-gray-800 font-semibold">
                              {assignment.questions?.length || 0} Questions • {assignment.totalPoints} Points
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Submission Info */}
                      {assignment.mySubmission && (
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 rounded-lg p-5 mb-5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-700 mb-2">
                                <span className="text-orange-600">✓</span> Submitted on {formatDate(assignment.mySubmission.submittedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 mb-4">
                        <button
                          onClick={() => navigate(`/student/assignment/${assignment._id}`)}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg font-semibold shadow-md"
                        >
                          {assignment.hasSubmitted ? 'View Details' : 'Start Assignment'}
                        </button>
                      </div>

                      {/* Additional Info */}
                      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                        <span className="font-medium">
                          <span className="text-gray-500">Instructor:</span> {assignment.instructorName}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="font-medium">
                          <span className="text-gray-500">Batch:</span> {assignment.batch}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="font-medium">
                          <span className="text-gray-500">Type:</span> {assignment.assignmentType.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 font-medium text-gray-700 shadow-sm"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: i + 1 }))}
                    className={`px-4 py-2.5 rounded-lg font-semibold ${
                      pagination.currentPage === i + 1
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={!pagination.hasMore}
                className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 font-medium text-gray-700 shadow-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentAssignments;