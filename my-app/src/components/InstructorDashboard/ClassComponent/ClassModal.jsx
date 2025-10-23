import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import ClassForm from "./ClassForm";

const ClassModal = ({ show, onClose, onSubmit, instructorData }) => {
  const [loading, setLoading] = useState(false);
  
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

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && show && !loading) {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [show, loading]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  const handleClose = () => {
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

    onClose();
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.className || !formData.batch || !formData.googleMeetLink || !formData.scheduledAt) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.className.length < 3) {
      toast.error("Class name must be at least 3 characters");
      return;
    }

    if (!formData.googleMeetLink.includes('meet.google.com')) {
      toast.error("Please provide a valid Google Meet link");
      return;
    }

    const scheduledDate = new Date(formData.scheduledAt);
    const now = new Date();
    
    if (scheduledDate < now) {
      toast.error("Cannot schedule classes in the past");
      return;
    }

    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);
    if (scheduledDate < thirtyMinutesFromNow) {
      const confirmSchedule = window.confirm("This class is scheduled within 30 minutes. Continue?");
      if (!confirmSchedule) return;
    }

    try {
      setLoading(true);
      
      const classData = {
        className: formData.className.trim(),
        batch: formData.batch,
        googleMeetLink: formData.googleMeetLink.trim(),
        scheduledAt: scheduledDate.toISOString(),
        duration: parseInt(formData.duration)
      };

      if (formData.description.trim()) {
        classData.description = formData.description.trim();
      }

      if (formData.preReadLinks.length > 0) {
        classData.preReadLinks = formData.preReadLinks;
      }

      await onSubmit(classData);
      
      toast.success("Class scheduled successfully!");
      onClose();
      setFormData(initialFormData);
      
    } catch (error) {
      console.error("Error creating class:", error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to schedule class";
      
      toast.error(errorMessage);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          errors.forEach(err => {
            toast.error(`${err.path || err.field}: ${err.msg || err.message}`);
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={handleClose}
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
                onClick={handleClose}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <ClassForm
              formData={formData}
              setFormData={setFormData}
              loading={loading}
              instructorData={instructorData}
              onSubmit={handleSubmit}
              onCancel={handleClose}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClassModal;