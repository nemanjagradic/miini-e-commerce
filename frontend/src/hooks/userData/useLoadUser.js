import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/user-slice";

export function useFetchUser() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API_URL}/users/me`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await res.json();
        dispatch(userActions.setUser(data.data));
      } catch (err) {}
    }
    fetchUser();
  }, [dispatch, API_URL]);
}
