import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { cartActions } from "../store/cart-slice";

export function useAddToCart() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const addToCart = async (id, quantity, buyNow = false) => {
    dispatch(uiActions.clearAlert());
    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          quantity: quantity,
          buyNow,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add item to cart.");
      }

      dispatch(
        cartActions.setCart({
          cart: data.cart,
          totalQuantity: data.totalQuantity,
          subtotal: data.subtotal,
        }),
      );

      if (currentUser && currentUser.isGuest) {
        const guestCartToSave = data.cart.map((item) => ({
          id: item.product._id,
          quantity: item.quantity,
        }));
        localStorage.setItem("guestCart", JSON.stringify(guestCartToSave));
      }

      const existingItem = data.cart.find((item) => item.product._id === id);

      if (buyNow && existingItem) return;

      dispatch(
        uiActions.setAlert({
          status: "success",
          message: "Item added to cart!",
          time: 3,
        }),
      );
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: err.message || "Something went wrong.",
          time: 3,
        }),
      );
    }
  };

  return addToCart;
}
