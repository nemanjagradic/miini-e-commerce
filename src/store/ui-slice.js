import { createSlice } from "@reduxjs/toolkit";

const initialUiState = { isShow: false };

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    showModal(state) {
      state.isShow = true;
    },
    closeModal(state) {
      state.isShow = false;
    },
  },
});

export default uiSlice;
export const uiActions = uiSlice.actions;
