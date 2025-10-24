import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FiClock, FiPlus, FiVideo, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  setAllClasses,
  setLoading,
  setError,
} from "../../../redux/classSlice";
import { getInstructorClasses } from "../../../apiCalls/classCalls";

const ClassScheduler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classData, loading } = useSelector((state) => state.class);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1);

    return daysOfWeek.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        day,
        date: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
        fullDate: date,
        isToday: date.toDateString() === new Date().toDateString(),
      };
    });
  };

  const weekDates = getCurrentWeekDates();

  // Fetch classes
  const fetchClasses = async () => {
    try {
      dispatch(setLoading(true));
      const data = await getInstructorClasses({ page: 1, limit: 100 });
      dispatch(setAllClasses(data.classes));
    } catch (err) {
      dispatch(setError(err.message || "Failed to fetch classes"));
      toast.error(err.message || "Failed to fetch classes");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const getClassesForDay = (day) => {
    return classData.filter((cls) => {
      const clsDate = new Date(cls.scheduledAt);
      const clsDay = clsDate.toLocaleDateString("en-US", { weekday: "long" });
      return clsDay === day;
    }).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  };

  const getClassStatus = (scheduledAt, duration) => {
    const now = new Date();
    const startTime = new Date(scheduledAt);
    const endTime = new Date(startTime.getTime() + duration * 60000);
    
    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'ongoing';
    return 'completed';
  };

  const ClassCard = ({ classData }) => {
    const status = getClassStatus(classData.scheduledAt, classData.duration);
    
    const getStatusColor = () => {
      if (status === 'ongoing') return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-2 ring-blue-300';
      if (status === 'upcoming') return 'bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-lg';
      return 'bg-white border border-gray-200 text-gray-700 opacity-75';
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={status !== 'completed' ? { scale: 1.02, y: -2 } : {}}
        className={`p-3 rounded-lg transition-all cursor-pointer mb-2 ${getStatusColor()}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className={`font-semibold text-sm mb-1 line-clamp-2 ${status === 'completed' ? 'text-gray-900' : ''}`}>
            {classData.className}
          </h4>
          {status === 'ongoing' && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              LIVE
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 mb-2">
          <FiUsers size={11} className={status === 'completed' ? 'text-gray-500' : 'opacity-90'} />
          <p className={`text-[11px] truncate ${status === 'completed' ? 'text-gray-600' : 'opacity-90'}`}>
            {classData.batch}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <FiClock size={11} className={status === 'completed' ? 'text-gray-500' : 'opacity-90'} />
          <span className={`text-[11px] font-medium ${status === 'completed' ? 'text-gray-600' : ''}`}>
            {new Date(classData.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            {" - "}
            {new Date(new Date(classData.scheduledAt).getTime() + classData.duration * 60000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {status === 'ongoing' && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 pt-2 border-t border-white/20"
          >
           <a
              href={classData.googleMeetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-white/20 hover:bg-white/30 rounded text-[11px] font-semibold transition-colors"
            >
              <FiVideo size={12} />
              Join Now
            </a>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const getTotalClassesForWeek = () => {
    return classData.length;
  };

  const getUpcomingClassesCount = () => {
    return classData.filter(cls => getClassStatus(cls.scheduledAt, cls.duration) === 'upcoming').length;
  };

  return (
    <div className="bg-[#fff8f2] from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Weekly Schedule</h2>
          <p className="text-sm text-gray-500">
            {getTotalClassesForWeek()} total classes • {getUpcomingClassesCount()} upcoming
          </p>
        </div>
        <button
          onClick={() => navigate("/class-schedule")}
          className="flex items-center gap- px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <span className="font-medium">All Class</span>
        </button>
        
      </div>

      {/* Week Navigator */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="text-sm font-medium text-gray-700">
          {weekDates[0].month} {weekDates[0].date} - {weekDates[6].month} {weekDates[6].date}, {weekDates[0].fullDate.getFullYear()}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
            <span>Live</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-orange-600"></div>
            <span>Upcoming</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span>Completed</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading schedule...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-3">
          {weekDates.map((dayInfo, index) => {
            const dayClasses = getClassesForDay(dayInfo.day);
            const hasOngoingClass = dayClasses.some(cls => getClassStatus(cls.scheduledAt, cls.duration) === 'ongoing');
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl overflow-hidden transition-all ${
                  dayInfo.isToday 
                    ? "ring-2 ring-orange-400 shadow-lg" 
                    : "border border-gray-200 hover:shadow-md"
                } ${hasOngoingClass ? 'ring-2 ring-blue-400' : ''}`}
              >
                {/* Day Header */}
                <div className={`p-3 text-center ${
                  dayInfo.isToday 
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white" 
                    : hasOngoingClass
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                    : "bg-gradient-to-br from-gray-100 to-gray-200"
                }`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide ${
                    dayInfo.isToday || hasOngoingClass ? "" : "text-gray-600"
                  }`}>
                    {dayInfo.day.substring(0, 3)}
                  </p>
                  <p className={`text-2xl font-bold mt-0.5 ${
                    dayInfo.isToday || hasOngoingClass ? "" : "text-gray-900"
                  }`}>
                    {dayInfo.date}
                  </p>
                  {dayClasses.length > 0 && (
                    <p className={`text-[10px] mt-1 font-medium ${
                      dayInfo.isToday || hasOngoingClass ? "opacity-90" : "text-gray-500"
                    }`}>
                      {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                    </p>
                  )}
                </div>

                {/* Classes Container */}
                <div className={`p-2 min-h-[280px] max-h-[280px] overflow-y-auto ${
                  dayInfo.isToday ? "bg-orange-50/30" : "bg-white"
                }`}>
                  {dayClasses.length > 0 ? (
                    dayClasses.map((cls) => <ClassCard key={cls._id} classData={cls} />)
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <FiClock size={20} className="text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-400 font-medium">No classes</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClassScheduler;