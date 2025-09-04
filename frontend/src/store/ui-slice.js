import { createSlice } from "@reduxjs/toolkit";

const initialUiState = {
  isShow: false,
  alert: {
    isShow: false,
    status: null,
    message: "",
    time: null,
    showLogoutButton: false,
  },
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
      const {
        status,
        message,
        time,
        showLogoutButton = false,
      } = action.payload;
      state.alert = { isShow: true, status, message, time, showLogoutButton };
    },
    clearAlert(state) {
      state.alert = {
        isShow: false,
        status: null,
        message: "",
        time: null,
        showLogoutButton: false,
      };
    },
  },
});

export default uiSlice;
export const uiActions = uiSlice.actions;
