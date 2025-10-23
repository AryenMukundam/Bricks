// redux/classSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  classData: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalClasses: 0,
    hasMore: false
  }
};

const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    setClassData: (state, action) => {
      // Add new class to the beginning of the array
      state.classData = [action.payload, ...state.classData];
    },
    setAllClasses: (state, action) => {
      state.classData = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    removeClassData: (state, action) => {
      state.classData = state.classData.filter(
        cls => cls._id !== action.payload
      );
    },
    updateClassData: (state, action) => {
      const index = state.classData.findIndex(
        cls => cls._id === action.payload._id
      );
      if (index !== -1) {
        state.classData[index] = action.payload;
      }
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
  setClassData,
  setAllClasses,
  setPagination,
  removeClassData,
  updateClassData,
  setLoading,
  setError,
  clearError
} = classSlice.actions;

export default classSlice.reducer;