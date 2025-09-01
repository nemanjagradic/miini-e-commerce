import { useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { cartActions } from "../store/cart-slice";

export function useRemoveItem() {
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL;
  const removeItem = async (productId) => {
    dispatch(uiActions.clearAlert());
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
