import { Calendar, CheckCircle, Lock } from 'lucide-react';

export const AssignmentStats = ({ pagination, assignments }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Assignments</p>
            <p className="text-2xl font-bold text-gray-800">{pagination.totalAssignments}</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <Calendar className="text-orange-600" size={24} />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-2xl font-bold text-gray-800">
              {assignments.filter(a => {
                const now = new Date();
                const dueDate = new Date(a.dueDate);
                return !a.isLocked && now <= dueDate;
              }).length}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Locked</p>
            <p className="text-2xl font-bold text-gray-800">
              {assignments.filter(a => a.isLocked).length}
            </p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <Lock className="text-red-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};