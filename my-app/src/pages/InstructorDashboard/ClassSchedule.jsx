import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiX, FiLink, FiCalendar, FiClock, FiUsers, FiEdit2, FiTrash2, FiExternalLink, FiRefreshCw } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/InstructorDashboard/Navbar";
import { createClass, getInstructorClasses, deleteClass } from "../../apiCalls/classCalls.js";
import toast from "react-hot-toast";
import { setClassData, setAllClasses, setPagination, removeClassData, setLoading as setClassLoading } from "../../redux/classSlice.js";

const ClassSchedule = () => {
  const { instructorData } = useSelector((state) => state.instructor);
  const { classData, pagination, loading: classesLoading } = useSelector((state) => state.class);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all"); // all, upcoming, past
  const [fetchLoading, setFetchLoading] = useState(false);
  const dispatch = useDispatch();
  
  const initialFormData = {
    className: "",
    description: "",
    batch: "",
    googleMeetLink: "",
    scheduledAt: "",
    duration: 60,
    preReadLinks: []
  };

  const [formData, setFormData] = useState(initialFormData);

  const [preReadLink, setPreReadLink] = useState({
    title: "",
    url: "",
    description: ""
  });

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch classes from API
  const fetchClasses = async (filters = {}) => {
    try {
      setFetchLoading(true);
      dispatch(setClassLoading(true));
      
      const params = {
        page: 1,
        limit: 50, // Fetch more classes at once
        ...filters
      };
      
      const response = await getInstructorClasses(params);
      
      dispatch(setAllClasses(response.classes));
      dispatch(setPagination(response.pagination));
      
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error(error.message || "Failed to fetch classes");
    } finally {
      setFetchLoading(false);
      dispatch(setClassLoading(false));
    }
  };

  // Refresh classes
  const handleRefresh = () => {
    toast.promise(
      fetchClasses(),
      {
        loading: 'Refreshing classes...',
        success: 'Classes refreshed!',
        error: 'Failed to refresh'
      }
    );
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal && !loading) {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showModal, loading]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreReadChange = (e) => {
    const { name, value } = e.target;
    setPreReadLink(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addPreReadLink = () => {
    if (!preReadLink.title || !preReadLink.url) {
      toast.error("Please fill in link title and URL");
      return;
    }

    // Validate URL format
    try {
      new URL(preReadLink.url);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    // Check for duplicates
    const isDuplicate = formData.preReadLinks.some(
      link => link.url === preReadLink.url
    );
    
    if (isDuplicate) {
      toast.error("This link has already been added");
      return;
    }

    setFormData(prev => ({
      ...prev,
      preReadLinks: [...prev.preReadLinks, preReadLink]
    }));
    setPreReadLink({ title: "", url: "", description: "" });
    toast.success("Link added successfully!");
  };

  const removePreReadLink = (index) => {
    setFormData(prev => ({
      ...prev,
      preReadLinks: prev.preReadLinks.filter((_, i) => i !== index)
    }));
    toast.success("Link removed");
  };

  const closeModal = () => {
    if (loading) return;
    
    // Check if form has data
    const hasData = formData.className || 
                    formData.description || 
                    formData.batch || 
                    formData.googleMeetLink || 
                    formData.scheduledAt || 
                    formData.preReadLinks.length > 0;

    if (hasData) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to close?");
      if (!confirmClose) return;
    }

    setShowModal(false);
    setFormData(initialFormData);
    setPreReadLink({ title: "", url: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.className || !formData.batch || !formData.googleMeetLink || !formData.scheduledAt) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate class name length
    if (formData.className.length < 3) {
      toast.error("Class name must be at least 3 characters");
      return;
    }

    // Validate Google Meet link
    if (!formData.googleMeetLink.includes('meet.google.com')) {
      toast.error("Please provide a valid Google Meet link");
      return;
    }

    // Validate date is not in the past
    const scheduledDate = new Date(formData.scheduledAt);
    const now = new Date();
    
    if (scheduledDate < now) {
      toast.error("Cannot schedule classes in the past");
      return;
    }

    // Warn if scheduling very soon (within 30 minutes)
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);
    if (scheduledDate < thirtyMinutesFromNow) {
      const confirmSchedule = window.confirm("This class is scheduled within 30 minutes. Continue?");
      if (!confirmSchedule) return;
    }

    try {
      setLoading(true);
      
      // Prepare class data - only include fields that have values
      const classData = {
        className: formData.className.trim(),
        batch: formData.batch,
        googleMeetLink: formData.googleMeetLink.trim(),
        scheduledAt: scheduledDate.toISOString(),
        duration: parseInt(formData.duration)
      };

      // Only add description if it has content
      if (formData.description.trim()) {
        classData.description = formData.description.trim();
      }

      // Only add preReadLinks if there are any
      if (formData.preReadLinks.length > 0) {
        classData.preReadLinks = formData.preReadLinks;
      }

      // Log the data being sent for debugging
      console.log("Sending class data:", JSON.stringify(classData, null, 2));

      const response = await createClass(classData);
      
      console.log("API Response:", response);
      toast.success("Class scheduled successfully!");
      dispatch(setClassData(response.class));
      
      // Refresh the classes list
      await fetchClasses();
      
      setShowModal(false);
      
      // Reset form
      setFormData(initialFormData);
      setPreReadLink({ title: "", url: "", description: "" });
      
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      
      // Handle different error formats
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to schedule class";
      
      toast.error(errorMessage);
      
      // Handle validation errors from server
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          errors.forEach(err => {
            toast.error(`${err.path || err.field}: ${err.msg || err.message}`);
          });
        }
      }
      
      // Log full error details for debugging
      if (error.response?.data) {
        console.error("Server response data:", JSON.stringify(error.response.data, null, 2));
      }
    } finally {
      setLoading(false);
    }
  };

  // Get minimum datetime for input (current time)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Check if class is upcoming or past
  const isUpcoming = (scheduledAt) => {
    return new Date(scheduledAt) > new Date();
  };

  // Filter classes based on selected filter
  const getFilteredClasses = () => {
    if (!classData || classData.length === 0) return [];
    
    switch(selectedFilter) {
      case "upcoming":
        return classData.filter(cls => isUpcoming(cls.scheduledAt));
      case "past":
        return classData.filter(cls => !isUpcoming(cls.scheduledAt));
      default:
        return classData;
    }
  };

  const filteredClasses = getFilteredClasses();

  // Sort classes by date (newest first)
  const sortedClasses = [...filteredClasses].sort((a, b) => 
    new Date(b.scheduledAt) - new Date(a.scheduledAt)
  );

  // Get time remaining until class
  const getTimeRemaining = (scheduledAt) => {
    const now = new Date();
    const classTime = new Date(scheduledAt);
    const diff = classTime - now;
    
    if (diff < 0) return "Class ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `In ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `In ${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `In ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return "Starting now";
  };

  // Handle delete class
// Handle delete class
  const handleDeleteClass = async (classId) => {
    if (!classId) {
      toast.error("Invalid class ID");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this class? This action cannot be undone.");
    if (!confirmDelete) return;
    
    try {
      // Show loading toast
      const deletePromise = deleteClass(classId);
      
      await toast.promise(
        deletePromise,
        {
          loading: 'Deleting class...',
          success: 'Class deleted successfully!',
          error: 'Failed to delete class'
        }
      );

      // Remove from Redux state
      dispatch(removeClassData(classId));
      
      await fetchClasses();
      
    } catch (error) {
      console.error("Error deleting class:", error);
      if (error.response?.status === 404) {
        toast.error("Class not found. It may have been already deleted.");
        await fetchClasses();
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete this class.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Class Schedule</h1>
              <p className="text-gray-600 mt-1">
                Manage and schedule your classes
                {pagination.totalClasses > 0 && (
                  <span className="ml-2 text-purple-600 font-medium">
                    ({pagination.totalClasses} total)
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={fetchLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <FiRefreshCw size={20} className={fetchLoading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FiPlus size={20} />
                Schedule New Class
              </button>
            </div>
          </div>

          {/* Scheduled Classes List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Filter Tabs */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedFilter === "all"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All Classes
                </button>
                <button
                  onClick={() => setSelectedFilter("upcoming")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedFilter === "upcoming"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setSelectedFilter("past")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedFilter === "past"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Past
                </button>
              </div>
            </div>

            {/* Classes List */}
            <div className="p-6">
              {fetchLoading && sortedClasses.length === 0 ? (
                <div className="text-center py-12">
                  <FiRefreshCw className="animate-spin mx-auto text-purple-600 mb-4" size={48} />
                  <p className="text-gray-500">Loading classes...</p>
                </div>
              ) : sortedClasses.length === 0 ? (
                <div className="text-center py-12">
                  <FiCalendar className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500 text-lg mb-2">
                    {selectedFilter === "all" && "No classes scheduled yet"}
                    {selectedFilter === "upcoming" && "No upcoming classes"}
                    {selectedFilter === "past" && "No past classes"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Click "Schedule New Class" to get started
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {sortedClasses.map((classItem, index) => {
                    const upcoming = isUpcoming(classItem.scheduledAt);
                    return (
                      <motion.div
                        key={classItem._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border rounded-xl p-6 hover:shadow-md transition-shadow ${
                          upcoming 
                            ? "border-purple-200 bg-purple-50/30" 
                            : "border-gray-200 bg-gray-50/30"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          {/* Left Section */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {classItem.className}
                              </h3>
                              {upcoming && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                  {getTimeRemaining(classItem.scheduledAt)}
                                </span>
                              )}
                              {!upcoming && (
                                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                                  Completed
                                </span>
                              )}
                            </div>

                            {classItem.description && (
                              <p className="text-gray-600 mb-4">
                                {classItem.description}
                              </p>
                            )}

                            {/* Class Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-gray-700">
                                <FiCalendar className="text-purple-600" size={18} />
                                <span className="text-sm">
                                  {formatDate(classItem.scheduledAt)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <FiClock className="text-purple-600" size={18} />
                                <span className="text-sm">{classItem.duration} minutes</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <FiUsers className="text-purple-600" size={18} />
                                <span className="text-sm">Batch: {classItem.batch}</span>
                              </div>
                            </div>

                            {/* Pre-Read Links */}
                            {classItem.preReadLinks && classItem.preReadLinks.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                  Pre-Read Materials:
                                </p>
                                <div className="space-y-2">
                                  {classItem.preReadLinks.map((link, linkIndex) => (
                                    <a
                                      key={linkIndex}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 hover:underline"
                                    >
                                      <FiLink size={14} />
                                      <span>{link.title}</span>
                                      <FiExternalLink size={12} />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Meet Link */}
                            {upcoming && (
                              <a
                                href={classItem.googleMeetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                              >
                                <FiExternalLink size={16} />
                                Join Google Meet
                              </a>
                            )}
                          </div>

                          {/* Right Section - Actions */}
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => {
                                // Add edit functionality
                                toast.info("Edit feature coming soon!");
                              }}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit class"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteClass(classItem._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete class"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
                  Schedule New Class
                </h2>
                <button
                  onClick={closeModal}
                  disabled={loading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Close modal"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Class Name */}
                <div>
                  <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
                    Class Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="className"
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    placeholder="e.g., Introduction to React"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    minLength={3}
                    maxLength={20}
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.className.length}/20 characters
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the class"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    maxLength={500}
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                {/* Batch */}
                <div>
                  <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-2">
                    Batch <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    disabled={loading || !instructorData?.batches?.length}
                  >
                    <option value="">Select a batch</option>
                    {instructorData?.batches?.map((batch, index) => (
                      <option key={index} value={batch}>
                        {batch}
                      </option>
                    ))}
                  </select>
                  {instructorData?.batches?.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      No batches available. Please create a batch first.
                    </p>
                  )}
                </div>

                {/* Google Meet Link */}
                <div>
                  <label htmlFor="googleMeetLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Google Meet Link <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="googleMeetLink"
                      type="url"
                      name="googleMeetLink"
                      value={formData.googleMeetLink}
                      onChange={handleInputChange}
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Scheduled Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Date & Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="scheduledAt"
                        type="datetime-local"
                        name="scheduledAt"
                        value={formData.scheduledAt}
                        onChange={handleInputChange}
                        min={getMinDateTime()}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="duration"
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min={15}
                        max={300}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Pre-Read Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pre-Read Links (Optional)
                  </label>
                  
                  {/* Added Links */}
                  {formData.preReadLinks.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {formData.preReadLinks.map((link, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900">{link.title}</p>
                            <p className="text-xs text-gray-500 truncate">{link.url}</p>
                            {link.description && (
                              <p className="text-xs text-gray-600 mt-1">{link.description}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removePreReadLink(index)}
                            disabled={loading}
                            className="ml-3 p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={`Remove ${link.title}`}
                          >
                            <FiX size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Link */}
                  <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <input
                      type="text"
                      name="title"
                      value={preReadLink.title}
                      onChange={handlePreReadChange}
                      placeholder="Link title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      disabled={loading}
                    />
                    <input
                      type="url"
                      name="url"
                      value={preReadLink.url}
                      onChange={handlePreReadChange}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      disabled={loading}
                    />
                    <textarea
                      name="description"
                      value={preReadLink.description}
                      onChange={handlePreReadChange}
                      placeholder="Link description (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      rows={2}
                      maxLength={500}
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500">
                      {preReadLink.description.length}/500 characters
                    </p>
                    <button
                      type="button"
                      onClick={addPreReadLink}
                      disabled={loading}
                      className="w-full px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Link
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={loading}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || instructorData?.batches?.length === 0}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Scheduling..." : "Schedule Class"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClassSchedule;