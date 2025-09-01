import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./ui-slice";
import cartSlice from "./cart-slice";
import userSlice from "./user-slice";
import productsSlice from "./products-slice";
import orderSlice from "./order-slice";
import favoritesSlice from "./favorites-slice";

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    cart: cartSlice.reducer,
    user: userSlice.reducer,
    products: productsSlice.reducer,
    orders: orderSlice.reducer,
    favorites: favoritesSlice.reducer,
  },
});

export default store;
