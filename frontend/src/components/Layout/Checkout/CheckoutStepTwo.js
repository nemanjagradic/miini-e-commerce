import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { uiActions } from "../../../store/ui-slice";
import { orderActions } from "../../../store/order-slice";
import { userActions } from "../../../store/user-slice";
import ShippingAddressForm from "./ShippingAddressForm";
import {
  emptyShippingAddress,
  isBlankShippingAddress,
  normalizeShippingAddress,
  validateShippingAddressClient,
  withDefaultFullName,
} from "../../../utils/shippingAddress";
import useShippingSettings from "../../../hooks/useShippingSettings";
import {
  getOrderTotal,
  getShippingCost,
} from "../../../utils/shipping";

const stripePromise = loadStripe(
  "pk_test_51QyE9d05dl18p79dS3qX7YWYCsuujpjtPIw6xraEBmuULgy8Gy5E2Deraeqb6y4ys62XIcAVpgEJSFHh8Ppmyggm002JrhaXbw"
);

const CheckoutStepper = ({ active }) => (
  <div className="flex items-center justify-center gap-3 font-Heebo sm:gap-4">
    {[
      { key: "basket", label: "Basket", n: 1 },
      { key: "shipping", label: "Shipping", n: 2 },
      { key: "payment", label: "Payment", n: 3 },
    ].map((step, i, arr) => {
      const isActive = step.key === active;
      const isPast =
        (active === "shipping" && step.key === "basket") ||
        (active === "payment" && step.key !== "payment");
      return (
        <div key={step.key} className="flex items-center gap-2 sm:gap-4">
          <div
            className={`flex items-center gap-2 ${
              isActive || isPast ? "text-lightBlack" : "text-gray-400"
            }`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                isActive || isPast
                  ? "bg-lightBlack text-white"
                  : "border border-gray-300"
              }`}
            >
              {step.n}
            </span>
            <span className="text-sm font-semibold">{step.label}</span>
          </div>
          {i < arr.length - 1 && (
            <div className="h-px w-8 bg-gray-300 sm:w-14" />
          )}
        </div>
      );
    })}
  </div>
);

const CheckoutStepTwo = ({
  onBack,
  resumeOrderId = null,
  resumeOrderAddress = null,
}) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, authChecked } = useSelector((state) => state.user);
  const { cartItems, subtotal } = useSelector((state) => state.cart);
  const { freeShippingThreshold } = useShippingSettings();
  const hadCartItems = useRef(cartItems.length > 0);

  const [address, setAddress] = useState(() =>
    withDefaultFullName(
      resumeOrderAddress ||
        currentUser?.shippingAddress ||
        emptyShippingAddress(),
      currentUser?.name
    )
  );
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const didHydrateFromUser = useRef(false);

  useEffect(() => {
    if (!currentUser || didHydrateFromUser.current) return;
    didHydrateFromUser.current = true;

    if (resumeOrderAddress) {
      setAddress((prev) => withDefaultFullName(prev, currentUser.name));
      return;
    }

    setAddress((prev) => {
      if (!isBlankShippingAddress(prev) || prev.fullName) {
        return withDefaultFullName(prev, currentUser.name);
      }
      return withDefaultFullName(
        currentUser.shippingAddress || emptyShippingAddress(),
        currentUser.name
      );
    });
  }, [currentUser, resumeOrderAddress]);

  useEffect(() => {
    if (cartItems.length > 0) {
      hadCartItems.current = true;
      return;
    }
    // Don't bounce to basket on refresh before the cart hydrates.
    if (!resumeOrderId && authChecked && hadCartItems.current) {
      onBack();
    }
  }, [cartItems.length, onBack, resumeOrderId, authChecked]);

  const clearFieldError = (key) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };
  const formatNumber = (number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);

  const shippingCost = getShippingCost(subtotal, freeShippingThreshold);
  const orderTotal = getOrderTotal(subtotal, freeShippingThreshold);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      dispatch(
        uiActions.setAlert({
          status: "notification",
          message: "Please log in or sign up to continue with payment.",
          time: 5,
        })
      );
      navigate("/auth", {
        state: { from: { pathname: "/checkout", search: "?step=shipping" } },
      });
      return;
    }

    const errors = validateShippingAddressClient(address);
    if (errors) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    try {
      const payload = {
        shippingAddress: normalizeShippingAddress(address),
        saveToProfile,
      };

      const url = resumeOrderId
        ? `${API_URL}/orders/${resumeOrderId}/resume-payment`
        : `${API_URL}/orders/checkout-session`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to start checkout.");
      }

      if (saveToProfile) {
        dispatch(
          userActions.setUser({
            ...currentUser,
            shippingAddress: payload.shippingAddress,
          })
        );
      }

      if (data.order) {
        dispatch(orderActions.setCurrentOrder(data.order));
      }

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.session.id });
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: err.message,
          time: 4,
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="my-container mt-12 mb-16">
      <CheckoutStepper active="shipping" />
      <h1 className="mt-10 font-Heebo text-3xl font-semibold">
        Shipping address
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Where should we deliver your order?
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 grid gap-8 font-Heebo min-[1000px]:grid-cols-[minmax(0,1fr)_320px] lg:gap-10"
      >
        <div className="min-w-0">
          <div className="rounded-lg border border-black/10 p-5 sm:p-6">
            <ShippingAddressForm
              value={address}
              onChange={setAddress}
              idPrefix="checkout"
              showSaveToProfile
              saveToProfile={saveToProfile}
              onSaveToProfileChange={setSaveToProfile}
              errors={fieldErrors}
              onClearError={clearFieldError}
            />
          </div>
          <button
            type="button"
            onClick={onBack}
            className="mt-6 inline-block rounded-lg border border-black/20 bg-white px-4 py-2 text-sm font-medium transition hover:border-black hover:bg-lightBlack hover:text-white"
          >
            Back to basket
          </button>
        </div>

        <aside className="min-w-0">
          <div className="rounded-lg border border-black/10 p-5 sm:sticky sm:top-6">
            <h2 className="text-sm font-semibold text-lightBlack">
              Order summary
            </h2>
            {!resumeOrderId && (
              <div className="mt-4 space-y-3 border-b border-black/10 pb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatNumber(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? "Free" : formatNumber(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-semibold">
                    {formatNumber(orderTotal)}
                  </span>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-lg bg-lightBlack px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
            >
              {submitting ? "Please wait…" : "Continue to payment"}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
};

export { CheckoutStepper };
export default CheckoutStepTwo;
