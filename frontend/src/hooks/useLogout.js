import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userActions } from "../store/user-slice";
import { cartActions } from "../store/cart-slice";
import { favoritesActions } from "../store/favorites-slice";
import { uiActions } from "../store/ui-slice";
import { orderActions } from "../store/order-slice";

export function useLogout() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async (setModal = null) => {
    try {
      const clearRes = await fetch(`${API_URL}/users/clear-guest-favorites`, {
        method: "POST",
        credentials: "include",
      });
      if (!clearRes.ok) {
        const data = await clearRes.json();
        throw new Error(data.message || "Failed to clear guest favorites");
      }

      const logoutRes = await fetch("http://localhost:8000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!logoutRes.ok) {
        const data = await logoutRes.json();
        throw new Error(data.message || "Logout failed");
      }

      dispatch(userActions.logoutUser());
      dispatch(cartActions.clearCart());
      dispatch(favoritesActions.setFavorites([]));
      dispatch(orderActions.setOrders([]));
      dispatch(uiActions.clearAlert());

      if (typeof setModal === "function") setModal(false); // ✅ safe check
      navigate("/auth");
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: err.message || "Something went very wrong during logout.",
          time: 5,
        }),
      );
    }
  };

  return logout;
}
