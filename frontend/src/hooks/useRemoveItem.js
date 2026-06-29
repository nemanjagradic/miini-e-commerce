import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { cartActions } from "../store/cart-slice";
import { syncAnonymousCartFromItems } from "../utils/anonymousCart";
import store from "../store";

export function useRemoveItem() {
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL;
  const { currentUser } = useSelector((state) => state.user);

  const removeItem = async (productId) => {
    dispatch(uiActions.clearAlert());

    if (!currentUser) {
      dispatch(cartActions.removeItem({ productId }));
      syncAnonymousCartFromItems(store.getState().cart.cartItems);
      dispatch(
        uiActions.setAlert({
          status: "success",
          message: "Item removed from cart!",
          time: 3,
        }),
      );
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove item from cart.");
      }

      dispatch(
        cartActions.setCart({
          cart: data.cart,
          totalQuantity: data.totalQuantity,
          subtotal: data.subtotal,
        }),
      );
      dispatch(
        uiActions.setAlert({
          status: "success",
          message: "Item removed from cart!",
          time: 3,
        }),
      );
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: err.message || "Something went wrong while removing item.",
          time: 3,
        }),
      );
    }
  };

  return removeItem;
}
