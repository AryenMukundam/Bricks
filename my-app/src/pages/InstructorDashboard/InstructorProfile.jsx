import React from "react";
import { useSelector } from "react-redux";
import {
  FiUser,
  FiMail,
  FiBook,
  FiCalendar,
  FiTrendingUp,
  FiGrid,
  FiCheckCircle,
  FiBriefcase,
  FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Navbar from "../../components/InstructorDashboard/Navbar";

const StatCard = ({ value, label, color }) => (
  <div className={`bg-${color}-50/50 border border-${color}-200 p-4 rounded-xl text-center flex-1`}>
    <div className={`text-3xl font-bold text-${color}-600`}>{value}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
);

const InfoField = ({ label, value, icon: Icon }) => (
  <div>
    <label className="text-sm text-gray-500 font-medium">{label}</label>
    <p className="text-gray-900 font-medium flex items-center gap-2 mt-1">
      {Icon && <Icon size={16} className="text-gray-400 flex-shrink-0" />}
      <span className="truncate">{value}</span>
    </p>
  </div>
);

function InstructorProfile() {
  const { instructorData, isAuthenticated } = useSelector((state) => state.instructor);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isAuthenticated || !instructorData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Please log in to view your profile.</p>
      </div>
    );
  }

  const getInitials = () => {
    const first = instructorData.fullname?.firstname?.[0] || '';
    const last = instructorData.fullname?.lastname?.[0] || '';
    return (first + last).toUpperCase() || 'I';
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Header */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            <div className="h-40 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center"></div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-24 sm:-mt-20">
                <div className="flex items-end gap-4">
                  {instructorData.avatarUrl ? (
                    <img src={instructorData.avatarUrl} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-4 border-white shadow-xl flex items-center justify-center text-5xl font-bold text-white">
                      {getInitials()}
                    </div>
                  )}
                  <div className="pb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {instructorData.fullname?.firstname} {instructorData.fullname?.lastname || ''}
                    </h1>
                    <p className="text-gray-600 flex items-center gap-2">
                      <FiBriefcase size={16} />
                      Instructor
                    </p>
                  </div>
                </div>
              </div>
              {instructorData.bio && (
                <div className="mt-6 border-l-4 border-purple-500 pl-4">
                  <p className="text-gray-700 italic">"{instructorData.bio}"</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Details) */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
             

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiBook className="text-blue-500"/>
                  Batches & Classes
                </h2>
                {instructorData.batches && instructorData.batches.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {instructorData.batches.map((batch, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <FiUsers className="text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900">{batch}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No batches assigned yet</p>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiUser className="text-green-500"/>
                Personal Details
              </h2>
              <div className="space-y-6">
                <InfoField label="Email Address" value={instructorData.email} icon={FiMail} />
                <InfoField 
                  label="Instructor ID" 
                  value={<span className="font-mono text-sm">{instructorData.instructorId}</span>} 
                  icon={FiGrid}
                />
                
                <InfoField label="Member Since" value={formatDate(instructorData.createdAt)} icon={FiCalendar}/>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default InstructorProfile;