import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orders",
  initialState: { orders: [], currentOrder: null, error: null, loading: false },
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
    },
    setCurrentOrder(state, action) {
      state.currentOrder = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const orderActions = orderSlice.actions;
export default orderSlice;
