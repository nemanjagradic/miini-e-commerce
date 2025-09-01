import { createSlice } from "@reduxjs/toolkit";

const initialUserState = { currentUser: null, isAuthenticated: false };

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logoutUser(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export default userSlice;
export const userActions = userSlice.actions;
