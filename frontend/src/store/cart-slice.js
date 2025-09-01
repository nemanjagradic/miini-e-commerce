import { createSlice } from "@reduxjs/toolkit";

const initialCartState = {
  cartItems: [],
  subtotal: 0,
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    setCart(state, action) {
      const rawCart = action.payload.cart;

      state.cartItems = rawCart.map((item) => ({
        id: item.product._id,
        title: item.product.title,
        imgs: item.product.imgs,
        price: item.product.price,
        quantity: item.quantity,
        totalPrice: item.quantity * item.product.price,
      }));

      state.totalQuantity = action.payload.totalQuantity;
      state.subtotal = action.payload.subtotal;
    },
    clearCart(state) {
      state.cartItems = [];
      state.subtotal = 0;
      state.totalQuantity = 0;
    },
  },
});

export default cartSlice;
export const cartActions = cartSlice.actions;
