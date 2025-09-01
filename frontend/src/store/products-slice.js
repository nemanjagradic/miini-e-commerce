import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    allProducts: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProducts(state, action) {
      state.allProducts = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const productsActions = productsSlice.actions;
export default productsSlice;
