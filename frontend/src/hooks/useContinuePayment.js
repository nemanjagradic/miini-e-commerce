import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { uiActions } from "../store/ui-slice";
import { orderActions } from "../store/order-slice";

export function useContinuePayment() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const stripePromise = loadStripe(
    "pk_test_51QyE9d05dl18p79dS3qX7YWYCsuujpjtPIw6xraEBmuULgy8Gy5E2Deraeqb6y4ys62XIcAVpgEJSFHh8Ppmyggm002JrhaXbw",
  );

  const handleContinuePayment = async () => {
    if (currentUser.isGuest) {
      dispatch(
        uiActions.setAlert({
          status: "notification",
          message:
            "You are currently signed in as a guest. Please log in or sign up to continue with payment.",
          time: 5,
          showLogoutButton: true,
        }),
      );
      return;
    }
    try {
      const res = await fetch(`${API_URL}/orders/checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      dispatch(orderActions.setCurrentOrder(data.order));
      console.log("Session response from backend:", data.session);

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.session.id });
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

  return handleContinuePayment;
}
