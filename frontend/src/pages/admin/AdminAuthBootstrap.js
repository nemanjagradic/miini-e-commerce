import { Outlet } from "react-router-dom";
import { useFetchUser } from "../../hooks/userData/useLoadUser";

/** Loads auth for admin routes without storefront chrome. */
const AdminAuthBootstrap = () => {
  useFetchUser();
  return <Outlet />;
};

export default AdminAuthBootstrap;
