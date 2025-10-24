import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  getInstructorAssignments,
  toggleAssignmentLock,
  publishAssignment,
  deleteAssignment
} from '../../apiCalls/assignmentCalls';
import { AssignmentCard } from '../../components/InstructorDashboard/AssignmentComponent/AssignmentCard';
import { AssignmentPagination } from '../../components/InstructorDashboard/AssignmentComponent/AssignmentPagination';
import { AssignmentStats } from '../../components/InstructorDashboard/AssignmentComponent/AssignmentStats';
import { EmptyState } from '../../components/InstructorDashboard/AssignmentComponent/EmptyState';
import { AssignmentFilters } from '../../components/InstructorDashboard/AssignmentComponent/AssignmentFilters';
const AllAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    batch: '',
    isPublished: '',
    isLocked: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAssignments: 0,
    hasMore: false
  });
  const [batches, setBatches] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [filters]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      
      const params = {
        ...(filters.batch && { batch: filters.batch }),
        ...(filters.isPublished !== '' && { isPublished: filters.isPublished }),
        ...(filters.isLocked !== '' && { isLocked: filters.isLocked }),
        page: filters.page,
        limit: filters.limit
      };

      const response = await getInstructorAssignments(params);
      
      setAssignments(response.assignments);
      setPagination(response.pagination);
      
      const uniqueBatches = [...new Set(response.assignments.map(a => a.batch))];
      setBatches(uniqueBatches);
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch assignments');
      console.error('Fetch assignments error:', err);
    } finally {
      setLoading(false);
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

  const handlePublish = async (assignmentId) => {
    try {
      await publishAssignment(assignmentId);
      fetchAssignments();
    } catch (err) {
      alert(err.message || 'Failed to publish assignment');
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };



  return (
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
          
          <AssignmentFilters
            filters={filters}
            batches={batches}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            onFilterChange={handleFilterChange}
          />
        </div>


        {assignments.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment._id}
                assignment={assignment}
                onToggleLock={handleToggleLock}
                onPublish={handlePublish}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <AssignmentPagination pagination={pagination} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default AllAssignments;