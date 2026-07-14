import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { userActions } from "../store/user-slice";
import { cartActions } from "../store/cart-slice";
import { uiActions } from "../store/ui-slice";
import { parseApiErrors } from "../utils/parseApiErrors";
import {
  clearAnonymousCart,
  getAnonymousCart,
} from "../utils/anonymousCart";

export function useAuth() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const redirectAfterAuth = () => {
    const from = location.state?.from;
    if (from?.pathname) {
      navigate(
        { pathname: from.pathname, search: from.search || "" },
        { replace: true }
      );
      return;
    }
    navigate("/", { replace: true });
  };

  const handleAuth = async (mode, formData) => {
    try {
      setLoading(true);
      const url =
        mode === "signup"
          ? `${API_URL}/users/signup`
          : `${API_URL}/users/login`;

      const body =
        mode === "signup"
          ? {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              passwordConfirm: formData.passwordConfirm,
            }
          : {
              email: formData.email,
              password: formData.password,
            };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        parseApiErrors(data, setErrors, "User validation failed:");
        return;
      }

      const user = data.data;
      dispatch(userActions.setUser(user));

      const anonymousCart = getAnonymousCart();
      if (anonymousCart.length > 0) {
        try {
          const mergeRes = await fetch(`${API_URL}/cart/merge-cart`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: anonymousCart }),
          });

          const mergeData = await mergeRes.json();
          if (!mergeRes.ok) {
            throw new Error(mergeData.message || "Failed to merge cart");
          }

          clearAnonymousCart();

          const cartRes = await fetch(`${API_URL}/cart`, {
            credentials: "include",
          });
          const cartData = await cartRes.json();
          if (cartRes.ok) {
            dispatch(
              cartActions.setCart({
                cart: cartData.cart,
                subtotal: cartData.subtotal,
                totalQuantity: cartData.totalQuantity,
              }),
            );
          }
        } catch (err) {
          dispatch(
            uiActions.setAlert({
              status: "error",
              message:
                "We couldn't merge your cart. Please add items again.",
              time: 3,
            }),
          );
        }
      }

      setErrors(null);

      dispatch(
        uiActions.setAlert({
          status: "success",
          message:
            mode === "login"
              ? "You have successfully logged in!"
              : "You have successfully signed up!",
          time: 2,
        }),
      );

      setTimeout(redirectAfterAuth, 2000);
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: err.message,
          time: 2,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return { handleAuth, loading, errors, setErrors };
}
