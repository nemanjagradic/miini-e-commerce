import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { useState } from "react";
import { parseApiErrors } from "../utils/parseApiErrors";
import { userActions } from "../store/user-slice";

export function useUpdateSettings() {
  const API_URL = process.env.REACT_APP_API_URL;
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [photoFile, setPhotoFile] = useState(null);
  const [settingsError, setSettingsError] = useState(null);

  const updateSettings = async () => {
    const noNameChange = name === user.name;
    const noEmailChange = email === user.email;
    const noPhotoChange = !photoFile;

    if (noNameChange && noEmailChange && noPhotoChange) {
      dispatch(
        uiActions.setAlert({
          status: "info",
          message: "No changes to update.",
          time: 3,
        }),
      );
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (photoFile) formData.append("photo", photoFile);

      const res = await fetch(`${API_URL}/users/updateMe`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        parseApiErrors(data, setSettingsError);
        return;
      }

      dispatch(userActions.setUser(data.data.user));
      setSettingsError(null);
      setPhotoFile(null);
      dispatch(
        uiActions.setAlert({
          status: "success",
          message: "Sucessfully updated profile!",
          time: 3,
        }),
      );
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
    updateSettings,
    setPhotoFile,
    name,
    setName,
    email,
    setEmail,
    settingsError,
  };
}
