import ShoppingCart from "../components/Cart/ShoppingCart";
import Footer from "../components/Layout/Footer/Footer";
import MainNavigation from "../components/Layout/Main Navigation/MainNavigation";
import Alert from "../UI/Alert";
import { Outlet } from "react-router-dom";
import { useFetchUser } from "../hooks/userData/useLoadUser";
import { useFetchProducts } from "../hooks/userData/useProducts";
import { useFetchCart } from "../hooks/userData/useCart";
import { useFetchOrders } from "../hooks/userData/useOrders";
import { useFetchFavorites } from "../hooks/userData/useFavorites";
import ScrollToTop from "../components/utility/ScrollToTop";

const ProtectedLayout = () => {
  useFetchUser();
  useFetchCart();
  useFetchProducts();
  useFetchOrders();
  useFetchFavorites();

  return (
    <>
      <ScrollToTop />
      <MainNavigation />
      <ShoppingCart />
      <Alert />
      <Outlet />
      <Footer />
    </>
  );
};

export default ProtectedLayout;
