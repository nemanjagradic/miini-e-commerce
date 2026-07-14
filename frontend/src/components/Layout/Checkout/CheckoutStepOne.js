import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useUpdateQuantity } from "../../../hooks/useUpdateQuantity";
import { useRemoveItem } from "../../../hooks/useRemoveItem";
import useShippingSettings from "../../../hooks/useShippingSettings";
import {
  getAmountUntilFreeShipping,
  getOrderTotal,
  getShippingCost,
} from "../../../utils/shipping";
import {
  getPrimaryImageUrl,
  resolveMediaUrl,
} from "../../../utils/productImages";
import { CheckoutStepper } from "./CheckoutStepTwo";

const CheckoutStepOne = ({ onContinueToShipping }) => {
  const { cartItems, subtotal } = useSelector((state) => state.cart);
  const { freeShippingThreshold, trustLine } = useShippingSettings();

  const updateQuantity = useUpdateQuantity();
  const removeItem = useRemoveItem();

  const formatNumber = (number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);

  const shippingCost = getShippingCost(subtotal, freeShippingThreshold);
  const orderTotal = getOrderTotal(subtotal, freeShippingThreshold);
  const amountUntilFreeShipping = getAmountUntilFreeShipping(
    subtotal,
    freeShippingThreshold
  );

  return (
    <div className="my-container mt-12 mb-16">
      <CheckoutStepper active="basket" />
      <h1 className="mt-10 font-Heebo text-3xl font-semibold">
        Shopping basket
      </h1>

      <div className="mt-8 grid gap-8 font-Heebo min-[1000px]:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
        <div className="min-w-0">
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="relative rounded-lg border border-black/10 p-3 sm:p-4"
              >
                <div className="flex gap-3 sm:gap-4">
                  <img
                    className="h-20 w-20 shrink-0 rounded-lg object-cover sm:h-24 sm:w-24"
                    src={resolveMediaUrl(getPrimaryImageUrl(item.imgs))}
                    alt={item.title}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-lightBlack">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-500 sm:hidden">
                          {formatNumber(item.price)} each
                        </p>
                      </div>
                      <button
                        type="button"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-black/5 hover:text-black"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.title}`}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-black/20 text-xs text-black transition hover:border-black hover:bg-lightBlack hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="min-w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-black/20 text-xs text-black transition hover:border-black hover:bg-lightBlack hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= (item.stockQuantity ?? 0)}
                          aria-label="Increase quantity"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="hidden text-xs text-gray-500 sm:block">
                          {formatNumber(item.price)} each
                        </p>
                        <p className="font-semibold">
                          {formatNumber(item.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/categories/all"
            className="mt-6 inline-block rounded-lg border border-black/20 bg-white px-4 py-2 text-sm font-medium transition hover:border-black hover:bg-lightBlack hover:text-white"
          >
            Back to shop
          </Link>
        </div>

        <aside className="min-w-0">
          <div className="rounded-lg border border-black/10 p-5 sm:sticky sm:top-6">
            <h2 className="text-sm font-semibold text-lightBlack">
              Order summary
            </h2>

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
              {amountUntilFreeShipping > 0 && (
                <p className="text-xs text-gray-500">
                  Add {formatNumber(amountUntilFreeShipping)} more for free
                  delivery
                </p>
              )}
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <span className="text-sm font-semibold">Total</span>
              <div className="text-right">
                <p className="text-xl font-semibold">
                  {formatNumber(orderTotal)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  VAT included (20%)
                </p>
                <p className="mt-1 text-xs text-gray-500">{trustLine}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onContinueToShipping}
              disabled={cartItems.length === 0}
              className="mt-6 w-full rounded-lg bg-lightBlack px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
            >
              Continue to shipping
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutStepOne;
