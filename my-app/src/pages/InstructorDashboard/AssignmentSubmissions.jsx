import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, Calendar, Award, Clock, 
  FileText, TrendingUp, XCircle 
} from 'lucide-react';
import { getAssignmentSubmissions } from '../../apiCalls/assignmentCalls';
import Navbar from '../../components/InstructorDashboard/Navbar';

const AssignmentSubmissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [submissions, setSubmissions] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, [id]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getAssignmentSubmissions(id);
      setSubmissions(response.submissions || []);
      setAssignment(response.assignment || null);
      setStatistics(response.statistics || null);
      setError(null);
    } catch (err) {
      console.error('Fetch submissions error:', err);
      setError(err.message || 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = () => {
    alert('Coming Soon! 🚀\n\nSubmission details feature will be available soon.');
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch =
      submission.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.student?.enrollmentNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-orange-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading submissions...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-orange-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-lg font-medium mb-4">{error}</p>
              <button
                onClick={() => navigate('/instructor/assignments')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Back to Assignments
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-orange-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(`/assignment/${id}`)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Assignment Details
          </button>

          {/* Header */}
          {assignment && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-orange-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{assignment.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users size={16} className="text-orange-500" />
                      Batch: {assignment.batch}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={16} className="text-orange-500" />
                      Due: {formatDate(assignment.dueDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award size={16} className="text-orange-500" />
                      Total Points: {assignment.totalPoints}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Students</p>
                    <p className="text-2xl font-bold text-gray-800">{statistics.totalStudents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Clock className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Submissions</p>
                    <p className="text-2xl font-bold text-gray-800">{statistics.totalSubmissions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <TrendingUp className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Submission Rate</p>
                    <p className="text-2xl font-bold text-gray-800">{statistics.submissionRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submissions List */}
          <div className="bg-white rounded-lg shadow-lg border border-orange-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="text-orange-500" size={24} />
                Submissions ({filteredSubmissions.length})
              </h2>
            </div>

            {filteredSubmissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Enrollment No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Submitted At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission._id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 font-bold">
                                {submission.studentName?.charAt(0).toUpperCase() || 'S'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {submission.studentName || 'Unknown Student'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {submission.student?.email || ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {submission.student?.enrollmentNumber || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock size={14} />
                            {formatDate(submission.submittedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={handleViewDetails}
                            className="text-orange-600 hover:text-orange-700 font-medium"
                          >
                            View Details →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <XCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg font-medium mb-2">No Submissions Found</p>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No students have submitted this assignment yet'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignmentSubmissions;