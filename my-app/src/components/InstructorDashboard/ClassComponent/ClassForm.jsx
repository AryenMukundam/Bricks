import React, { useState } from "react";
import { FiLink, FiCalendar, FiClock, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const ClassForm = ({ 
  formData, 
  setFormData, 
  loading, 
  instructorData, 
  onSubmit, 
  onCancel 
}) => {
  const [preReadLink, setPreReadLink] = useState({
    title: "",
    url: "",
    description: ""
  });

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input change for pre-read link
  const handlePreReadChange = (e) => {
    const { name, value } = e.target;
    setPreReadLink(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add a pre-read link to formData
  const addPreReadLink = () => {
    if (!preReadLink.title || !preReadLink.url) {
      toast.error("Please fill in link title and URL");
      return;
    }

    try {
      new URL(preReadLink.url);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

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

  // Remove a pre-read link
  const removePreReadLink = (index) => {
    setFormData(prev => ({
      ...prev,
      preReadLinks: prev.preReadLinks.filter((_, i) => i !== index)
    }));
    toast.success("Link removed");
  };

  // Get minimum datetime for scheduling
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <form onSubmit={onSubmit} className="p-6 space-y-6">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
          disabled={loading || !instructorData?.batches?.length}
        >
          <option value="">Select a batch</option>
          {instructorData?.batches?.map((batch, index) => (
            <option key={index} value={batch}>{batch}</option>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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

        {/* Existing Links */}
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
                  {link.description && <p className="text-xs text-gray-600 mt-1">{link.description}</p>}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            disabled={loading}
          />
          <input
            type="url"
            name="url"
            value={preReadLink.url}
            onChange={handlePreReadChange}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            disabled={loading}
          />
          <textarea
            name="description"
            value={preReadLink.description}
            onChange={handlePreReadChange}
            placeholder="Link description (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            rows={2}
            maxLength={500}
            disabled={loading}
          />
          <p className="text-xs text-gray-500">{preReadLink.description.length}/500 characters</p>
          <button
            type="button"
            onClick={addPreReadLink}
            disabled={loading}
            className="w-full px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Link
          </button>
        </div>
      </div>

      {/* Submit & Cancel Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || instructorData?.batches?.length === 0}
          className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Scheduling..." : "Schedule Class"}
        </button>
      </div>
    </form>
  );
};

export default ClassForm;
