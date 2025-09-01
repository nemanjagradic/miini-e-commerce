import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { favoritesActions } from "../store/favorites-slice";

export function useFavoriteRemove() {
  const API_URL = process.env.REACT_APP_API_URL;
  const favorites = useSelector((state) => state.favorites.favorites);
  const dispatch = useDispatch();

  const removeFromFavorites = async (productId) => {
    dispatch(uiActions.clearAlert());
    try {
      const res = await fetch(`${API_URL}/users/favorites`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Failed to remove favorite!");
      const data = await res.json();
      dispatch(favoritesActions.setFavorites(data.data));
      dispatch(
        uiActions.setAlert({
          status: "success",
          message: "Item removed!",
          time: 3,
        }),
      );
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message:
            err.message ||
            "Something went wrong while removing from favorites.",
          time: 3,
        }),
      );
    }
  };

  return { favorites, removeFromFavorites };
}
