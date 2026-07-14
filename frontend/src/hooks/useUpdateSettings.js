import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { useState } from "react";
import { parseApiErrors } from "../utils/parseApiErrors";
import { userActions } from "../store/user-slice";
import {
  addressesEqual,
  emptyShippingAddress,
  isBlankShippingAddress,
  normalizeShippingAddress,
  validateShippingAddressClient,
  withDefaultFullName,
} from "../utils/shippingAddress";

export function useUpdateSettings() {
  const API_URL = process.env.REACT_APP_API_URL;
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [shippingAddress, setShippingAddress] = useState(() =>
    withDefaultFullName(user.shippingAddress || emptyShippingAddress(), user.name)
  );
  const [photoFile, setPhotoFile] = useState(null);
  const [settingsError, setSettingsError] = useState(null);
  const [shippingErrors, setShippingErrors] = useState({});

  const clearShippingError = (key) => {
    setShippingErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const updateSettings = async () => {
    const noNameChange = name === user.name;
    const noEmailChange = email === user.email;
    const noPhotoChange = !photoFile;
    const noAddressChange = addressesEqual(
      shippingAddress,
      withDefaultFullName(
        user.shippingAddress || emptyShippingAddress(),
        user.name
      )
    );

    if (noNameChange && noEmailChange && noPhotoChange && noAddressChange) {
      dispatch(
        uiActions.setAlert({
          status: "info",
          message: "No changes to update.",
          time: 3,
        })
      );
      return;
    }

    const blankAddress = isBlankShippingAddress(shippingAddress);
    if (!blankAddress) {
      const addressErrors = validateShippingAddressClient(shippingAddress);
      if (addressErrors) {
        setShippingErrors(addressErrors);
        return;
      }
    }
    setShippingErrors({});

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (!blankAddress) {
        formData.append(
          "shippingAddress",
          JSON.stringify(normalizeShippingAddress(shippingAddress))
        );
      }
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
      setShippingAddress(
        withDefaultFullName(
          data.data.user.shippingAddress || emptyShippingAddress(),
          data.data.user.name
        )
      );
      dispatch(
        uiActions.setAlert({
          status: "success",
          message: "Sucessfully updated profile!",
          time: 3,
        })
      );
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: "Failed to update user",
          time: 3,
        })
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
    shippingAddress,
    setShippingAddress,
    shippingErrors,
    clearShippingError,
    settingsError,
  };
}
