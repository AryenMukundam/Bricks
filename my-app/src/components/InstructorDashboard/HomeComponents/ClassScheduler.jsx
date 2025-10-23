import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FiClock, FiPlus, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  setClassData,
  setAllClasses,
  removeClassData,
  setLoading,
  setError,
} from "../../../redux/classSlice";
import { getInstructorClasses, deleteClass } from "../../../apiCalls/classCalls";

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
    });
  };

  const handleDeleteClass = async (id) => {
    try {
      await deleteClass(id);
      dispatch(removeClassData(id));
      toast.success("Class deleted successfully");
      console.log("Deleted")
    } catch (err) {
      console.error("Error deleting class:", err);
      toast.error("Failed to delete class");
    }
  };

  const ClassCard = ({ classData }) => (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-all cursor-pointer mb-2"
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{classData.className}</h4>
          <p className="text-xs text-gray-500 mb-2 truncate">{classData.batch}</p>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <FiClock size={12} />
              {new Date(classData.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
              {new Date(new Date(classData.scheduledAt).getTime() + classData.duration * 60000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <button onClick={() => handleDeleteClass(classData._id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
          <FiX size={18} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Schedule</h2>
        <button
          onClick={() => navigate("/class-schedule")}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FiPlus size={18} />
          Add Class
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-20">Loading classes...</p>
      ) : (
        <div className="grid grid-cols-7 gap-3">
          {weekDates.map((dayInfo, index) => {
            const dayClasses = getClassesForDay(dayInfo.day);
            return (
              <div
                key={index}
                className={`rounded-lg border ${
                  dayInfo.isToday ? "border-orange-500 bg-orange-50/50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="p-3 text-center border-b border-purple-200">
                  <p className={`text-xs font-medium ${dayInfo.isToday ? "text-orange-600" : "text-gray-500"}`}>
                    {dayInfo.day.substring(0, 3)}
                  </p>
                  <p className={`text-lg font-bold mt-1 ${dayInfo.isToday ? "text-orange-600" : "text-gray-900"}`}>
                    {dayInfo.date}
                  </p>
                </div>

                <div className="p-2 min-h-[200px]">
                  {dayClasses.length > 0 ? (
                    dayClasses.map((cls) => <ClassCard key={cls._id} classData={cls} />)
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-gray-400">No classes</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClassScheduler;
