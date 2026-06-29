import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { cartActions } from "../store/cart-slice";
import { syncAnonymousCartFromItems } from "../utils/anonymousCart";
import store from "../store";

export function useAddToCart() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const allProducts = useSelector((state) => state.products.allProducts);

  const resolveProduct = async (id) => {
    const fromStore = allProducts.find((p) => p._id === id);
    if (fromStore) return fromStore;

    const res = await fetch(`${API_URL}/products/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Product not found.");
    return data.data;
  };

  const addToCart = async (id, quantity, buyNow = false) => {
    dispatch(uiActions.clearAlert());

    if (!currentUser) {
      try {
        const product = await resolveProduct(id);
        dispatch(cartActions.addOrUpdateItem({ product, quantity, buyNow }));
        syncAnonymousCartFromItems(store.getState().cart.cartItems);

        const updatedItems = store.getState().cart.cartItems;
        const existingItem = updatedItems.find((item) => item.id === id);
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
      return;
    }

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
