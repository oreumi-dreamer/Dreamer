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
    },

    closeModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
    },

    setModalType(state, action) {
      state.modalType = action.payload;
      state.isModal = true;
    },
  },
});

export const { openModal, closeModal, setModalType } = modalSlice.actions;
export default modalSlice.reducer;
