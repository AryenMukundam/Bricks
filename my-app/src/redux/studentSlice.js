import { createSlice } from '@reduxjs/toolkit';

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    studentData: null,
    isAuthenticated: false,
    loading: false
  },
  reducers: {
    setStudentData: (state, action) => {
      state.studentData = action.payload;
      state.isAuthenticated = true;
    },
    studentLogout: (state) => { // renamed from logout
      state.studentData = null;
      state.isAuthenticated = false;
    }
  }
});

export const { setStudentData, studentLogout } = studentSlice.actions;
export default studentSlice.reducer;