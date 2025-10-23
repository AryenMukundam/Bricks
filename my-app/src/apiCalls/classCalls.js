import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

api.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createClass = async (classData) => {
  try {
    const response = await api.post("/classes/create", classData);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.msg || error.response?.data?.message || 'Failed to create class',
      errors: error.response?.data?.errors || null
    };
  }
};

export const getInstructorClasses = async ({ status, batch, page = 1, limit = 10 }) => {
  try {
    const params = { status, batch, page, limit };
    const response = await api.get("/classes/instructor/classes", { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.msg || "Failed to fetch classes",
      errors: error.response?.data?.errors || null,
    };
  }
};

export const deleteClass = async (classId) => {
  try {
    const response = await api.delete(`/classes/instructor/class/${classId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.msg || 
                        "Failed to delete class";
    
    throw {
      message: errorMessage,
      errors: error.response?.data?.errors || null,
      status: error.response?.status
    };
  }
};
export const updateClass = async (classId, classData) => {
  try {
    const response = await api.put(`/classes/instructor/class/${classId}`, classData);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.msg || "Failed to update class",
      errors: error.response?.data?.errors || null,
    };
  }
};

// Student APIs

export const getStudentClasses = async ({ status, upcoming, page = 1, limit = 10 } = {}) => {
  try {
    const params = { status, upcoming, page, limit };
    const response = await api.get("/classes/student/classes", { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.msg || error.response?.data?.message || "Failed to fetch student classes",
      errors: error.response?.data?.errors || null,
    };
  }
};
