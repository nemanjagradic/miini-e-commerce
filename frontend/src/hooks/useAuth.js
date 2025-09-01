import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userActions } from "../store/user-slice";
import { uiActions } from "../store/ui-slice";
import { parseApiErrors } from "../utils/parseApiErrors";

export function useAuth() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const handleAuth = async (mode, formData, guestUserData = null) => {
    try {
      setLoading(true);
      const url =
        mode === "signup"
          ? `${API_URL}/users/signup`
          : `${API_URL}/users/login`;

      const body = guestUserData
        ? guestUserData
        : mode === "signup"
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

      const guestCart = JSON.parse(localStorage.getItem("guestCart"));
      if (guestCart && guestCart.length > 0 && user && !user.isGuest) {
        try {
          const res = await fetch(`${API_URL}/cart/merge-cart`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: guestCart }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Failed to merge cart");

          localStorage.removeItem("guestCart");
        } catch (err) {
          dispatch(
            uiActions.setAlert({
              status: "error",
              message:
                "We couldn't merge your guest cart. Please add items again.",
              time: 3,
            }),
          );
        }
      }
      setErrors(null);

      if (user.isGuest) {
        navigate("/home");
      } else {
        dispatch(
          uiActions.setAlert({
            status: "success",
            message: `${mode === "login" ? "You have successfully logged in!" : "You have successfully signed up"}`,
            time: 2,
          }),
        );
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
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
