import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CheckoutStepOne from "../components/Layout/Checkout/CheckoutStepOne";
import CheckoutStepTwo from "../components/Layout/Checkout/CheckoutStepTwo";

const RESUME_KEY = "checkoutResume";

const readResume = () => {
  try {
    const raw = sessionStorage.getItem(RESUME_KEY);
    if (!raw) return { orderId: null, shippingAddress: null };
    const data = JSON.parse(raw);
    return {
      orderId: data.orderId || null,
      shippingAddress: data.shippingAddress || null,
    };
  } catch {
    return { orderId: null, shippingAddress: null };
  }
};

const writeResume = (orderId, shippingAddress) => {
  sessionStorage.setItem(
    RESUME_KEY,
    JSON.stringify({ orderId, shippingAddress })
  );
};

const clearResume = () => {
  sessionStorage.removeItem(RESUME_KEY);
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = searchParams.get("step") === "shipping" ? "shipping" : "basket";

  const [resumeOrderId, setResumeOrderId] = useState(
    () => location.state?.orderId || readResume().orderId
  );
  const [resumeOrderAddress, setResumeOrderAddress] = useState(
    () => location.state?.shippingAddress || readResume().shippingAddress
  );

  // Resume payment from order history → land on shipping and persist across refresh
  useEffect(() => {
    if (!location.state?.step && !location.state?.orderId) return;

    const orderId = location.state.orderId || null;
    const shippingAddress = location.state.shippingAddress || null;

    if (orderId) {
      setResumeOrderId(orderId);
      setResumeOrderAddress(shippingAddress);
      writeResume(orderId, shippingAddress);
    }

    navigate(
      { pathname: "/checkout", search: "?step=shipping" },
      { replace: true, state: {} }
    );
  }, [location.state, navigate]);

  const goShipping = useCallback(() => {
    setResumeOrderId(null);
    setResumeOrderAddress(null);
    clearResume();
    setSearchParams({ step: "shipping" }, { replace: true });
  }, [setSearchParams]);

  const goBasket = useCallback(() => {
    setResumeOrderId(null);
    setResumeOrderAddress(null);
    clearResume();
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  if (step === "shipping") {
    return (
      <CheckoutStepTwo
        onBack={goBasket}
        resumeOrderId={resumeOrderId}
        resumeOrderAddress={resumeOrderAddress}
      />
    );
  }

  return <CheckoutStepOne onContinueToShipping={goShipping} />;
};

export default CheckoutPage;
