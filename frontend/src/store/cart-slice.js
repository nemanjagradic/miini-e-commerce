import { createSlice } from "@reduxjs/toolkit";
import { capQuantity } from "../utils/productStock";

const initialCartState = {
  cartItems: [],
  subtotal: 0,
  totalQuantity: 0,
};

function recalcTotals(state) {
  state.cartItems.forEach((item) => {
    item.totalPrice = item.quantity * item.price;
  });
  state.totalQuantity = state.cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  state.subtotal = state.cartItems.reduce(
    (acc, item) => acc + item.totalPrice,
    0,
  );
}

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
        stockQuantity: item.product.stockQuantity,
        quantity: item.quantity,
        totalPrice: item.quantity * item.product.price,
      }));

      state.totalQuantity = action.payload.totalQuantity;
      state.subtotal = action.payload.subtotal;
    },
    setLocalCart(state, action) {
      state.cartItems = action.payload.cartItems;
      state.totalQuantity = action.payload.totalQuantity;
      state.subtotal = action.payload.subtotal;
    },
    addOrUpdateItem(state, action) {
      const { product, quantity, buyNow } = action.payload;
      const id = product._id;
      const stockQuantity = product.stockQuantity ?? 0;
      const cappedQuantity = capQuantity(quantity, stockQuantity);
      const existing = state.cartItems.find((item) => item.id === id);

      if (existing) {
        const targetQuantity = buyNow
          ? cappedQuantity
          : capQuantity(existing.quantity + quantity, stockQuantity);

        existing.quantity = targetQuantity;
        existing.stockQuantity = stockQuantity;
      } else if (cappedQuantity > 0) {
        state.cartItems.push({
          id,
          title: product.title,
          imgs: product.imgs,
          price: product.price,
          stockQuantity,
          quantity: cappedQuantity,
          totalPrice: cappedQuantity * product.price,
        });
      }

      recalcTotals(state);
    },
    updateItemQuantity(state, action) {
      const { productId, quantityChange } = action.payload;
      const item = state.cartItems.find((i) => i.id === productId);
      if (!item) return;

      const newQuantity = capQuantity(
        item.quantity + quantityChange,
        item.stockQuantity,
      );
      if (newQuantity < 1) return;

      item.quantity = newQuantity;
      recalcTotals(state);
    },
    removeItem(state, action) {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.productId,
      );
      recalcTotals(state);
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
