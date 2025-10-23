import React from "react";
import { motion } from "framer-motion";
import { 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiEdit2, 
  FiTrash2, 
  FiExternalLink, 
  FiLink 
} from "react-icons/fi";
import toast from "react-hot-toast";

const ClassCard = ({ classItem, index, onDelete }) => {
  // Check if class is upcoming or past
  const isUpcoming = (scheduledAt) => {
    return new Date(scheduledAt) > new Date();
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Get time remaining until class
  const getTimeRemaining = (scheduledAt) => {
    const now = new Date();
    const classTime = new Date(scheduledAt);
    const diff = classTime - now;
    
    if (diff < 0) return "Class ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `In ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `In ${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `In ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return "Starting now";
  };

  const upcoming = isUpcoming(classItem.scheduledAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border rounded-xl p-6 hover:shadow-md transition-shadow ${
        upcoming 
          ? "border-orange-200 bg-orange-50/30" 
          : "border-gray-200 bg-gray-50/30"
      }`}
    >
      <div className="flex items-start justify-between">
        {/* Left Section */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {classItem.className}
            </h3>
            {upcoming && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                {getTimeRemaining(classItem.scheduledAt)}
              </span>
            )}
            {!upcoming && (
              <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                Completed
              </span>
            )}
          </div>

          {classItem.description && (
            <p className="text-gray-600 mb-4">
              {classItem.description}
            </p>
          )}

          {/* Class Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <FiCalendar className="text-orange-600" size={18} />
              <span className="text-sm">
                {formatDate(classItem.scheduledAt)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FiClock className="text-orange-600" size={18} />
              <span className="text-sm">{classItem.duration} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FiUsers className="text-orange-600" size={18} />
              <span className="text-sm">Batch: {classItem.batch}</span>
            </div>
          </div>

          {/* Pre-Read Links */}
          {classItem.preReadLinks && classItem.preReadLinks.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Pre-Read Materials:
              </p>
              <div className="space-y-2">
                {classItem.preReadLinks.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    <FiLink size={14} />
                    <span>{link.title}</span>
                    <FiExternalLink size={12} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Meet Link */}
          {upcoming && (
            <a
              href={classItem.googleMeetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              <FiExternalLink size={16} />
              Join Google Meet
            </a>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => {
              toast.info("Edit feature coming soon!");
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit class"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(classItem._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete class"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ClassCard;