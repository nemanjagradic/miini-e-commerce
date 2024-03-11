import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

const CheckoutStepThree = () => {
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get("id");
  return (
    <div className="m-auto mt-24 w-1/3 bg-green-400/70 px-10 py-5 text-center">
      <div className="mb-4 inline-block rounded-full bg-green-500 px-2.5 py-1.5">
        <FontAwesomeIcon className="text-xl text-white" icon={faCheck} />
      </div>
      <h1 className="font-semibold text-darker">Your order has been placed.</h1>
      <h2 className="mb-4">Order id: {orderId}</h2>
      <p className="mb-8">
        Thank you for your interest in purchasing products from us!
      </p>
      <div>
        <Link
          className="bg-white px-4 py-1.5 font-semibold"
          to="/categories/all"
        >
          Back to shop
        </Link>
      </div>
    </div>
  );
};

export default CheckoutStepThree;
