import { Filter } from 'lucide-react';

export const AssignmentFilters = ({ filters, batches, showFilters, setShowFilters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Filter size={20} className="text-orange-600" />
          Filters
        </h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-orange-600 hover:text-orange-700 font-medium text-sm"
        >
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
            <select
              value={filters.batch}
              onChange={(e) => onFilterChange('batch', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Batches</option>
              {batches.map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.isPublished}
              onChange={(e) => onFilterChange('isPublished', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lock Status</label>
            <select
              value={filters.isLocked}
              onChange={(e) => onFilterChange('isLocked', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="true">Locked</option>
              <option value="false">Unlocked</option>
            </select>
          </div>

     
        </div>
      )}
    </div>
  );
};