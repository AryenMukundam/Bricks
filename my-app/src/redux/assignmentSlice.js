// redux/assignmentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignmentData: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalAssignments: 0,
    hasMore: false
  }
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    setAssignmentData: (state, action) => {
      // Add new assignment to the beginning
      state.assignmentData = [action.payload, ...state.assignmentData];
      state.pagination.totalAssignments += 1;
    },
    setAllAssignments: (state, action) => {
      state.assignmentData = action.payload;
    },
    updateAssignmentData: (state, action) => {
      const index = state.assignmentData.findIndex(
        (a) => a._id === action.payload._id
      );
      if (index !== -1) {
        state.assignmentData[index] = action.payload;
      }
    },
    removeAssignmentData: (state, action) => {
      state.assignmentData = state.assignmentData.filter(
        (a) => a._id !== action.payload
      );
      if (state.pagination.totalAssignments > 0) {
        state.pagination.totalAssignments -= 1;
      }
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setAssignmentData,
  setAllAssignments,
  updateAssignmentData,
  removeAssignmentData,
  setPagination,
  setLoading,
  setError,
  clearError
} = assignmentSlice.actions;

export default assignmentSlice.reducer;
