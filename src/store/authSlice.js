import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  idToken: null,
  isLoading: false,
  error: null,
  isRegistrationComplete: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.idToken = action.payload.token;
      state.error = null;
    },
    setRegistrationComplete: (state) => {
      state.isRegistrationComplete = true;
    },
    resetRegistrationComplete: (state) => {
      state.isRegistrationComplete = false;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
      state.idToken = null;
    },
    logout: (state) => {
      state.user = null;
      state.idToken = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  setRegistrationComplete,
  resetRegistrationComplete,
  loginFailure,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
