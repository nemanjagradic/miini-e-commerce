import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/cart-slice";

export function useFetchCart() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();

  useEffect(() => {
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
  }, [dispatch, API_URL]);
}
