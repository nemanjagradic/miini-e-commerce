import GridLayout from "../components/Layout/Grid Layout/GridLayout";
import HarmonousLiving from "../components/Layout/Harmonous Section/HarmonousLiving";
import TrendingProducts from "../components/Products/TrendingProducts";
import BestProducts from "../components/Products/BestProducts";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { uiActions } from "../store/ui-slice";
import { useSearchParams } from "react-router-dom";

const HomePage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");

    if (paymentStatus === "success") {
      dispatch(
        uiActions.setAlert({
          message: "Purchase successful!",
          status: "success",
          time: 5,
        }),
      );
    }

    if (paymentStatus === "cancel") {
      dispatch(
        uiActions.setAlert({
          message:
            "Payment canceled. We saved your order in history in case you change your mind.",
          status: "notification",
          time: 5,
        }),
      );
    }
  }, [searchParams, dispatch]);

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
