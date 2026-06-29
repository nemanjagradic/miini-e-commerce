import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { orderActions } from "../../store/order-slice";

export function useFetchOrders() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const authChecked = useSelector((state) => state.user.authChecked);

  useEffect(() => {
    if (!authChecked || !currentUser) return;

    const fetchOrders = async () => {
      dispatch(orderActions.setLoading(true));
      dispatch(orderActions.setError(null));

      try {
        const res = await fetch(`${API_URL}/orders`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          dispatch(
            orderActions.setError(data.message || "Failed to load orders"),
          );
          return;
        }

        dispatch(orderActions.setOrders(data.data || []));
      } catch (err) {
        dispatch(orderActions.setError("Failed to load orders"));
      } finally {
        dispatch(orderActions.setLoading(false));
      }
    };

    fetchOrders();
  }, [authChecked, currentUser, dispatch, API_URL]);
}
