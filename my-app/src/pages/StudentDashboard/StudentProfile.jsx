import React from "react";
import { useSelector } from "react-redux";
import {
  FiUser,
  FiMail,
  FiBook,
  FiAward,
  FiCalendar,
  FiTrendingUp,
  FiEdit2,
  FiClock,
  FiGrid,
  FiCheckCircle,
  FiBriefcase,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Navbar from "../../components/StudentDashboard/Navbar";

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


function StudentProfile() {
  const { studentData, isAuthenticated } = useSelector((state) => state.student);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isAuthenticated || !studentData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Please log in to view your profile.</p>
      </div>
    );
  }

  const getInitials = () => {
    const first = studentData.fullname?.firstname?.[0] || '';
    const last = studentData.fullname?.lastname?.[0] || '';
    return (first + last).toUpperCase() || 'S';
  };
  
  // Animation variants
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
    <Navbar/>
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
                {studentData.avtarUrl ? (
                  <img src={studentData.avtarUrl} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-4 border-white shadow-xl flex items-center justify-center text-5xl font-bold text-white">
                    {getInitials()}
                  </div>
                )}
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {studentData.fullname?.firstname} {studentData.fullname?.lastname || ''}
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2"><FiBriefcase size={16} />{studentData.school}</p>
                </div>
              </div>
 
            </div>
            {studentData.bio && (
              <div className="mt-6 border-l-4 border-orange-500 pl-4">
                <p className="text-gray-700 italic">"{studentData.bio}"</p>
              </div>
            )}
          </div>
        </motion.div>
        {/* Work in Progress */}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Details) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FiTrendingUp className="text-orange-500"/>Activity Snapshot</h2>
               <div className="flex flex-wrap gap-4">
                  <StatCard value={studentData.points || 0} label="Total Points" color="blue" />
                  <StatCard value={studentData.streak || 0} label="Day Streak" color="orange" />
                  <StatCard value={studentData.grade || 'N/A'} label="Grade Level" color="green" />
                  <StatCard value={0} label="Certificates" color="purple" />
               </div>
            </div>

            {/* Academic Info */}
             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FiBook className="text-blue-500"/>Academic Information</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoField label="Enrollment Number" value={studentData.enrollmentNumber} icon={FiGrid}/>
                  <InfoField label="Batch" value={<span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">{studentData.batch}</span>}/>
                  <InfoField label="Grade" value={`Grade ${studentData.grade}`} icon={FiCheckCircle} />
                  <InfoField label="School" value={studentData.school} icon={FiBriefcase}/>
               </div>
            </div>
          </motion.div>

          {/* Right Column (Personal Info) */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FiUser className="text-green-500"/>Personal Details</h2>
            <div className="space-y-6">
               <InfoField label="Email Address" value={studentData.email} icon={FiMail} />
               <InfoField label="Student ID" value={<span className="font-mono text-sm">{studentData._id}</span>} />
               <InfoField label="Member Since" value={formatDate(studentData.createdAt)} icon={FiCalendar}/>
               {studentData.lastActive && <InfoField label="Last Active" value={formatDate(studentData.lastActive)} icon={FiClock} />}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
    </>
  );
}

export default StudentProfile;