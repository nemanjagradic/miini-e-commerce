import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import Modal from "../../../UI/Modal";
import { useOrderCancel } from "../../../hooks/useOrderCancel";
import { useResumePayment } from "../../../hooks/useResumePayment";
import ProfilePanel from "./ProfilePanel";
import ProfileEmptyState from "./ProfileEmptyState";

const orderFilterOptions = [
  { value: "active", label: "Active orders" },
  { value: "canceled", label: "Canceled orders" },
];

const OrderHistory = () => {
  const { orders } = useSelector((state) => state.orders);
  const [showOrdersType, setShowOrdersType] = useState("active");
  const [modalOrderId, setModalOrderId] = useState(null);
  const [payingOrderId, setPayingOrderId] = useState(null);
  const stripePromise = loadStripe(
    "pk_test_51QyE9d05dl18p79dS3qX7YWYCsuujpjtPIw6xraEBmuULgy8Gy5E2Deraeqb6y4ys62XIcAVpgEJSFHh8Ppmyggm002JrhaXbw",
  );
  const cancelOrder = useOrderCancel();
  const resumePayment = useResumePayment();

  const handleCancelConfirm = async () => {
    const success = await cancelOrder(modalOrderId);
    if (success) {
      setModalOrderId(null);
    }
  };

  const handleResumePayment = async (orderId) => {
    setPayingOrderId(orderId);
    await resumePayment(orderId, stripePromise);
    setPayingOrderId(null);
  };

  const showOrders = (orders ?? []).filter((order) => {
    if (showOrdersType === "active") {
      return order.status === "pending" || order.status === "paid";
    }
    if (showOrdersType === "canceled") {
      return order.status === "canceled";
    }
    return true;
  });

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <ProfilePanel>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">Order history</h2>
        {orders?.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="order-filter" className="text-sm text-gray-500">
              Show
            </label>
            <select
              id="order-filter"
              value={showOrdersType}
              onChange={(e) => setShowOrdersType(e.target.value)}
              className="rounded-full border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-lightBlack"
            >
              {orderFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!orders || orders.length === 0 ? (
        <ProfileEmptyState
          title="You have no orders yet"
          description="When you place an order, it will show up here."
          ctaLabel="Browse all products"
          ctaTo="/categories/all"
        />
      ) : showOrders.length === 0 ? (
        <ProfileEmptyState
          title={`No ${showOrdersType} orders`}
          description="Try switching the filter to see other orders."
          ctaLabel="Browse all products"
          ctaTo="/categories/all"
        />
      ) : (
        showOrders.map((order) => (
          <div
            key={order._id}
            className="mb-4 space-y-4 rounded-lg border border-black/10 p-4 transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
          >
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
              <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase ${
                  order.status === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : order.status === "paid"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="text-lightBlack">
                <p className="mb-1 text-center text-xs text-gray-500 sm:text-start">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start">
                  {order.products.map((product, index) => {
                    const productId = product.product?._id ?? product.product;
                    const title = product.title;

                    return (
                      <span
                        key={index}
                        className="mb-1 mr-2 inline-block text-sm"
                      >
                        {productId ? (
                          <Link
                            to={`/products/${productId}`}
                            className="transition hover:text-lightBlack hover:underline"
                          >
                            {title}
                          </Link>
                        ) : (
                          title
                        )}{" "}
                        <span className="text-xs text-gray-500">
                          x {product.quantity}
                        </span>
                        {index < order.products.length - 1 && ","}
                      </span>
                    );
                  })}
                </div>
              </div>
              <p className="whitespace-nowrap text-sm font-semibold text-lightBlack">
                {formatPrice(order.totalPrice)}
              </p>
            </div>
            {order.status === "pending" && (
              <div className="flex flex-col gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalOrderId(order._id)}
                  className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                >
                  Cancel order
                </button>
                <button
                  type="button"
                  disabled={payingOrderId === order._id}
                  onClick={() => handleResumePayment(order._id)}
                  className="rounded-lg bg-lightBlack px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
                >
                  {payingOrderId === order._id
                    ? "Redirecting..."
                    : "Continue payment"}
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {modalOrderId && (
        <Modal
          message="Cancel this order?"
          cancelOrder="This action cannot be undone."
          cancelMessage="No, keep it"
          confirmMessage="Yes, cancel"
          handleCancel={() => setModalOrderId(null)}
          handleConfirm={handleCancelConfirm}
        />
      )}
    </ProfilePanel>
  );
};

export default OrderHistory;
