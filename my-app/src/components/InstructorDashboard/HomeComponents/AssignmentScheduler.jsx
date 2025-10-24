import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight, Clock, Lock, CheckCircle } from "lucide-react";
import { setAllAssignments, setLoading, setError } from "../../../redux/assignmentSlice";

export default function AssignmentScheduler() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assignmentData, loading } = useSelector((state) => state.assignment);
  const { instructorData } = useSelector((state) => state.instructor);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (assignmentData.length === 0 && instructorData?._id) {
        dispatch(setLoading(true));
        try {
          const response = await fetch(`/api/assignments?instructorId=${instructorData._id}`);
          if (!response.ok) throw new Error('Failed to fetch assignments');
          const data = await response.json();
          dispatch(setAllAssignments(data));
        } catch (error) {
          console.error('Error fetching assignments:', error);
          dispatch(setError(error.message));
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    fetchAssignments();
  }, [dispatch, instructorData?._id, assignmentData.length]);

  const recentAssignments = assignmentData.slice(0, 3);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-orange-200">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-orange-200">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-orange-600">Recent Assignments</h2>
        <button
          onClick={() => navigate("/instructor/assignments")}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2"
        >
          View All 
          <ArrowRight size={16} />
        </button>
      </div>

      {recentAssignments.length === 0 ? (
        <div className="text-center py-12 bg-orange-50 rounded-lg">
          <Calendar size={48} className="text-black-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No assignments created yet</p>
          <p className="text-gray-500 text-sm mt-1">Create your first assignment to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentAssignments.map((a) => (
            <div
              key={a._id}
              className="border border-orange-100 rounded-lg p-4 bg-orange-50/50 hover:bg-orange-50"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 flex-1 pr-4">
                  {a.title}
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                    a.isLocked
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {a.isLocked ? (
                    <>
                      <Lock size={12} /> Locked
                    </>
                  ) : (
                    <>
                      <CheckCircle size={12} /> Active
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-2 text-green-700 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(a.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>
                    {new Date(a.dueDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2">
                {a.description || "No description provided."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}