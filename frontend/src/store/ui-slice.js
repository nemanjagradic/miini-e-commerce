import { createSlice } from "@reduxjs/toolkit";

const initialUiState = {
  isShow: false,
  alert: { isShow: false, status: null, message: "", time: null },
};

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
    setAlert(state, action) {
      const { status, message, time } = action.payload;
      state.alert = { isShow: true, status, message, time };
    },
    clearAlert(state) {
      state.alert = {
        isShow: false,
        status: null,
        message: "",
        time: null,
      };
    },
  },
});

export default uiSlice;
export const uiActions = uiSlice.actions;
