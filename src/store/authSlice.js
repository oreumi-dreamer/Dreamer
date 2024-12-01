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
      state.isRegistrationComplete = action.payload.isRegistrationComplete;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
      state.idToken = null;
      state.isRegistrationComplete = false;
    },
    logout: (state) => {
      state.user = null;
      state.idToken = null;
      state.error = null;
      state.isLoading = false;
      state.isRegistrationComplete = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;
