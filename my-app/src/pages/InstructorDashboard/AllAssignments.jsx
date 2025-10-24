import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  getInstructorAssignments,
  toggleAssignmentLock,
  deleteAssignment
} from '../../apiCalls/assignmentCalls';
import { AssignmentCard } from '../../components/InstructorDashboard/AssignmentComponent/AssignmentCard';
import { AssignmentPagination } from '../../components/InstructorDashboard/AssignmentComponent/AssignmentPagination';
import { AssignmentStats } from '../../components/InstructorDashboard/AssignmentComponent/AssignmentStats';
import { EmptyState } from '../../components/InstructorDashboard/AssignmentComponent/EmptyState';
import Navbar from '../../components/InstructorDashboard/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAllAssignments,
  setPagination,
  setLoading,
  setError,
} from '../../redux/assignmentSlice';

const AllAssignments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Pull global state from Redux
  const { assignmentData: assignments, loading, error, pagination } = useSelector(
    (state) => state.assignment
  );

  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  const fetchAssignments = async () => {
    try {
      dispatch(setLoading(true));

      const params = {
        page: pagination.currentPage,
        limit: 10,
      };

      const response = await getInstructorAssignments(params);

      // ✅ Store globally
      dispatch(setAllAssignments(response.assignments));
      dispatch(setPagination(response.pagination));
      dispatch(setError(null));
    } catch (err) {
      console.error('Fetch assignments error:', err);
      dispatch(setError(err.message || 'Failed to fetch assignments'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleToggleLock = async (assignmentId) => {
    try {
      await toggleAssignmentLock(assignmentId);
      fetchAssignments();
    } catch (err) {
      alert(err.message || 'Failed to toggle lock');
    }
  };

  const handleDelete = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await deleteAssignment(assignmentId);
      fetchAssignments();
    } catch (err) {
      alert(err.message || 'Failed to delete assignment');
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(
      setPagination({
        ...pagination,
        currentPage: newPage,
      })
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading assignments...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">All Assignments</h1>
                <p className="text-gray-600">Manage and track all your scheduled assignments</p>
              </div>
              <button
                onClick={() => navigate('/assignment-schedule')}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus size={20} />
                Create Assignment
              </button>
            </div>

            <AssignmentStats pagination={pagination} assignments={assignments} />
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {assignments.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  onToggleLock={handleToggleLock}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          <AssignmentPagination pagination={pagination} onPageChange={handlePageChange} />
        </div>
      </div>
    </>
  );
};

export default AllAssignments;
