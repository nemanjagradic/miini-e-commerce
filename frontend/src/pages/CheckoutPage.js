import { useParams } from "react-router-dom";
import CheckoutStepOne from "../components/Layout/Checkout/CheckoutStepOne";
import CheckoutStepTwo from "../components/Layout/Checkout/CheckoutStepTwo";
import CheckoutStepThree from "../components/Layout/Checkout/CheckoutStepThree";

const CheckoutPage = () => {
  const { step } = useParams();
  return (
    <div>
      {parseInt(step) === 1 && <CheckoutStepOne />}
      {parseInt(step) === 2 && <CheckoutStepTwo />}
      {parseInt(step) === 3 && <CheckoutStepThree />}
    </div>
  );
};

export default CheckoutPage;
