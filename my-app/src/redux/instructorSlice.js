import { createSlice } from '@reduxjs/toolkit';

const instructorSlice = createSlice({
  name: 'instructor',
  initialState: {
    instructorData: null,
    isAuthenticated: false,
    loading: false
  },
  reducers: {
    setInstructorData: (state, action) => {
      state.instructorData = action.payload;
      state.isAuthenticated = true;
    },
    instructorLogout: (state) => { 
      state.instructorData = null;
      state.isAuthenticated = false;
    }
  }
});

export const { setInstructorData, instructorLogout } = instructorSlice.actions;
export default instructorSlice.reducer;