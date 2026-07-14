import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "../../UI/Spinner";

const RequireAdmin = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const authChecked = useSelector((state) => state.user.authChecked);
  const location = useLocation();

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f6f3]">
        <Spinner />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;
