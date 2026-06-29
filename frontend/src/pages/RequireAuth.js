import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireAuth = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
