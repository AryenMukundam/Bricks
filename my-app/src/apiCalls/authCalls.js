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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Student Authentication
export const studentlogin = async (studentData) => {
  try {
    const response = await api.post("/students/login", studentData);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.errors?.[0]?.msg || 
               error.response?.data?.msg || 
               'Login failed. Please try again.'
    };
  }
};

export const studentlogout = async () => {
  try {
    const response = await api.get("/students/logout");
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.msg || 'Logout failed'
    };
  }
};

export const studentprofile = async () => {
  try {
    const response = await api.get("/students/profile");
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.msg || 'Data Not Visible'
    };
  }
};

export const instructorprofile = async () => {
  try {
    const response = await api.get("/instructors/profile");
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.msg || 'Data Not Visible'
    };
  }
};

// First-Time Login Flow APIs
export const requestPasswordChangeOTP = async (data) => {
  try {
    console.log('Sending OTP request with data:', data);
    const response = await api.post("/students/request-password-change-otp", data);
    console.log('OTP request response:', response.data);
    return response.data;
  } catch (error) {
    console.error('OTP request error:', error.response?.data || error);
    throw {
      message: error.response?.data?.errors?.[0]?.msg || 
               error.response?.data?.msg || 
               error.message ||
               'Failed to send OTP. Please try again.'
    };
  }
};

export const verifyOTPAndChangePassword = async (data) => {
  try {
    const response = await api.post("/students/verify-otp-change-password", data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.errors?.[0]?.msg || 
               error.response?.data?.msg || 
               'Failed to verify OTP. Please try again.'
    };
  }
};

// Forgot Password Flow
export const forgotPassword = async (data) => {
  try {
    const response = await api.post("/students/forgot-password", data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.errors?.[0]?.msg || 
               error.response?.data?.msg || 
               'Failed to process request. Please try again.'
    };
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await api.post("/students/reset-password", data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.errors?.[0]?.msg || 
               error.response?.data?.msg || 
               'Failed to reset password. Please try again.'
    };
  }
};

// Instructor Authentication
export const instructorlogin = async (instructorData) => {
  try {
    const response = await api.post("/instructors/login", instructorData);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.errors?.[0]?.msg || 
               error.response?.data?.msg || 
               'Login failed. Please try again.'
    };
  }
};

export const instructorlogout = async () => {
  try {
    const response = await api.get("/instructors/logout");
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.msg || 'Logout failed'
    };
  }
};