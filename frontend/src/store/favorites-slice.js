import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: [],
    error: null,
    loading: false,
  },
  reducers: {
    setFavorites(state, action) {
      state.favorites = action.payload;
    },
    clearFavorites(state) {
      state.favorites = [];
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const favoritesActions = favoritesSlice.actions;
export default favoritesSlice;
