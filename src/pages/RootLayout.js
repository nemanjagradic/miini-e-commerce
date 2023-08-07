import ShoppingCart from "../components/Cart/ShoppingCart";
import Footer from "../components/Layout/Footer/Footer";
import MainNavigation from "../components/Layout/Main Navigation/MainNavigation";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <>
      <MainNavigation />
      <ShoppingCart />
      <Outlet />
      <Footer />
    </>
  );
};

export default RootLayout;
