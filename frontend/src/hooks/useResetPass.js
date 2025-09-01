import { useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { parseApiErrors } from "../utils/parseApiErrors";

export function useResetPass() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleResetPassword = async (token, newPassword, passwordConfirm) => {
    try {
      const res = await fetch(`${API_URL}/users/resetPassword/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, passwordConfirm }),
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        parseApiErrors(data, setErrors, "User validation failed:");
        return;
      }
      setErrors(null);
      dispatch(
        uiActions.setAlert({
          status: "success",
          message: "Password reset successful. Redirecting to login...",
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

  return { handleResetPassword, errors, loading };
}
