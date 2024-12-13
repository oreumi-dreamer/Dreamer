import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  modalType: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.modalType = action.payload;
    },

    closeModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
    },

    setModalType(state, action) {
      state.modalType = action.payload;
    },
  },
});

export const { openModal, closeModal, setModalType } = modalSlice.actions;
export default modalSlice.reducer;
