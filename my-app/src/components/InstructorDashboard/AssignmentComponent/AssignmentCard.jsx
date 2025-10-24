import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Lock, Unlock, Eye, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';

export const AssignmentCard = ({ assignment, onToggleLock, onPublish, onDelete }) => {
  const navigate = useNavigate();

  const getStatusBadge = (assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    
    if (!assignment.isPublished) {
      return <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">Draft</span>;
    }
    if (assignment.isLocked) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><Lock size={12} />Locked</span>;
    }
    if (now > dueDate) {
      return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Expired</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>;
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-800">{assignment.title}</h3>
              {getStatusBadge(assignment)}
            </div>
            {assignment.description && (
              <p className="text-gray-600 mb-3">{assignment.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-orange-500" />
                <span className="font-medium">Batch:</span> {assignment.batch}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-orange-500" />
                <span className="font-medium">Due:</span> {formatDate(assignment.dueDate)}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-orange-500" />
                <span className="font-medium">Submissions:</span> {assignment.submissionCount || 0}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-orange-500" />
                <span className="font-medium">Questions:</span> {assignment.questions?.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => navigate(`/assignment/${assignment._id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
          >
            <Eye size={16} />
            View
          </button>

          <button
            onClick={() => navigate(`/assignment/${assignment._id}/submissions`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Users size={16} />
            Submissions ({assignment.submissionCount || 0})
          </button>

          {/* Edit button - now available for all assignments */}
          <button
            onClick={() => navigate(`/edit-assignment/${assignment._id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
          >
            <Edit2 size={16} />
            Edit
          </button>

          {/* Publish button - only for drafts */}
          {!assignment.isPublished && (
            <button
              onClick={() => onPublish(assignment._id)}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <CheckCircle size={16} />
              Publish
            </button>
          )}

          <button
            onClick={() => onToggleLock(assignment._id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              assignment.isLocked
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {assignment.isLocked ? <Unlock size={16} /> : <Lock size={16} />}
            {assignment.isLocked ? 'Unlock' : 'Lock'}
          </button>

          <button
            onClick={() => onDelete(assignment._id)}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};