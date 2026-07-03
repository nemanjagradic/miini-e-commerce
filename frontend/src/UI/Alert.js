import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCircleExclamation,
  faCircleInfo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { uiActions } from "../store/ui-slice";

const ALERT_STYLES = {
  success: {
    container: "border-green-200/80 bg-green-50/95",
    accent: "border-l-green-500",
    icon: faCheck,
    iconClass: "text-green-600",
    text: "text-green-800",
  },
  error: {
    container: "border-red-200/80 bg-red-50/95",
    accent: "border-l-red-500",
    icon: faCircleExclamation,
    iconClass: "text-red-600",
    text: "text-red-700",
  },
  notification: {
    container: "border-amber-200/80 bg-amber-50/95",
    accent: "border-l-amber-500",
    icon: faCircleInfo,
    iconClass: "text-amber-700",
    text: "text-amber-900",
  },
  info: {
    container: "border-black/10 bg-white/95",
    accent: "border-l-lightBlack",
    icon: faCircleInfo,
    iconClass: "text-lightBlack",
    text: "text-lightBlack",
  },
};

const Alert = () => {
  const dispatch = useDispatch();
  const alert = useSelector((state) => state.ui.alert);

  const styles = ALERT_STYLES[alert.status] ?? ALERT_STYLES.info;

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
    <div className="fixed left-1/2 top-16 z-30 w-[90%] max-w-xs -translate-x-1/2 font-Heebo">
      <div role="alert" className="animate-slideDown">
        <div
          className={`flex items-center gap-2.5 rounded-lg border border-l-[3px] px-3.5 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm ${styles.container} ${styles.accent}`}
        >
          <FontAwesomeIcon
            icon={styles.icon}
            className={`shrink-0 text-sm ${styles.iconClass}`}
          />
          <p className={`flex-1 text-sm font-medium leading-snug ${styles.text}`}>
            {alert.message}
          </p>
          <button
            type="button"
            onClick={() => dispatch(uiActions.clearAlert())}
            className={`shrink-0 rounded p-0.5 opacity-60 transition hover:bg-black/5 hover:opacity-100 ${styles.text}`}
            aria-label="Dismiss alert"
          >
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
