import { useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";

export function useResumePayment() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();

  const resumePayment = async (orderId, stripePromise, options = {}) => {
    dispatch(uiActions.clearAlert());

    try {
      const body =
        options.shippingAddress != null
          ? {
              shippingAddress: options.shippingAddress,
              saveToProfile: options.saveToProfile !== false,
            }
          : undefined;

      const res = await fetch(`${API_URL}/orders/${orderId}/resume-payment`, {
        method: "POST",
        credentials: "include",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();

      if (!res.ok) {
        const err = new Error(data.message || "Could not resume payment.");
        err.code = data.message;
        throw err;
      }

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.session.id,
      });

      if (error) {
        throw new Error(error.message);
      }
      return true;
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: err.message,
          time: 3,
        }),
      );
      return false;
    }
  };

  return resumePayment;
}
