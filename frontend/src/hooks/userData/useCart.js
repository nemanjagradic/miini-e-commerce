import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../store/cart-slice";
import {
  buildCartItemsFromStorage,
  getAnonymousCart,
} from "../../utils/anonymousCart";

export function useFetchCart() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const authChecked = useSelector((state) => state.user.authChecked);
  const allProducts = useSelector((state) => state.products.allProducts);

  useEffect(() => {
    if (!authChecked) return;

    if (currentUser) {
      const getCart = async () => {
        try {
          const res = await fetch(`${API_URL}/cart`, {
            credentials: "include",
          });
          const data = await res.json();

          if (!res.ok) {
            dispatch(cartActions.clearCart());
            return;
          }

          dispatch(
            cartActions.setCart({
              cart: data.cart,
              subtotal: data.subtotal,
              totalQuantity: data.totalQuantity,
            }),
          );
        } catch (err) {
          console.error("Failed to fetch cart", err);
        }
      };

      getCart();
      return;
    }

    if (allProducts.length === 0) return;

    const stored = getAnonymousCart();
    if (stored.length === 0) {
      dispatch(cartActions.clearCart());
      return;
    }

    const cartItems = buildCartItemsFromStorage(stored, allProducts);
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

    dispatch(
      cartActions.setLocalCart({
        cartItems,
        totalQuantity,
        subtotal,
      }),
    );
  }, [currentUser, authChecked, allProducts, dispatch, API_URL]);
}
