import React from "react";
import {
  Star,
  Zap,
  Users,
  Trophy,
  BookOpen,
  Home,
  Recycle,
  Heart,
  Shield,
  GraduationCap,
  CloudRain,
  Stethoscope,
  BookMarked,
} from "lucide-react";

const ProjectsCarousel = () => {
  const projects = [
    {
      id: 1,
      title: "Smart Plant Care Robot",
      category: "Home & Garden",
      description:
        "Build an AI plant assistant that knows when your plants need water! Perfect for busy families.",
      difficulty: "Beginner",
      skillsGained: "Arduino programming, sensor integration, problem-solving",
      icon: Home,
      color: "green",
    },
    {
      id: 2,
      title: "Pet Butler Robot",
      category: "Smart Home",
      description:
        "Build the ultimate pet care assistant! Feeds your furry friends on schedule and tracks their health.",
      difficulty: "Intermediate",
      skillsGained: "App development, real-time systems, user interface design",
      icon: Heart,
      color: "pink",
    },
    {
      id: 3,
      title: "Home Security Guardian",
      category: "Safety & Security",
      description:
        "Design a smart security robot that protects your home and sends alerts to your phone. Feel like a tech superhero!",
      difficulty: "Advanced",
      skillsGained:
        "Image processing, wireless communication, security protocols",
      icon: Shield,
      color: "blue",
    },
    {
      id: 4,
      title: "Eco-Warrior Recycling Bot",
      category: "Environmental",
      description:
        "Create a robot that sorts trash automatically - be a hero for the planet while learning cutting-edge tech!",
      difficulty: "Intermediate",
      skillsGained: "Computer vision, servo motors, sustainable engineering",
      icon: Recycle,
      color: "emerald",
    },
    {
      id: 5,
      title: "Study Buddy Assistant",
      category: "Education",
      description:
        "Create a helpful robot that organizes your homework, reminds you of deadlines, and makes studying fun!",
      difficulty: "Intermediate",
      skillsGained:
        "Speech recognition, task management, user experience design",
      icon: GraduationCap,
      color: "purple",
    },
    {
      id: 6,
      title: "Weather Station Explorer",
      category: "Science & Discovery",
      description:
        "Build a mobile weather lab that collects data like a real scientist. Perfect for future meteorologists!",
      difficulty: "Beginner",
      skillsGained: "Data analysis, sensor networks, scientific reporting",
      icon: CloudRain,
      color: "cyan",
    },
    {
      id: 7,
      title: "Grandparent Care Companion",
      category: "Healthcare",
      description:
        "Design a caring robot that helps elderly family members with reminders and emergency alerts. Technology with heart!",
      difficulty: "Advanced",
      skillsGained:
        "Health monitoring, emergency protocols, compassionate design",
      icon: Stethoscope,
      color: "red",
    },
    {
      id: 8,
      title: "Library Detective Robot",
      category: "Organization",
      description:
        "Create a super-smart library assistant that finds and organizes books faster than any human librarian!",
      difficulty: "Advanced",
      skillsGained:
        "Database management, pattern recognition, system optimization",
      icon: BookMarked,
      color: "indigo",
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300";
      case "Intermediate":
        return "bg-gradient-to-r from-yellow-100 to-orange-200 text-orange-800 border-orange-300";
      case "Advanced":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300";
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return <Star className="w-3 h-3 fill-current" />;
      case "Intermediate":
        return <Trophy className="w-3 h-3 fill-current" />;
      case "Advanced":
        return <Zap className="w-3 h-3 fill-current" />;
      default:
        return <Star className="w-3 h-3 fill-current" />;
    }
  };

  const getCardColors = (color) => {
    const colorMap = {
      green: {
        gradient: "from-green-50 to-green-100",
        category: "bg-green-500/90",
        icon: "from-green-500 to-green-600",
        hover: "hover:text-green-600",
        skillsBox: "from-green-500/5 to-green-400/10 border-green-500/20",
        skillsText: "text-green-600",
      },
      emerald: {
        gradient: "from-emerald-50 to-emerald-100",
        category: "bg-emerald-500/90",
        icon: "from-emerald-500 to-emerald-600",
        hover: "hover:text-emerald-600",
        skillsBox: "from-emerald-500/5 to-emerald-400/10 border-emerald-500/20",
        skillsText: "text-emerald-600",
      },
      pink: {
        gradient: "from-pink-50 to-pink-100",
        category: "bg-pink-500/90",
        icon: "from-pink-500 to-pink-600",
        hover: "hover:text-pink-600",
        skillsBox: "from-pink-500/5 to-pink-400/10 border-pink-500/20",
        skillsText: "text-pink-600",
      },
      blue: {
        gradient: "from-blue-50 to-blue-100",
        category: "bg-blue-500/90",
        icon: "from-blue-500 to-blue-600",
        hover: "hover:text-blue-600",
        skillsBox: "from-blue-500/5 to-blue-400/10 border-blue-500/20",
        skillsText: "text-blue-600",
      },
      purple: {
        gradient: "from-purple-50 to-purple-100",
        category: "bg-purple-500/90",
        icon: "from-purple-500 to-purple-600",
        hover: "hover:text-purple-600",
        skillsBox: "from-purple-500/5 to-purple-400/10 border-purple-500/20",
        skillsText: "text-purple-600",
      },
      cyan: {
        gradient: "from-cyan-50 to-cyan-100",
        category: "bg-cyan-500/90",
        icon: "from-cyan-500 to-cyan-600",
        hover: "hover:text-cyan-600",
        skillsBox: "from-cyan-500/5 to-cyan-400/10 border-cyan-500/20",
        skillsText: "text-cyan-600",
      },
      red: {
        gradient: "from-red-50 to-red-100",
        category: "bg-red-500/90",
        icon: "from-red-500 to-red-600",
        hover: "hover:text-red-600",
        skillsBox: "from-red-500/5 to-red-400/10 border-red-500/20",
        skillsText: "text-red-600",
      },
      indigo: {
        gradient: "from-indigo-50 to-indigo-100",
        category: "bg-indigo-500/90",
        icon: "from-indigo-500 to-indigo-600",
        hover: "hover:text-indigo-600",
        skillsBox: "from-indigo-500/5 to-indigo-400/10 border-indigo-500/20",
        skillsText: "text-indigo-600",
      },
    };
    return colorMap[color];
  };

  return (
    <section className="bg-[#fff8f2] relative overflow-hidden py-10">
      <div className="bg-[#fff8f2] container mx-auto px-4 relative z-10">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Amazing Robots
            </span>{" "}
            You'll Actually Build!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Each project is designed to be fun, engaging, and packed with real
            learning. Not just theory, but working robots they can proudly
            showcase.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-16">
          {projects.map((project) => {
            const IconComponent = project.icon;
            const colors = getCardColors(project.color);
            return (
              <div
                key={project.id}
                className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-4 hover:border-gray-200 hover:shadow-2xl shadow-lg flex flex-col"
              >
                <div
                  className={`p-8 bg-gradient-to-r ${colors.gradient} flex flex-col h-full`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <span
                      className={`px-4 py-2 ${colors.category} text-white rounded-full text-sm font-semibold`}
                    >
                      {project.category}
                    </span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-1 ${getDifficultyColor(
                        project.difficulty
                      )}`}
                    >
                      {getDifficultyIcon(project.difficulty)}
                      {project.difficulty}
                    </span>
                  </div>
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${colors.icon} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-4 text-gray-900 group-hover:transition-colors duration-300 ${colors.hover}`}
                  >
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-6 text-base leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex-grow flex items-end">
                    <div
                      className={`bg-gradient-to-r ${colors.skillsBox} p-5 rounded-xl border w-full`}
                    >
                      <h4
                        className={`text-base font-semibold ${colors.skillsText} mb-2`}
                      >
                        💪 Skills You'll Gain:
                      </h4>
                      <p className="text-sm text-gray-700">
                        {project.skillsGained}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory flex gap-6 mb-16">
          {projects.map((project) => {
            const IconComponent = project.icon;
            const colors = getCardColors(project.color);
            return (
              <div
                key={project.id}
                className="min-w-[80%] snap-center group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-200 hover:shadow-2xl shadow-lg flex flex-col"
              >
                <div
                  className={`p-6 bg-gradient-to-r ${colors.gradient} flex flex-col h-full`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className={`px-3 py-1.5 ${colors.category} text-white rounded-full text-xs font-semibold`}
                    >
                      {project.category}
                    </span>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 ${getDifficultyColor(
                        project.difficulty
                      )}`}
                    >
                      {getDifficultyIcon(project.difficulty)}
                      {project.difficulty}
                    </span>
                  </div>
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${colors.icon} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3
                    className={`text-lg font-bold mb-3 text-gray-900 ${colors.hover}`}
                  >
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex-grow flex items-end">
                    <div
                      className={`bg-gradient-to-r ${colors.skillsBox} p-4 rounded-xl border w-full`}
                    >
                      <h4
                        className={`text-sm font-semibold ${colors.skillsText} mb-2`}
                      >
                        💪 Skills You'll Gain:
                      </h4>
                      <p className="text-xs text-gray-700">
                        {project.skillsGained}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why These Projects Matter */}
        <div className="text-center">
          <div className="bg-white border border-gray-300 rounded-2xl p-6 sm:p-10 md:p-12 max-w-4xl mx-auto shadow-md">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Why These Projects Matter?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-xs sm:text-sm md:text-base">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 md:mb-3">
                  Real-World Skills
                </h4>
                <p className="text-gray-600 md:text-base">
                  Programming, engineering, and problem-solving skills that
                  colleges and employers value.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 md:mb-3">
                  Age-Appropriate
                </h4>
                <p className="text-gray-600 md:text-base">
                  Designed specifically for this age with proper scaffolding and
                  support.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Trophy className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 md:mb-3">
                  Portfolio Building
                </h4>
                <p className="text-gray-600 md:text-base">
                  Each project becomes a showcase piece for college applications
                  and internships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsCarousel;
