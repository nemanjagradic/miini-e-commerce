import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { favoritesActions } from "../../store/favorites-slice";

export function useFetchFavorites() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites?.favorites || []);
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (!currentUser || currentUser.isGuest) return;
    if (favorites.length > 0) return;

    const fetchFavorites = async () => {
      dispatch(favoritesActions.setLoading(true));
      dispatch(favoritesActions.setError(null));

      try {
        const res = await fetch(`${API_URL}/users/favorites`, {
          credentials: "include",
        });

        const data = await res.json();
        dispatch(favoritesActions.setFavorites(data.data || []));
      } catch (err) {
        dispatch(favoritesActions.setError("Failed to load favorites"));
      } finally {
        dispatch(favoritesActions.setLoading(false));
      }
    };

    fetchFavorites();
  }, [dispatch, favorites, API_URL, currentUser]);
}
