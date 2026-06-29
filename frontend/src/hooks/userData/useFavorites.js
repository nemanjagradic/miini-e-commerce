import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { favoritesActions } from "../../store/favorites-slice";

export function useFetchFavorites() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const authChecked = useSelector((state) => state.user.authChecked);

  useEffect(() => {
    if (!authChecked || !currentUser) return;

    const fetchFavorites = async () => {
      dispatch(favoritesActions.setLoading(true));
      dispatch(favoritesActions.setError(null));

      try {
        const res = await fetch(`${API_URL}/users/favorites`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          dispatch(
            favoritesActions.setError(
              data.message || "Failed to load favorites",
            ),
          );
          return;
        }

        dispatch(favoritesActions.setFavorites(data.data || []));
      } catch (err) {
        dispatch(favoritesActions.setError("Failed to load favorites"));
      } finally {
        dispatch(favoritesActions.setLoading(false));
      }
    };

    fetchFavorites();
  }, [authChecked, currentUser, dispatch, API_URL]);
}
