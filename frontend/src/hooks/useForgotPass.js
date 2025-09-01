import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";

export function useForgotPass() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleForgotPass = async (email) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }
      dispatch(
        uiActions.setAlert({
          status: "success",
          message:
            "If this email is in our system, you’ll receive a reset link shortly.",
          time: 5,
        }),
      );

      setTimeout(() => {
        navigate("/auth");
      }, 5000);
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: "Could not send request. Please try again.",
          time: 5,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return { handleForgotPass, error, loading };
}
