import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Send,
  Award
} from 'lucide-react';
import { getAssignmentById, submitAssignment } from '../../apiCalls/assignmentCalls';
import Navbar from '../../components/StudentDashboard/Navbar';

const AssignmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const data = await getAssignmentById(id);
      setAssignment(data.assignment);
      
      // Initialize answers from existing submission if any
      if (data.assignment.submissions && data.assignment.submissions.length > 0) {
        const submission = data.assignment.submissions[0];
        const existingAnswers = {};
        submission.answers.forEach(ans => {
          existingAnswers[ans.questionId] = {
            answerType: ans.answerType,
            selectedOption: ans.selectedOption,
            selectedOptions: ans.selectedOptions || [],
            textAnswer: ans.textAnswer || ''
          };
        });
        setAnswers(existingAnswers);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching assignment:', err);
      setError(err.message || 'Failed to fetch assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answerType, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answerType,
        ...(answerType === 'mcq' && { selectedOption: value }),
        ...(answerType === 'multiple_correct' && { 
          selectedOptions: prev[questionId]?.selectedOptions?.includes(value)
            ? prev[questionId].selectedOptions.filter(opt => opt !== value)
            : [...(prev[questionId]?.selectedOptions || []), value]
        }),
        ...(answerType === 'text' && { textAnswer: value })
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Convert answers object to array format
      const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answerType: answer.answerType,
        ...(answer.answerType === 'mcq' && { selectedOption: answer.selectedOption }),
        ...(answer.answerType === 'multiple_correct' && { selectedOptions: answer.selectedOptions }),
        ...(answer.answerType === 'text' && { textAnswer: answer.textAnswer })
      }));

      await submitAssignment(id, { answers: answersArray });
      
      await fetchAssignment();
      setShowSubmitConfirm(false);
      
    } catch (err) {
      console.error('Error submitting assignment:', err);
      setError(err.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;

    if (diff < 0) return 'Overdue';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Due soon';
  };

  const isAnswered = (questionId) => {
    const answer = answers[questionId];
    if (!answer) return false;
    
    if (answer.answerType === 'mcq') return answer.selectedOption !== undefined;
    if (answer.answerType === 'multiple_correct') return answer.selectedOptions?.length > 0;
    if (answer.answerType === 'text') return answer.textAnswer?.trim().length > 0;
    
    return false;
  };

  const getAnsweredCount = () => {
    return assignment?.questions?.filter(q => isAnswered(q._id)).length || 0;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-orange-600 text-lg font-medium">Loading assignment...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error && !assignment) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
              <p className="text-red-800 font-medium">{error}</p>
              <button
                onClick={() => navigate('/student/assignments')}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Back to Assignments
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const isOverdue = new Date() > new Date(assignment.dueDate);
  const hasSubmitted = assignment.hasSubmitted;
  const canSubmit = assignment.canSubmit && !hasSubmitted;
  const mySubmission = assignment.submissions?.[0];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/student/assignments')}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Assignments
          </button>

          {/* Header Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{assignment.title}</h1>
                {assignment.description && (
                  <p className="text-gray-600 text-base">{assignment.description}</p>
                )}
              </div>
              {hasSubmitted && (
                <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-300">
                  <CheckCircle className="w-4 h-4" />
                  Submitted
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Due Date</p>
                  <p className="text-sm text-gray-800 font-semibold">{formatDate(assignment.dueDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`${isOverdue && !hasSubmitted ? 'bg-red-100' : 'bg-amber-100'} p-2 rounded-lg`}>
                  <Clock className={`w-5 h-5 ${isOverdue && !hasSubmitted ? 'text-red-600' : 'text-amber-600'}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Time Left</p>
                  <p className={`text-sm font-semibold ${isOverdue && !hasSubmitted ? 'text-red-600' : 'text-gray-800'}`}>
                    {getTimeRemaining(assignment.dueDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total Points</p>
                  <p className="text-sm text-gray-800 font-semibold">{assignment.totalPoints} Points</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          {!hasSubmitted && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Progress: {getAnsweredCount()} / {assignment.questions?.length || 0} answered
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round((getAnsweredCount() / (assignment.questions?.length || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all"
                  style={{ width: `${(getAnsweredCount() / (assignment.questions?.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {assignment.questions?.map((question, index) => (
              <div key={question._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-800 mb-1">{question.questionText}</p>
                    <p className="text-sm text-gray-500">Points: {question.points}</p>
                  </div>
                  {isAnswered(question._id) && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>

                {/* MCQ */}
                {question.questionType === 'mcq' && (
                  <div className="space-y-2">
                    {question.options?.map((option, optIndex) => (
                      <label 
                        key={optIndex}
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          answers[question._id]?.selectedOption === optIndex
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        } ${!canSubmit ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="radio"
                          name={question._id}
                          checked={answers[question._id]?.selectedOption === optIndex}
                          onChange={() => handleAnswerChange(question._id, 'mcq', optIndex)}
                          disabled={!canSubmit}
                          className="w-4 h-4 text-orange-600"
                        />
                        <span className="text-gray-800">{option.optionText}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Multiple Correct */}
                {question.questionType === 'multiple_correct' && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-2">Select all that apply</p>
                    {question.options?.map((option, optIndex) => (
                      <label 
                        key={optIndex}
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          answers[question._id]?.selectedOptions?.includes(optIndex)
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        } ${!canSubmit ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={answers[question._id]?.selectedOptions?.includes(optIndex) || false}
                          onChange={() => handleAnswerChange(question._id, 'multiple_correct', optIndex)}
                          disabled={!canSubmit}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <span className="text-gray-800">{option.optionText}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Text Answer */}
                {question.questionType === 'text' && (
                  <textarea
                    value={answers[question._id]?.textAnswer || ''}
                    onChange={(e) => handleAnswerChange(question._id, 'text', e.target.value)}
                    disabled={!canSubmit}
                    placeholder="Type your answer here..."
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                    rows="4"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          {canSubmit && (
            <div className="sticky bottom-6 mt-6 bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {getAnsweredCount()} of {assignment.questions?.length || 0} questions answered
                  </p>
                  {getAnsweredCount() < assignment.questions?.length && (
                    <p className="text-xs text-amber-600">Complete all questions before submitting</p>
                  )}
                </div>
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  disabled={getAnsweredCount() < assignment.questions?.length}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  Submit Assignment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Submit Assignment?</h3>
              <p className="text-gray-600">
                Are you sure you want to submit? You won't be able to change your answers after submission.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignmentPage;
