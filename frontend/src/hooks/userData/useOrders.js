import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { orderActions } from "../../store/order-slice";

export function useFetchOrders() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders?.orders || []);
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (!currentUser || currentUser.isGuest) return;
    if (orders.length > 0) return;

    const fetchOrders = async () => {
      dispatch(orderActions.setLoading(true));
      dispatch(orderActions.setError(null));

      try {
        const res = await fetch(`${API_URL}/orders`, {
          credentials: "include",
        });

        const data = await res.json();
        dispatch(orderActions.setOrders(data.data || []));
      } catch (err) {
        dispatch(orderActions.setError("Failed to load orders"));
        dispatch(orderActions.setOrders([]));
      } finally {
        dispatch(orderActions.setLoading(false));
      }
    };

    fetchOrders();
  }, [dispatch, orders, API_URL, currentUser]);
}
