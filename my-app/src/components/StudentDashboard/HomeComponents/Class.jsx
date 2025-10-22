import React, { useState } from 'react';

// A helper function to calculate the duration of a class
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
    return ''; // Return empty string if format is unexpected
  }
};

const Class = () => {
  const [selectedDate, setSelectedDate] = useState('26 Sep');

  const classData = {
    '26 Sep': [
      {
        id: 1,
        title: 'Introduction to Robotics Fundamentals',
        type: 'Live Class',
        time: '09:00 AM - 11:00 AM',
      },
      {
        id: 2,
        title: 'AI Ethics and Philosophy',
        type: 'Live Class',
        time: '02:00 PM - 03:30 PM',
      }
    ],
    '29 Sep': [
      {
        id: 3,
        title: 'Machine Learning Basics Workshop',
        type: 'Live Class',
        time: '10:00 AM - 12:30 PM',
      },
      {
        id: 4,
        title: 'Robotics Programming with Python',
        type: 'Live Class',
        time: '12:30 PM - 01:00 PM',
      },
      {
        id: 5,
        title: 'Neural Networks Introduction',
        type: 'Live Class',
        time: '02:00 PM - 04:15 PM',
      }
    ],
    '30 Sep': [
      {
        id: 6,
        title: 'Computer Vision Fundamentals',
        type: 'Live Class',
        time: '10:00 AM - 12:00 PM',
      },
      {
        id: 7,
        title: 'Sensor Integration in Robotics',
        type: 'Live Class',
        time: '01:00 PM - 03:00 PM',
      }
    ],
    '3 Oct': [
      {
        id: 8,
        title: 'Natural Language Processing Basics',
        type: 'Live Class',
        time: '09:00 AM - 11:00 AM',
      },
      {
        id: 9,
        title: 'Autonomous Navigation Systems',
        type: 'Live Class',
        time: '02:00 PM - 04:00 PM',      }
    ],
    '4 Oct': [
      {
        id: 10,
        title: 'AI Algorithm Implementation',
        type: 'Live Class',
        time: '10:00 AM - 12:00 PM',
      },
      {
        id: 11,
        title: 'Robotics Project Showcase',
        type: 'Live Class',
        time: '02:00 PM - 04:00 PM',      }
    ]
  };

  const dates = ['26 Sep', '29 Sep', '30 Sep', '3 Oct', '4 Oct'];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Time Table</h1>
        <p className="text-slate-500 mt-1">Your daily schedule for Robotics & AI courses</p>
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
        {/* The vertical line of the timeline */}
        <div className="absolute left-12 top-2 h-full w-0.5 bg-slate-200" aria-hidden="true"></div>

        {classData[selectedDate]?.length > 0 ? (
          <div className="space-y-8">
            {classData[selectedDate].map((classItem) => (
              <div key={classItem.id} className="relative">
                <div className="flex items-start">
                  {/* Time & Dot Column */}
                  <div className="flex-shrink-0 w-24 text-right pr-8">
                    <p className="font-bold text-orange-600 text-sm">
                      {classItem.time.split(' - ')[0]}
                    </p>
                  </div>
                  
    
                  
                  {/* Content Column */}
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

                    <div className="flex justify-between items-center">
                      <div className="text-xs text-slate-400">
                        Full time: {classItem.time}
                      </div>
                      <button className="bg-orange-50 text-orange-600 text-sm font-medium py-2 px-4 rounded-md hover:bg-orange-100 transition-colors duration-200 border border-orange-200">
                        View Details
                      </button>
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