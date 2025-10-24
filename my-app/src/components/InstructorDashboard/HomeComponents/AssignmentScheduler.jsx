import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AssignmentScheduler() {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleCreateAssignment = () => {
    if (title && dueDate) {
      // In a real app, save the assignment here
      window.location.href = '/assignment-schedule';
    }
  };

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Assignment</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Assignment title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleCreateAssignment}
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-6"
          >
            <Plus size={20} />
            Create & View Schedule
          </button>

          <button
            onClick={()=>{navigate('/instructor/assignments')}}
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-6"
          >
            <Plus size={20} />
            View more
          </button>
        </div>
      </div>
    </div>
  );
}