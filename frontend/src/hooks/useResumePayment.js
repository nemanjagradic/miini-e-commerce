import { useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";

export function useResumePayment() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();

  const resumePayment = async (orderId, stripePromise) => {
    dispatch(uiActions.clearAlert());

    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/resume-payment`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not resume payment.");
      }

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.session.id,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: err.message,
          time: 3,
        }),
      );
    }
  };

  return resumePayment;
}
