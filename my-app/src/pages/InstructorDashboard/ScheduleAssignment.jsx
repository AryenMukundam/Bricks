import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Plus, Trash2, X } from "lucide-react";
import { createAssignment , updateAssignment , getAssignmentById } from "../../apiCalls/assignmentCalls";
import Navbar from "../../components/InstructorDashboard/Navbar";






export default function ScheduleAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    batch: "",
    assignmentType: "mcq",
    dueDate: "",
    isPublished: true,
    questions: [],
    settings: {
      shuffleQuestions: false,
      shuffleOptions: false,
      showCorrectAnswers: true,
      allowMultipleAttempts: false,
      maxAttempts: 1,
      timeLimit: null,
    },
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEditMode);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: "",
    questionType: "mcq",
    options: [{ optionText: "", isCorrect: false }],
    correctAnswer: "",
    points: 1,
  });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchAssignmentData();
    }
  }, [id]);

  const fetchAssignmentData = async () => {
    try {
      setFetchingData(true);
      const response = await getAssignmentById(id);
      const assignment = response.assignment;

      const dateObj = new Date(assignment.dueDate);
      const localISOTime = new Date(
        dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);

      setFormData({
        title: assignment.title || "",
        description: assignment.description || "",
        batch: assignment.batch || "",
        assignmentType: assignment.assignmentType || "mcq",
        dueDate: localISOTime,
        isPublished: true,
        questions: assignment.questions || [],
        settings: {
          shuffleQuestions: assignment.settings?.shuffleQuestions || false,
          shuffleOptions: assignment.settings?.shuffleOptions || false,
          showCorrectAnswers: assignment.settings?.showCorrectAnswers !== undefined 
            ? assignment.settings.showCorrectAnswers 
            : true,
          allowMultipleAttempts: assignment.settings?.allowMultipleAttempts || false,
          maxAttempts: assignment.settings?.maxAttempts || 1,
          timeLimit: assignment.settings?.timeLimit || null,
        },
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to fetch assignment data",
      });
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [name]: type === "checkbox" 
          ? checked 
          : type === "number" 
            ? (value === "" ? null : parseInt(value)) 
            : value,
      },
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = { ...newOptions[index], [field]: value };

    if (field === "isCorrect" && currentQuestion.questionType === "mcq") {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }

    setCurrentQuestion((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: [...prev.options, { optionText: "", isCorrect: false }],
    }));
  };

  const removeOption = (index) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const openQuestionModal = () => {
    setCurrentQuestion({
      questionText: "",
      questionType:
        formData.assignmentType === "mixed" ? "mcq" : formData.assignmentType,
      options: [{ optionText: "", isCorrect: false }],
      correctAnswer: "",
      points: 1,
    });
    setEditingIndex(null);
    setShowQuestionModal(true);
  };

  const editQuestion = (index) => {
    setCurrentQuestion(formData.questions[index]);
    setEditingIndex(index);
    setShowQuestionModal(true);
  };

  const saveQuestion = () => {
    if (!currentQuestion.questionText) {
      alert("Question text is required");
      return;
    }

    if (
      (currentQuestion.questionType === "mcq" ||
        currentQuestion.questionType === "multiple_correct") &&
      currentQuestion.options.length < 2
    ) {
      alert("Please add at least 2 options");
      return;
    }

    const newQuestions = [...formData.questions];
    if (editingIndex !== null) {
      newQuestions[editingIndex] = { ...currentQuestion };
    } else {
      newQuestions.push({ ...currentQuestion });
    }

    setFormData((prev) => ({ ...prev, questions: newQuestions }));
    setShowQuestionModal(false);
  };

  const removeQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setMessage({ type: "", text: "" });

    if (!formData.title || !formData.batch || !formData.dueDate) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    if (formData.questions.length === 0) {
      setMessage({ type: "error", text: "Please add at least one question" });
      return;
    }

    setLoading(true);

    try {
      let result;
      if (isEditMode) {
        result = await updateAssignment(id, formData);
        setMessage({
          type: "success",
          text: result.msg || "Assignment updated successfully!",
        });
      } else {
        result = await createAssignment(formData);
        setMessage({
          type: "success",
          text: result.msg || "Assignment scheduled successfully!",
        });
      }

      setTimeout(() => {
        navigate("/instructor/assignments");
      }, 1500);
    } catch (error) {
      const errorMsg =
        error.errors?.[0]?.msg ||
        error.message ||
        `Failed to ${isEditMode ? "update" : "schedule"} assignment`;
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#fff8f2] p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading assignment data...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fff8f2] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isEditMode ? "Edit Assignment" : "Schedule Assignment"}
            </h1>
            <p className="text-gray-600">
              {isEditMode
                ? "Update assignment details and questions"
                : "Create and schedule a new assignment with questions"}
            </p>
          </div>

          <button
            onClick={() => navigate("/instructor/assignments")}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors mb-6"
          >
            ← Back
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-5">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter assignment title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 h-20"
                  placeholder="Enter assignment description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., 2024-CS-A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    name="assignmentType"
                    value={formData.assignmentType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="multiple_correct">Multiple Correct</option>
                    <option value="text">Text Answer</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Questions Section */}
              <div className="border-t pt-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Questions ({formData.questions.length})
                  </h3>
                  <button
                    onClick={openQuestionModal}
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add Question
                  </button>
                </div>

                {formData.questions.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No questions added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.questions.map((q, index) => (
                      <div
                        key={index}
                        className="border rounded-md p-4 bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                                Q{index + 1}
                              </span>
                              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                                {q.questionType.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-600">
                                {q.points} pts
                              </span>
                            </div>
                            <p className="text-gray-800 font-medium">
                              {q.questionText}
                            </p>
                            {q.options && q.options.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {q.options.map((opt, i) => (
                                  <div
                                    key={i}
                                    className="text-sm text-gray-600 flex items-center gap-2"
                                  >
                                    <span
                                      className={
                                        opt.isCorrect
                                          ? "text-green-600 font-medium"
                                          : ""
                                      }
                                    >
                                      {String.fromCharCode(65 + i)}.{" "}
                                      {opt.optionText}
                                      {opt.isCorrect && " ✓"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => editQuestion(index)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => removeQuestion(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignment Settings */}
              <div className="border-t pt-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-orange-600" />
                  Assignment Settings
                </h3>
                
                <div className="space-y-4">
                  {/* Shuffle Questions */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Shuffle Questions
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Randomize question order for each student
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="shuffleQuestions"
                        checked={formData.settings.shuffleQuestions}
                        onChange={handleSettingChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  {/* Shuffle Options */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Shuffle Options
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Randomize answer choices for MCQ questions
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="shuffleOptions"
                        checked={formData.settings.shuffleOptions}
                        onChange={handleSettingChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  {/* Show Correct Answers */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Show Correct Answers
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Allow students to see correct answers after submission
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="showCorrectAnswers"
                        checked={formData.settings.showCorrectAnswers}
                        onChange={handleSettingChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  {/* Multiple Attempts */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Allow Multiple Attempts
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Let students submit multiple times
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="allowMultipleAttempts"
                        checked={formData.settings.allowMultipleAttempts}
                        onChange={handleSettingChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  {/* Max Attempts - Conditional */}
                  {formData.settings.allowMultipleAttempts && (
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Attempts
                      </label>
                      <input
                        type="number"
                        name="maxAttempts"
                        value={formData.settings.maxAttempts}
                        onChange={handleSettingChange}
                        min="1"
                        max="10"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum number of submission attempts allowed
                      </p>
                    </div>
                  )}

                  {/* Time Limit */}
                  <div className="p-3 bg-gray-50 rounded-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      name="timeLimit"
                      value={formData.settings.timeLimit || ""}
                      onChange={handleSettingChange}
                      min="1"
                      placeholder="No limit"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for no time limit
                    </p>
                  </div>
                </div>
              </div>

              {message.text && (
                <div
                  className={`p-3 rounded-md ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      {isEditMode ? "Update Assignment" : "Schedule Assignment"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Question Modal */}
        {showQuestionModal && (
          <div className="fixed inset-0 backdrop-blur-md bg-opacity-20 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingIndex !== null ? "Edit Question" : "Add Question"}
                </h3>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Text *
                  </label>
                  <textarea
                    name="questionText"
                    value={currentQuestion.questionText}
                    onChange={handleQuestionChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 h-24"
                    placeholder="Enter your question"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {formData.assignmentType === "mixed" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Type
                      </label>
                      <select
                        name="questionType"
                        value={currentQuestion.questionType}
                        onChange={handleQuestionChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="mcq">MCQ</option>
                        <option value="multiple_correct">
                          Multiple Correct
                        </option>
                        <option value="text">Text</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points
                    </label>
                    <input
                      type="number"
                      name="points"
                      value={currentQuestion.points}
                      onChange={handleQuestionChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {(currentQuestion.questionType === "mcq" ||
                  currentQuestion.questionType === "multiple_correct") && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Options
                      </label>
                      <button
                        onClick={addOption}
                        className="text-orange-600 hover:text-orange-800 text-sm flex items-center gap-1"
                      >
                        <Plus size={16} />
                        Add Option
                      </button>
                    </div>
                    <div className="space-y-2">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type={
                              currentQuestion.questionType === "mcq"
                                ? "radio"
                                : "checkbox"
                            }
                            checked={option.isCorrect}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                "isCorrect",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4"
                          />
                          <input
                            type="text"
                            value={option.optionText}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                "optionText",
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder={`Option ${String.fromCharCode(
                              65 + index
                            )}`}
                          />
                          {currentQuestion.options.length > 1 && (
                            <button
                              onClick={() => removeOption(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={saveQuestion}
                    className="flex-1 bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors"
                  >
                    {editingIndex !== null ? "Update Question" : "Add Question"}
                  </button>
                  <button
                    onClick={() => setShowQuestionModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}