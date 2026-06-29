import { uiActions } from "../store/ui-slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { favoritesActions } from "../store/favorites-slice";

export function useFavoriteToggle() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const currentUser = useSelector((state) => state.user.currentUser);

  const toggleFavorite = async (productId) => {
    dispatch(uiActions.clearAlert());

    if (!currentUser) {
      dispatch(
        uiActions.setAlert({
          status: "notification",
          message: "Please log in or sign up to save favorites.",
          time: 4,
        }),
      );
      navigate("/auth");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/favorites`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error("Failed to update favorites");

      const data = await res.json();
      dispatch(favoritesActions.setFavorites(data.data));

      const favoriteExist = data.data.find(
        (fav) => fav._id.toString() === productId.toString(),
      );

      dispatch(
        uiActions.setAlert({
          status: "success",
          message: `Item ${favoriteExist ? "added to" : "removed from"} favorites!`,
          time: 3,
        }),
      );
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message:
            err.message || "Something went wrong while updating favorites.",
          time: 3,
        }),
      );
    }
  };

  return toggleFavorite;
}
