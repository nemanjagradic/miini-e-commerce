import { createSlice } from "@reduxjs/toolkit";

const initialCartState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  subtotal: JSON.parse(localStorage.getItem("subtotal")) || 0,
  totalQuantity: JSON.parse(localStorage.getItem("totalQuantity")) || 0,
  changedQuantity: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    addToCart(state, action) {
      state.changedQuantity = true;
      state.subtotal = state.subtotal + action.payload.totalPrice;
      state.totalQuantity = state.totalQuantity + action.payload.quantity;
      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity = existingItem.quantity + action.payload.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        state.cartItems.push(action.payload);
      }
    },
    increaseQuantity(state, action) {
      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      existingItem.quantity++;
      state.totalQuantity++;
      existingItem.totalPrice = existingItem.quantity * existingItem.price;
      state.subtotal = state.subtotal + existingItem.price;
    },
    decreaseQuantity(state, action) {
      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload
      );
      existingItem.quantity--;
      state.totalQuantity--;
      existingItem.totalPrice = existingItem.quantity * existingItem.price;
      state.subtotal = state.subtotal - existingItem.price;
      if (existingItem.quantity < 1) {
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== action.payload
        );
      }
    },
    removeItemFromCart(state, action) {
      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload
      );
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      state.subtotal =
        state.subtotal - existingItem.quantity * existingItem.price;
      state.totalQuantity = state.totalQuantity - existingItem.quantity;
    },
    setChangedQuantity(state) {
      state.changedQuantity = false;
    },
  },
});

export default cartSlice;
export const cartActions = cartSlice.actions;
