import { useNavigate } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';

export const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No assignments found</h3>
      <p className="text-gray-500 mb-6">Get started by creating your first assignment</p>
      <button
        onClick={() => navigate('/assignment-schedule')}
        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
      >
        <Plus size={20} />
        Create Assignment
      </button>
    </div>
  );
};