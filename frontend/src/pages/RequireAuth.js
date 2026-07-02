import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "../UI/Spinner";

const RequireAuth = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const authChecked = useSelector((state) => state.user.authChecked);
  const location = useLocation();

  if (!authChecked) {
    return (
      <div className="my-container flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
