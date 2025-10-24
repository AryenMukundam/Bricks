import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

api.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createAssignment = async (data) => {
  try {
    const response = await api.post("/assignments/instructor/create", data);
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to create assignment",
      errors: error.response?.data?.errors || null,
    };
  }
};

export const getInstructorAssignments = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.batch) queryParams.append("batch", params.batch);
    if (params.isPublished !== undefined)
      queryParams.append("isPublished", params.isPublished);
    if (params.isLocked !== undefined)
      queryParams.append("isLocked", params.isLocked);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const response = await api.get(
      `/assignments/instructor/assignments?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to fetch assignments",
      errors: error.response?.data?.errors || null,
    };
  }
};

export const getAssignmentById = async (assignmentId) => {
  try {
    const response = await api.get(`/assignments/assignment/${assignmentId}`);
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to fetch assignment",
      errors: error.response?.data?.errors || null,
    };
  }
};

export const getAssignmentSubmissions = async (assignmentId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const response = await api.get(
      `/assignments/instructor/assignment/${assignmentId}/submissions?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to fetch submissions",
      errors: error.response?.data?.errors || null,
    };
  }
};

export const updateAssignment = async (assignmentId, data) => {
  try {
    const response = await api.put(
      `/assignments/instructor/assignment/${assignmentId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to update assignment",
      errors: error.response?.data?.errors || null,
    };
  }
};

export const toggleAssignmentLock = async (assignmentId) => {
  try {
    const response = await api.patch(
      `/assignments/instructor/assignment/${assignmentId}/toggle-lock`
    );
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to toggle assignment lock",
      errors: error.response?.data?.errors || null,
    };
  }
};

export const publishAssignment = async (assignmentId) => {
  try {
    const response = await api.patch(
      `/assignments/instructor/assignment/${assignmentId}/publish`
    );
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to publish assignment",
      errors: error.response?.data?.errors || null,
    };
  }
};
export const deleteAssignment = async (assignmentId) => {
  try {
    const response = await api.delete(
      `/assignments/instructor/assignment/${assignmentId}`
    );
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to delete assignment",
      errors: error.response?.data?.errors || null,
    };
  }
};

export const gradeSubmission = async (assignmentId, submissionId, data) => {
  try {
    const response = await api.post(
      `/assignments/instructor/assignment/${assignmentId}/submission/${submissionId}/grade`,
      data
    );
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to grade submission",
      errors: error.response?.data?.errors || null,
    };
  }
};

export const getStudentAssignments = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.status) queryParams.append("status", params.status);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const response = await api.get(
      `/assignments/student/assignments?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to fetch assignments",
      errors: error.response?.data?.errors || null,
    };
  }
};

export const submitAssignment = async (assignmentId, data) => {
  try {
    const response = await api.post(
      `/assignments/student/assignment/${assignmentId}/submit`,
      data
    );
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to submit assignment",
      errors: error.response?.data?.errors || null,
    };
  }
};

export default {
  createAssignment,
  getInstructorAssignments,
  getAssignmentById,
  getAssignmentSubmissions,
  updateAssignment,
  toggleAssignmentLock,
  publishAssignment,
  deleteAssignment,
  gradeSubmission,
  getStudentAssignments,
  submitAssignment,
};
