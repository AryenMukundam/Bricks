import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Users, Lock, Unlock, Edit2, Trash2, 
  CheckCircle, FileText, ArrowLeft, BookOpen, Award
} from 'lucide-react';
import { 
  getAssignmentById, 
  toggleAssignmentLock, 
  deleteAssignment,
  publishAssignment 
} from '../../apiCalls/assignmentCalls';
import Navbar from '../../components/InstructorDashboard/Navbar';

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [id]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      const response = await getAssignmentById(id);
      setAssignment(response.assignment);
      setError(null);
    } catch (err) {
      console.error('Fetch assignment error:', err);
      setError(err.message || 'Failed to fetch assignment details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLock = async () => {
    try {
      await toggleAssignmentLock(id);
      fetchAssignmentDetails();
    } catch (err) {
      alert(err.message || 'Failed to toggle lock');
    }
  };

  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish this assignment?')) return;
    try {
      await publishAssignment(id);
      fetchAssignmentDetails();
      alert('Assignment published successfully!');
    } catch (err) {
      alert(err.message || 'Failed to publish assignment');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await deleteAssignment(id);
      alert('Assignment deleted successfully!');
      navigate('/instructor/assignments');
    } catch (err) {
      alert(err.message || 'Failed to delete assignment');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = () => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    
    if (!assignment.isPublished) {
      return <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full font-medium">Draft</span>;
    }
    if (assignment.isLocked) {
      return <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full flex items-center gap-1 font-medium"><Lock size={14} />Locked</span>;
    }
    if (now > dueDate) {
      return <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full font-medium">Expired</span>;
    }
    return <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">Active</span>;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-orange-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading assignment details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !assignment) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-orange-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-lg font-medium mb-4">{error || 'Assignment not found'}</p>
              <button
                onClick={() => navigate('/instructor/assignments')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Back to Assignments
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-orange-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/instructor/assignments')}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 font-medium"
          >
            <ArrowLeft size={20} />
            Back to All Assignments
          </button>

          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-orange-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-gray-800">{assignment.title}</h1>
                  {getStatusBadge()}
                </div>
                {assignment.description && (
                  <p className="text-gray-600 text-lg">{assignment.description}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate(`/assignment/${assignment._id}/submissions`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Users size={16} />
                Submissions ({assignment.submissionCount || 0})
              </button>

              <button
                onClick={() => navigate(`/edit-assignment/${assignment._id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
              >
                <Edit2 size={16} />
                Edit
              </button>

              {!assignment.isPublished && (
                <button
                  onClick={handlePublish}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                >
                  <CheckCircle size={18} />
                  Publish
                </button>
              )}

              <button
                onClick={handleToggleLock}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  assignment.isLocked
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {assignment.isLocked ? <Unlock size={16} /> : <Lock size={16} />}
                {assignment.isLocked ? 'Unlock' : 'Lock'}
              </button>

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>

          {/* Assignment Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Users className="text-orange-600" size={20} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Batch</p>
                  <p className="text-lg font-bold text-gray-800">{assignment.batch}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Due Date</p>
                  <p className="text-sm font-bold text-gray-800">{formatDate(assignment.dueDate)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Award className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Points</p>
                  <p className="text-lg font-bold text-gray-800">{assignment.totalPoints}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <BookOpen className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Questions</p>
                  <p className="text-lg font-bold text-gray-800">{assignment.questions?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* General Information */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-orange-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="text-orange-500" size={24} />
                General Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Assignment Type</p>
                  <p className="text-lg font-medium text-gray-800 capitalize">{assignment.assignmentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Instructor</p>
                  <p className="text-lg font-medium text-gray-800">{assignment.instructorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="text-lg font-medium text-gray-800">{formatDate(assignment.createdAt)}</p>
                </div>
                {assignment.publishedAt && (
                  <div>
                    <p className="text-sm text-gray-600">Published At</p>
                    <p className="text-lg font-medium text-gray-800">{formatDate(assignment.publishedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-orange-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="text-orange-500" size={24} />
                Assignment Settings
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Shuffle Questions</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    assignment.settings?.shuffleQuestions 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {assignment.settings?.shuffleQuestions ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Shuffle Options</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    assignment.settings?.shuffleOptions 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {assignment.settings?.shuffleOptions ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Show Correct Answers</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    assignment.settings?.showCorrectAnswers 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {assignment.settings?.showCorrectAnswers ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Multiple Attempts</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    assignment.settings?.allowMultipleAttempts 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {assignment.settings?.allowMultipleAttempts ? 'Yes' : 'No'}
                  </span>
                </div>
                {assignment.settings?.allowMultipleAttempts && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Max Attempts</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {assignment.settings?.maxAttempts}
                    </span>
                  </div>
                )}
                {assignment.settings?.timeLimit && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Time Limit</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {assignment.settings?.timeLimit} minutes
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-orange-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="text-orange-500" size={24} />
              Questions ({assignment.questions?.length || 0})
            </h2>
            {assignment.questions && assignment.questions.length > 0 ? (
              <div className="space-y-4">
                {assignment.questions.map((question, index) => (
                  <div key={question._id} className="border border-gray-200 rounded-lg p-4 bg-orange-50/30">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium mb-2">{question.questionText}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">Type: <span className="font-medium capitalize">{question.questionType}</span></span>
                          <span className="text-gray-600">Points: <span className="font-medium">{question.points}</span></span>
                        </div>
                      </div>
                    </div>
                    
                    {question.questionImage && (
                      <img src={question.questionImage} alt="Question" className="max-w-xs rounded mb-3" />
                    )}

                    {question.options && question.options.length > 0 && (
                      <div className="ml-11 space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div 
                            key={optIndex} 
                            className={`p-2 rounded border ${
                              option.isCorrect 
                                ? 'bg-green-50 border-green-300' 
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {option.isCorrect && <CheckCircle size={16} className="text-green-600" />}
                              <span className="text-gray-700">{option.optionText}</span>
                            </div>
                            {option.optionImage && (
                              <img src={option.optionImage} alt="Option" className="max-w-xs rounded mt-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {question.correctAnswer && (
                      <div className="ml-11 mt-3 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Correct Answer:</span> {question.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No questions added yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignmentDetail;