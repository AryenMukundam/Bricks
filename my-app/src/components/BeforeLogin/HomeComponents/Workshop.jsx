import React, { useState } from "react";

const Workshop = () => {
  const [activeDay, setActiveDay] = useState(0);

  const days = [
    {
      id: 1,
      title: "DAY 1 – Mindset & Curiosity",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
      accentColor: "bg-orange-500",
      sessions: [
        { time: "45 min", activity: "Intro + Icebreaking", description: "Meet your mentors, teammates, and the BRICKS vibe.", icon: "👋" },
        { time: "30 min", activity: "Team Formation + Kit Distribution", description: "Each team gets material to build their own Robos!", icon: "🤝" },
        { time: "1 hour", activity: "Basics Of Robotics", description: "Covering fundamentals of all sensors and its working principles.", icon: "🔧" },
        { time: "2 hour", activity: "Build a basic Robot", description: "With our support kids build a fully working Robot car!", icon: "🤖" },
        { time: "1 hour", activity: "Car races", description: "Students compete for points, racing with Robot cars!", icon: "🏎️" },
      ],
    },
    {
      id: 2,
      title: "DAY 2 – Hands-On Innovation: Build for Impact",
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-purple-50",
      accentColor: "bg-blue-500",
      sessions: [
        { time: "1 hour", activity: "Understanding real world Problems", description: "Teams tinker on actual problems like a helper for blinds!", icon: "🌍" },
        { time: "2–2.5 hour", activity: "The Build Starts", description: "Students start building with AI as their assistant & learn deep tech.", icon: "🛠️" },
        { time: "1.5 hours", activity: "Real depth behind the build", description: "Research & add innovation to solve the real problem.", icon: "🔍" },
        { time: "30 min", activity: "Starts with Presentation preparation", description: "Review progress & prepare for final touches.", icon: "📋" },
      ],
    },
    {
      id: 3,
      title: "DAY 3 – Grand Exhibition",
      color: "from-green-500 to-teal-600",
      bgColor: "bg-gradient-to-br from-green-50 to-teal-50",
      accentColor: "bg-green-500",
      sessions: [
        { time: "1.5 hour", activity: "Final work towards project & Prep", description: "Students finalize their prototypes and solutions.", icon: "⚡" },
        { time: "30 min", activity: "Presentation Prep", description: "Pitching skills and team planning.", icon: "🎯" },
        { time: "2 hour", activity: "Grand Exhibition Starts", description: "Present ideas to the Panel/Parents/Teachers.", icon: "🎭" },
        { time: "40–50 min", activity: "Final Prize Distribution + Reflection", description: "Final awards and student reflections.", icon: "🏆" },
      ],
    },
  ];

  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-16 bg-gray-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-40 md:w-60 h-40 md:h-60 bg-orange-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 md:w-64 h-48 md:h-64 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <span className="text-orange-500 text-sm md:text-base font-bold uppercase tracking-widest mb-3 block">
            Interactive Learning Journey
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 relative">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">3-Day</span> Innovation Workshop
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 md:w-32 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 rounded-full"></div>
          </h2>
          <p className="text-gray-600 text-sm md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            Experience hands-on learning through our carefully crafted 3-day journey.
          </p>
        </div>

        {/* Day Navigation Tabs */}
        <div className="flex justify-center mb-8 flex-wrap gap-2 md:gap-4">
          {days.map((day, index) => (
            <button
              key={day.id}
              onClick={() => setActiveDay(index)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 ${
                activeDay === index
                  ? `bg-gradient-to-r ${day.color} text-white shadow-lg transform scale-105`
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Day {day.id}
            </button>
          ))}
        </div>

        {/* Active Day Content */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Day Header */}
          <div className={`bg-gradient-to-r ${days[activeDay].color} text-white p-4 md:p-6 text-center`}>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">
              {days[activeDay].title}
            </h3>
          </div>

          {/* Sessions Scrollable Container */}
          <div className="h-[24rem] md:h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {days[activeDay].sessions.map((session, sessionIndex) => (
                <div
                  key={sessionIndex}
                  className={`${days[activeDay].bgColor} rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 border border-white/50 relative overflow-hidden group`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <div className="absolute -top-6 -right-6 w-16 md:w-20 h-16 md:h-20 bg-white rounded-full"></div>
                    <div className="absolute -bottom-6 -left-6 w-12 md:w-16 h-12 md:h-16 bg-gray-300 rounded-full"></div>
                  </div>

                  <div className="relative z-10 flex items-start gap-3 md:gap-4">
                    {/* Icon & Time */}
                    <div className="flex-shrink-0">
                      <div className="text-2xl md:text-3xl mb-1 md:mb-2">{session.icon}</div>
                      <div className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full ${days[activeDay].accentColor} text-white text-xs md:text-sm font-bold shadow-md`}>
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                          <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"/>
                        </svg>
                        {session.time}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="text-sm md:text-lg font-bold text-gray-800 mb-1 md:mb-2">
                        {session.activity}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                        {session.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Workshop;
