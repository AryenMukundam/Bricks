import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentClasses } from '../../../apiCalls/classCalls';
// Helper to calculate duration
const calculateDuration = (timeString) => {
  try {
    const [startTimeStr, endTimeStr] = timeString.split(' - ');
    const startDate = new Date(`2025-01-01 ${startTimeStr}`);
    const endDate = new Date(`2025-01-01 ${endTimeStr}`);
    let diff = endDate.getTime() - startDate.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));

    let duration = '';
    if (hours > 0) duration += `${hours} hr `;
    if (minutes > 0) duration += `${minutes} min`;
    
    return duration.trim();
  } catch (e) {
    return '';
  }
};

const Class = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [classesByDate, setClassesByDate] = useState({});
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStudentClasses({ upcoming: 'true', page: 1, limit: 50 }); // fetch enough classes

      // Transform the data into date-wise mapping
      const grouped = {};
      data.classes.forEach((cls) => {
        const dateStr = new Date(cls.scheduledAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        if (!grouped[dateStr]) grouped[dateStr] = [];
        grouped[dateStr].push({
          id: cls._id,
          title: cls.className,
          type: cls.status === 'ongoing' ? 'Live Class' : 'Scheduled Class',
          time: `${new Date(cls.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(new Date(cls.scheduledAt).getTime() + cls.duration * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        });
      });

      const sortedDates = Object.keys(grouped).sort(
        (a, b) => new Date(a) - new Date(b)
      );

      setClassesByDate(grouped);
      setDates(sortedDates);
      setSelectedDate(sortedDates[0] || ''); // default to first date
    } catch (err) {
      console.error(err);
      setError('Failed to fetch classes.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Time Table</h1>
        <p className="text-slate-500 mt-1">Your daily schedule for Robotics & AI courses</p>
      </div>

      {/* View All Classes Button */}
      <div className="flex justify-center mb-6">
        <button onClick={() => navigate('/classes')} className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors shadow-md">
          View All Classes
        </button>
      </div>

      {/* Date Navigation */}
      <div className="flex justify-center mb-10">
        <div className="flex gap-1 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`py-2 px-5 text-sm font-semibold rounded-lg transition-all duration-300 whitespace-nowrap ${
                selectedDate === date
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-12 top-2 h-full w-0.5 bg-slate-200" aria-hidden="true"></div>

        {classesByDate[selectedDate]?.length > 0 ? (
          <div className="space-y-8">
            {classesByDate[selectedDate].map((classItem) => (
              <div key={classItem.id} className="relative">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-24 text-right pr-8">
                    <p className="font-bold text-orange-600 text-sm">
                      {classItem.time.split(' - ')[0]}
                    </p>
                  </div>

                  <div className="flex-grow bg-white border border-slate-200 rounded-lg p-5 ml-4 hover:border-orange-300 hover:shadow-md transition-all duration-200 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-slate-800 text-lg leading-tight flex-1">
                        {classItem.title}
                      </h3>
                      <span className="text-xs text-slate-400 ml-4">
                        {classItem.time.split(' - ')[1]}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-500 gap-4 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        {classItem.type}
                      </span>
                      <span className="text-slate-300" aria-hidden="true">•</span>
                      <span className="font-medium text-orange-700 bg-orange-50 px-3 py-1 rounded-full text-xs">
                        {calculateDuration(classItem.time)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400">
                      Full time: {classItem.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">It's a free day!</h3>
            <p className="text-slate-400">No classes scheduled for this date. Perfect time for self-study or project work.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Class;
