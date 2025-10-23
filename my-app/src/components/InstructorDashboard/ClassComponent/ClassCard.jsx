import React from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiLink,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useState } from "react";

const ClassCard = ({ classItem, index, onDelete, onEdit }) => {
  const [showModal, setShowModal] = useState(false);

  const getClassStatus = (scheduledAt, duration) => {
    const now = new Date();
    const startTime = new Date(scheduledAt);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    if (now < startTime) return "upcoming";
    if (now >= startTime && now <= endTime) return "ongoing";
    return "completed";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getTimeInfo = (scheduledAt, duration, status) => {
    const now = new Date();
    const startTime = new Date(scheduledAt);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    if (status === "completed") {
      return { text: "Class ended", type: "ended" };
    }

    if (status === "ongoing") {
      const diff = endTime - now;
      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes <= 0) return { text: "Ending now", type: "ending" };
      if (minutes < 60)
        return { text: `${minutes} min remaining`, type: "ongoing" };
      const hours = Math.floor(minutes / 60);
      return { text: `${hours}h ${minutes % 60}m remaining`, type: "ongoing" };
    }

    const diff = startTime - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0)
      return { text: `In ${days} day${days > 1 ? "s" : ""}`, type: "upcoming" };
    if (hours > 0)
      return {
        text: `In ${hours} hour${hours > 1 ? "s" : ""}`,
        type: "upcoming",
      };
    if (minutes > 0) return { text: `In ${minutes} min`, type: "upcoming" };
    return { text: "Starting now", type: "starting" };
  };

  const status = getClassStatus(classItem.scheduledAt, classItem.duration);
  const timeInfo = getTimeInfo(
    classItem.scheduledAt,
    classItem.duration,
    status
  );
  const showMeetLink = status === "upcoming" || status === "ongoing";

  const getBadgeStyle = (type) => {
    switch (type) {
      case "ongoing":
        return "px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full animate-pulse";
      case "ending":
      case "starting":
        return "px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full";
      case "upcoming":
        return "px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full";
      case "ended":
        return "px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full";
      default:
        return "px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full";
    }
  };

  const getCardStyle = () => {
    if (status === "ongoing") {
      return "border-blue-300 bg-blue-50/40 ring-2 ring-blue-200";
    }
    if (status === "upcoming") {
      return "border-orange-200 bg-orange-50/30";
    }
    return "border-gray-200 bg-gray-50/30";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border rounded-xl p-6 hover:shadow-md transition-shadow ${getCardStyle()}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {classItem.className}
            </h3>
            <span className={getBadgeStyle(timeInfo.type)}>
              {timeInfo.text}
            </span>
            {status === "ongoing" && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                LIVE NOW
              </span>
            )}
          </div>

          {classItem.description && (
            <p className="text-gray-600 mb-4">{classItem.description}</p>
          )}

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

          {status === "ongoing" && showMeetLink && (
            <a
              href={classItem.googleMeetLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                status === "ongoing"
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  : "bg-orange-600 hover:bg-orange-700 text-white"
              }`}
            >
              <FiExternalLink size={16} />
              {status === "ongoing" ? "Join Class Now" : "Join Google Meet"}
            </a>
          )}

          {status === "completed" && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium">
              Class has ended
            </div>
          )}
        </div>

        {status !== "ongoing" && status !== "completed" && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onEdit(classItem)}
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
        )}
      </div>
    </motion.div>
  );
};

export default ClassCard;
