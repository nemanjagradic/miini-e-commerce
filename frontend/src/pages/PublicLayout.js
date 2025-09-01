import { Outlet } from "react-router-dom";
import Alert from "../UI/Alert";
import ScrollToTop from "../components/utility/ScrollToTop";

function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <Alert />
      <Outlet />
    </>
  );
}

export default PublicLayout;
