import React, { useState } from 'react';
import { ChevronRight, Star, ChevronLeft } from 'lucide-react';

const Practice = () => {
  const [activeTab, setActiveTab] = useState('Start Solving');

  const problemsData = {
    'Start Solving': [
      {
        id: 1,
        title: 'Robot Path Planning Algorithm',
        category: 'Robotics',
        difficulty: 'Easy',
        description: 'Implement A* pathfinding for autonomous robot navigation'
      },
      {
        id: 2,
        title: 'Neural Network Weight Optimization',
        category: 'AI/ML',
        difficulty: 'Medium',
        description: 'Optimize neural network weights using gradient descent'
      },
      {
        id: 3,
        title: 'Computer Vision Object Detection',
        category: 'Computer Vision',
        difficulty: 'Hard',
        description: 'Build YOLO-based object detection system'
      },
      {
        id: 4,
        title: 'Sensor Data Fusion Implementation',
        category: 'IoT/Sensors',
        difficulty: 'Medium',
        description: 'Combine multiple sensor inputs using Kalman filters'
      },
      {
        id: 5,
        title: 'Reinforcement Learning Agent',
        category: 'AI/ML',
        difficulty: 'Hard',
        description: 'Train an RL agent to play robotics simulation game'
      },
      {
        id: 6,
        title: 'Natural Language Command Parser',
        category: 'NLP',
        difficulty: 'Easy',
        description: 'Parse voice commands for robot control interface'
      },
      {
        id: 7,
        title: 'Machine Learning Pipeline Design',
        category: 'AI/ML',
        difficulty: 'Medium',
        description: 'Build end-to-end ML pipeline for robotics data'
      },
      {
        id: 8,
        title: 'Autonomous Vehicle Control',
        category: 'Robotics',
        difficulty: 'Hard',
        description: 'Implement PID controller for self-driving car'
      }
    ],

    'Saved': [
      {
        id: 11,
        title: 'Advanced Motion Planning',
        category: 'Robotics',
        difficulty: 'Hard',
        description: 'Complex trajectory optimization for robotic arms'
      }
    ]
  };

  const tabs = ['Start Solving','Saved'];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const scrollLeft = (containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dive In</h1>
          <button className="text-black-500 hover:text-orange-800 font-medium text-sm">
            All Problems
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium transition-colors duration-200 relative ${
                activeTab === tab
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {problemsData[activeTab]?.length > 0 && (
            <>
              <button
                onClick={() => scrollLeft(`carousel-${activeTab}`)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              
              <button
                onClick={() => scrollRight(`carousel-${activeTab}`)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </>
          )}

          {/* Problems Carousel */}
          <div
            id={`carousel-${activeTab}`}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-8 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {problemsData[activeTab]?.map((problem) => (
              <div
                key={problem.id}
                className="flex-shrink-0 w-72 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg hover:border-orange-200 transition-all duration-200 cursor-pointer group"
              >
                {/* Problem Title */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight group-hover:text-orange-600 transition-colors">
                    {problem.title}
                  </h3>
                  <Star className="w-4 h-4 text-gray-300 hover:text-yellow-400 cursor-pointer flex-shrink-0 ml-2" />
                </div>

                {/* Category */}
                <p className="text-xs text-gray-500 mb-3">{problem.category}</p>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  {problem.description}
                </p>

                {/* Difficulty & Continue */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-gray-400 group-hover:text-orange-500 transition-colors">
                    <span className="text-xs font-medium">Solve</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            )) || (
              <div className="flex-shrink-0 w-full text-center py-12">
                <div className="text-gray-400 mb-2">📝</div>
                <h3 className="text-lg font-medium text-gray-500 mb-1">No problems available</h3>
                <p className="text-gray-400 text-sm">Check back later for new practice problems.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;