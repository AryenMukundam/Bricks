import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle,
  ArrowRight,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { getStudentAssignments } from '../../../apiCalls/assignmentCalls';

const RecentAssignments = () => {
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await getStudentAssignments({ limit: 5 });
      setRecentAssignments(data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    
    if (assignment.hasSubmitted) {
      return {
        label: 'Submitted',
        icon: CheckCircle,
        className: 'bg-green-100 text-green-700'
      };
    }
    
    if (now > dueDate) {
      return {
        label: 'Overdue',
        icon: XCircle,
        className: 'bg-red-100 text-red-700'
      };
    }
    
    return {
      label: 'Pending',
      icon: AlertCircle,
      className: 'bg-orange-100 text-orange-700'
    };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
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

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Due soon';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-orange-200">
        <div className="text-center text-gray-500">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-orange-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-orange-600">Recent Assignments</h2>
        <button
          onClick={() => navigate('/student/assignments')}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>
      
      {/* Assignments List */}
      {recentAssignments.length === 0 ? (
        <div className="text-center py-12 bg-orange-50 rounded-lg">
          <FileText size={48} className="text-orange-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No assignments yet</p>
          <p className="text-gray-500 text-sm mt-1">New assignments will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentAssignments.map((assignment) => {
            const status = getStatusBadge(assignment);
            const StatusIcon = status.icon;
            const isOverdue = new Date() > new Date(assignment.dueDate);

            return (
              <div
                key={assignment._id}
                onClick={() => navigate(`/student/assignment/${assignment._id}`)}
                className="border border-orange-100 rounded-lg p-4 bg-orange-50/50 hover:bg-orange-50 cursor-pointer"
              >
                {/* Title and Status */}
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-800 flex-1 pr-4">
                    {assignment.title}
                  </h4>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                    <StatusIcon size={12} />
                    {status.label}
                  </span>
                </div>

                {assignment.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {assignment.description}
                  </p>
                )}

                {/* Assignment Details */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-orange-600" />
                    <span>{formatDate(assignment.dueDate)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock size={14} className={isOverdue && !assignment.hasSubmitted ? 'text-red-600' : 'text-orange-600'} />
                    <span className={isOverdue && !assignment.hasSubmitted ? 'text-red-600 font-medium' : ''}>
                      {getTimeRemaining(assignment.dueDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FileText size={14} className="text-orange-600" />
                    <span>{assignment.questions?.length || 0} Questions</span>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-orange-100">
                  <span>Instructor: {assignment.instructorName}</span>
                  <span>Batch: {assignment.batch}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentAssignments;