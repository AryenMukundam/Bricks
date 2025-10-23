import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";
import Navbar from "../../components/InstructorDashboard/Navbar";
import ClassList from "../../components/InstructorDashboard/ClassComponent/ClassList.jsx";
import ClassModal from "../../components/InstructorDashboard/ClassComponent/ClassModal.jsx";
import {
  createClass,
  getInstructorClasses,
  deleteClass,
  updateClass
} from "../../apiCalls/classCalls.js";
import {
  setClassData,
  setAllClasses,
  setPagination,
  removeClassData,
  setLoading as setClassLoading,
} from "../../redux/classSlice.js";

const ClassSchedule = () => {
  const { instructorData } = useSelector((state) => state.instructor);
  const { classData, pagination } = useSelector((state) => state.class);
  const [showModal, setShowModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editClassData, setEditClassData] = useState(null);

  const dispatch = useDispatch();

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
        limit: 50,
        ...filters,
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
    toast.promise(fetchClasses(), {
      loading: "Refreshing classes...",
      success: "Classes refreshed!",
      error: "Failed to refresh",
    });
  };

  // Handle create class
  const handleCreateClass = async (formData) => {
    const response = await createClass(formData);
    dispatch(setClassData(response.class));
    await fetchClasses();
    return response;
  };

  // Handle delete class
  const handleDeleteClass = async (classId) => {
    if (!classId) {
      toast.error("Invalid class ID");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this class? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const deletePromise = deleteClass(classId);

      await toast.promise(deletePromise, {
        loading: "Deleting class...",
        success: "Class deleted successfully!",
        error: (err) => err?.message || "Failed to delete class",
      });

      dispatch(removeClassData(classId));
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const handleEditClass = async (classId, updatedData) => {
    try {
      const response = await updateClass(classId, updatedData);
      toast.success("Class updated successfully!");
      const updatedClasses = classData.map((cls) =>
        cls._id === classId ? response.class : cls
      );
      dispatch(setAllClasses(updatedClasses));

      setShowModal(false);
      setEditMode(false);
      setEditClassData(null);
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to update class");
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
              <h1 className="text-3xl font-bold text-gray-900">
                Class Schedule
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and schedule your classes
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={fetchLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <FiRefreshCw
                  size={20}
                  className={fetchLoading ? "animate-spin" : ""}
                />
                Refresh
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <FiPlus size={20} />
                Schedule New Class
              </button>
            </div>
          </div>

          <ClassList
            classes={classData}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            fetchLoading={fetchLoading}
            onDeleteClass={handleDeleteClass}
            onEditClass={(classItem) => {
              setEditMode(true);
              setEditClassData(classItem);
              setShowModal(true);
            }}
          />
        </div>
      </div>

      <ClassModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditMode(false);
          setEditClassData(null);
        }}
        onSubmit={
          editMode
            ? (data) => handleEditClass(editClassData._id, data)
            : handleCreateClass
        }
        instructorData={instructorData}
        initialData={editClassData}
        editMode={editMode}
      />
    </>
  );
};

export default ClassSchedule;
