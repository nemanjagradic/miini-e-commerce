import GridLayout from "../components/Layout/Grid Layout/GridLayout";
import HarmonousLiving from "../components/Layout/Harmonous Section/HarmonousLiving";
import TrendingProducts from "../components/Products/TrendingProducts";
import BestProducts from "../components/Products/BestProducts";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { uiActions } from "../store/ui-slice";

const HomePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("payment") === "success") {
      dispatch(
        uiActions.showAlert({
          message: "Purchase successful!",
          status: "success",
          isShow: true,
          time: 5,
        }),
      );
    }
    if (params.get("payment") === "cancel") {
      dispatch(
        uiActions.showAlert({
          message:
            "Payment canceled. We’ve saved your order in case you change your mind.",
          status: "notification",
          isShow: true,
          time: 5,
        }),
      );
    }
  }, [location.search, dispatch]);

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
