import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { cartActions } from "../store/cart-slice";
import { syncAnonymousCartFromItems } from "../utils/anonymousCart";
import store from "../store";

export function useUpdateQuantity() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const updateQuantity = async (productId, updatedQuantity) => {
    dispatch(uiActions.clearAlert());

    if (!currentUser) {
      dispatch(cartActions.updateItemQuantity({ productId, quantityChange: updatedQuantity }));
      syncAnonymousCartFromItems(store.getState().cart.cartItems);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantityChange: updatedQuantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update quantity.");
      }

      dispatch(
        cartActions.setCart({
          cart: data.cart,
          totalQuantity: data.totalQuantity,
          subtotal: data.subtotal,
        }),
      );
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: err.message || "Something went wrong while updating item.",
          time: 3,
        }),
      );
    }
  };

  return updateQuantity;
}
