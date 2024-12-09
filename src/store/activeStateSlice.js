import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isActive: '홈',
  previousState: null,
};

const activeStateSlice = createSlice({
  name: 'activeState',
  initialState,
  reducers: {
    setActiveState: (state, action) => {
      state.previousState = state.isActive;
      state.isActive = action.payload;
    },
    resetActiveState: (state) => {
      state.isActive = state.previousState;
      state.previousState = null;
    },
  },
});

export const { setActiveState, resetActiveState } = activeStateSlice.actions;
export default activeStateSlice.reducer;
