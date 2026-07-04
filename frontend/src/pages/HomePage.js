import GridLayout from "../components/Layout/Grid Layout/GridLayout";
import HarmonousLiving from "../components/Layout/Harmonous Section/HarmonousLiving";
import TrendingProducts from "../components/Products/TrendingProducts";
import BestProducts from "../components/Products/BestProducts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { uiActions } from "../store/ui-slice";
import { cartActions } from "../store/cart-slice";
import { useNavigate, useSearchParams } from "react-router-dom";

const HomePage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, authChecked } = useSelector((state) => state.user);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");

    if (paymentStatus === "cancel") {
      dispatch(
        uiActions.setAlert({
          message:
            "Payment canceled. We saved your order in history in case you change your mind.",
          status: "notification",
          time: 5,
        }),
      );
      navigate("/", { replace: true });
    }
  }, [searchParams, dispatch, navigate]);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");

    if (paymentStatus !== "success") return;
    if (!authChecked || !currentUser) return;

    let cancelled = false;

    const handlePaymentSuccess = async () => {
      try {
        await fetch(`${API_URL}/cart`, {
          method: "DELETE",
          credentials: "include",
        });
      } catch {
      }

      if (cancelled) return;

      dispatch(cartActions.clearCart());
      dispatch(
        uiActions.setAlert({
          message: "Purchase successful!",
          status: "success",
          time: 5,
        }),
      );
      navigate("/", { replace: true });
    };

    handlePaymentSuccess();

    return () => {
      cancelled = true;
    };
  }, [searchParams, authChecked, currentUser, dispatch, navigate, API_URL]);

  return (
    <>
      <GridLayout />
      <BestProducts />
      <HarmonousLiving order={1} />
      <TrendingProducts />
      <HarmonousLiving order={2} />
    </>
  );
};

export default HomePage;
