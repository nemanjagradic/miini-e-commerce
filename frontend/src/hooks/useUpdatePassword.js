import { useState } from "react";
import { useDispatch } from "react-redux";
import { parseApiErrors } from "../utils/parseApiErrors";
import { uiActions } from "../store/ui-slice";

export function useUpdatePassword() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState([]);

  const updatePassword = async () => {
    try {
      const res = await fetch(`${API_URL}/users/updateMyPassword`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          passwordConfirm,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        parseApiErrors(data, setPasswordError, "User validation failed:");
        return;
      }

      setPasswordError(null);
      dispatch(
        uiActions.setAlert({
          status: "success",
          message: "Sucessfully updated password!",
          time: 3,
        }),
      );
      setCurrentPassword("");
      setNewPassword("");
      setPasswordConfirm("");
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: "Failed to update user",
          time: 3,
        }),
      );
    }
  };

  return {
    updatePassword,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    passwordConfirm,
    setPasswordConfirm,
    passwordError,
  };
}
