import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isActive: '홈',
};

const activeStateSlice = createSlice({
  name: 'activeState',
  initialState,
  reducers: {
    setActiveState: (state, action) => {
      state.isActive = action.payload;
    },
  },
});

export const { setActiveState } = activeStateSlice.actions;
export default activeStateSlice.reducer;
