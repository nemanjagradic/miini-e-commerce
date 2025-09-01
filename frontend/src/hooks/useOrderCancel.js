import { useDispatch } from "react-redux";
import { orderActions } from "../store/order-slice";
import { uiActions } from "../store/ui-slice";

export const useOrderCancel = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();

  const cancelOrder = async (id) => {
    dispatch(uiActions.clearAlert());

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Cancel order failed.");
      }

      dispatch(orderActions.setOrders(data.data));

      dispatch(
        uiActions.setAlert({
          status: "success",
          message: "Order cancelled successfully.",
          time: 3,
        }),
      );

      return true;
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message:
            err.message || "Something went wrong while cancelling order.",
          time: 3,
        }),
      );

      return false;
    }
  };

  return cancelOrder;
};
