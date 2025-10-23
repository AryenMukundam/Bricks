import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, ExternalLink, BookOpen, FileText } from 'lucide-react';
import { getStudentClasses } from '../../apiCalls/classCalls';
import Navbar from '../../components/StudentDashboard/Navbar';

const AllClass = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [expandedClass, setExpandedClass] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, [filter, currentPage]);

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 10,
      };

      if (filter === 'upcoming') {
        params.upcoming = 'true';
      } else if (filter === 'completed') {
        params.past = 'true'; 
      }

      console.log('Fetching with params:', params);
      const data = await getStudentClasses(params);
      console.log('Received data:', data);
      setClasses(data.classes || []);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (scheduledAt) => {
    const now = new Date();
    const classTime = new Date(scheduledAt);
    const diffMs = classTime - now;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0) {
      return `In ${diffHrs} hour${diffHrs !== 1 ? 's' : ''}`;
    } else if (diffMins > 0) {
      return `In ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
    }
    return '';
  };

  const getClassTimeRemaining = (scheduledAt, duration) => {
    const now = new Date();
    const classTime = new Date(scheduledAt);
    const classEnd = new Date(classTime.getTime() + duration * 60000);
    const remaining = Math.floor((classEnd - now) / (1000 * 60));
    
    if (remaining > 0) {
      return `${remaining} min remaining`;
    }
    return '';
  };

  const togglePreReadExpansion = (classId) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Classes</h1>
            <p className="text-gray-600">View and manage your scheduled classes</p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setFilter('all');
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Classes
              </button>
              <button
                onClick={() => {
                  setFilter('upcoming');
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  filter === 'upcoming'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => {
                  setFilter('completed');
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  filter === 'completed'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Past Classes
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">Error: {error}</p>
              <button 
                onClick={fetchClasses}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Classes List */}
          {!loading && !error && (
            <>
              {classes.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes found</h3>
                  <p className="text-gray-600">
                    {filter === 'upcoming' && 'No upcoming classes scheduled'}
                    {filter === 'completed' && 'No past classes available'}
                    {filter === 'all' && 'No classes available'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {classes.map((cls) => (
                    <div
                      key={cls._id}
                      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
                        cls.status === 'ongoing' ? 'border-2 border-blue-400' : ''
                      }`}
                    >
                      <div className="p-6">
                        {/* Header Section */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {cls.className}
                              </h3>
                              {cls.status === 'scheduled' && (
                                <span className="px-3 py-1 rounded-md text-sm font-medium bg-emerald-50 text-emerald-700">
                                  {getTimeRemaining(cls.scheduledAt)}
                                </span>
                              )}
                              {cls.status === 'ongoing' && (
                                <>
                                  <span className="px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700">
                                    {getClassTimeRemaining(cls.scheduledAt, cls.duration)}
                                  </span>
                                  <span className="px-3 py-1 rounded-md text-sm font-bold bg-red-500 text-white uppercase">
                                    LIVE NOW
                                  </span>
                                </>
                              )}
                              {cls.status === 'completed' && (
                                <span className="px-3 py-1 rounded-md text-sm font-medium bg-gray-200 text-gray-700">
                                  Class ended
                                </span>
                              )}
                              {cls.status === 'cancelled' && (
                                <span className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700">
                                  Cancelled
                                </span>
                              )}
                            </div>
                            {cls.description && (
                              <p className="text-gray-600 text-sm mb-3">
                                {cls.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Details Section */}
                        <div className="flex items-center gap-8 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-orange-500" />
                            <span>{formatDate(cls.scheduledAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={18} className="text-orange-500" />
                            <span>{cls.duration} minutes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={18} className="text-orange-500" />
                            <span>Batch: {cls.batch || 'N/A'}</span>
                          </div>
                          {cls.preReadLinks && cls.preReadLinks.length > 0 && (
                            <div className="flex items-center gap-2">
                              <BookOpen size={18} className="text-orange-500" />
                              <span>{cls.preReadLinks.length} Pre-read{cls.preReadLinks.length > 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>

                        {/* Pre-read Materials Section */}
                        {cls.preReadLinks && cls.preReadLinks.length > 0 && (
                          <div className="mb-4">
                            <button
                              onClick={() => togglePreReadExpansion(cls._id)}
                              className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                            >
                              <BookOpen size={16} />
                              <span>
                                {expandedClass === cls._id ? 'Hide' : 'View'} Pre-read Materials ({cls.preReadLinks.length})
                              </span>
                            </button>
                            
                            {expandedClass === cls._id && (
                              <div className="mt-3 space-y-2">
                                {cls.preReadLinks.map((preRead, index) => (
                                  <div 
                                    key={index}
                                    className="bg-orange-50 border border-orange-200 rounded-lg p-3 hover:bg-orange-100 transition-colors"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <FileText size={16} className="text-orange-600 flex-shrink-0" />
                                          <h4 className="font-medium text-gray-900">
                                            {preRead.title}
                                          </h4>
                                        </div>
                                        {preRead.description && (
                                          <p className="text-sm text-gray-600 ml-6">
                                            {preRead.description}
                                          </p>
                                        )}
                                      </div>
                                      <a
                                        href={preRead.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors whitespace-nowrap"
                                      >
                                        <ExternalLink size={14} />
                                        <span>Open</span>
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Button */}
                        {cls.status === 'ongoing' && (
                          <a
                            href={cls.googleMeetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            <ExternalLink size={18} />
                            <span>Join Class Now</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-2">
                    {[...Array(Math.min(pagination.totalPages, 5))].map((_, idx) => {
                      let pageNumber;
                      if (pagination.totalPages <= 5) {
                        pageNumber = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = idx + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNumber = pagination.totalPages - 4 + idx;
                      } else {
                        pageNumber = currentPage - 2 + idx;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === pageNumber
                              ? 'bg-orange-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={currentPage === pagination.totalPages}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AllClass;