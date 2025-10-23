import React from "react";
import { FiCalendar, FiRefreshCw } from "react-icons/fi";
import ClassCard from "./ClassCard";

const ClassList = ({
  classes = [],
  selectedFilter,
  setSelectedFilter,
  fetchLoading,
  onDeleteClass,
  onEditClass
}) => {
  const isUpcoming = (scheduledAt) => {
    return new Date(scheduledAt) > new Date();
  };

  const isPast = (scheduledAt, duration) => {
    const start = new Date(scheduledAt);
    const end = new Date(start.getTime() + duration * 60000);
    return end < new Date();
  };

  const getFilteredClasses = () => {
    if (!classes || classes.length === 0) return [];

    switch (selectedFilter) {
      case "upcoming":
        return classes.filter((cls) => isUpcoming(cls.scheduledAt));
      case "past":
        return classes.filter((cls) => isPast(cls.scheduledAt, cls.duration));
      default:
        return classes;
    }
  };

  const filteredClasses = getFilteredClasses();

  const sortedClasses = [...filteredClasses].sort(
    (a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedFilter === "all"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Classes
          </button>
          <button
            onClick={() => setSelectedFilter("upcoming")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedFilter === "upcoming"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setSelectedFilter("past")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedFilter === "past"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      <div className="p-6">
        {fetchLoading && sortedClasses.length === 0 ? (
          <div className="text-center py-12">
            <FiRefreshCw
              className="animate-spin mx-auto text-orange-600 mb-4"
              size={48}
            />
            <p className="text-gray-500">Loading classes...</p>
          </div>
        ) : sortedClasses.length === 0 ? (
          <div className="text-center py-12">
            <FiCalendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg mb-2">
              {selectedFilter === "all" && "No classes scheduled yet"}
              {selectedFilter === "upcoming" && "No upcoming classes"}
              {selectedFilter === "past" && "No past classes"}
            </p>
            <p className="text-gray-400 text-sm">
              Click "Schedule New Class" to get started
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedClasses.map((classItem, index) => (
              <ClassCard
                key={classItem._id || index}
                classItem={classItem}
                index={index}
                onDelete={onDeleteClass}
                onEdit={() => onEditClass(classItem)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassList;
