import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { useLogout } from "../hooks/useLogout";

const Alert = () => {
  const logout = useLogout();
  const dispatch = useDispatch();

  const alert = useSelector((state) => state.ui.alert);
  let alertColor;

  if (alert.status === "success") {
    alertColor = "bg-green-500";
  } else if (alert.status === "error") {
    alertColor = "bg-red-500";
  } else {
    alertColor = "bg-blue-500";
  }

  useEffect(() => {
    if (alert.isShow) {
      const timer = setTimeout(() => {
        dispatch(uiActions.clearAlert());
      }, alert.time * 1000);

      return () => clearTimeout(timer);
    }
  }, [alert.isShow, alert.time, dispatch]);

  if (!alert.isShow) return null;

  return (
    <div
      className={`fixed left-1/2 top-14 z-10 w-[90%] max-w-md -translate-x-1/2 animate-slideDown rounded-lg px-6 py-4 text-center text-white shadow-lg transition-all duration-500 ${alertColor}`}
    >
      <p className="text-sm font-semibold">{alert.message}</p>
      {alert.status === "notification" && (
        <button
          className="mt-3 bg-white px-10 py-2 text-xs font-semibold uppercase text-blue-500"
          onClick={logout}
        >
          Log out
        </button>
      )}
    </div>
  );
};

export default Alert;
