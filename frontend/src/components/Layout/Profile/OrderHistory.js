import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { loadStripe } from "@stripe/stripe-js";
import Modal from "../../../UI/Modal";
import { useOrderCancel } from "../../../hooks/useOrderCancel";

const OrderHistory = () => {
  const { orders } = useSelector((state) => state.orders);
  const dropdownRef = useRef();
  const [showOrdersType, setShowOrdersType] = useState("active");
  const [isOpen, setIsOpen] = useState(false);
  const [modalOrderId, setModalOrderId] = useState(null);
  const stripePromise = loadStripe(
    "pk_test_51QyE9d05dl18p79dS3qX7YWYCsuujpjtPIw6xraEBmuULgy8Gy5E2Deraeqb6y4ys62XIcAVpgEJSFHh8Ppmyggm002JrhaXbw",
  );
  const cancelOrder = useOrderCancel();

  const handleCancelConfirm = async () => {
    const success = await cancelOrder(modalOrderId);
    if (success) {
      setModalOrderId(null);
    }
  };

  const continuePayment = async (sessionId) => {
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId });
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOrders = (status) => {
    setShowOrdersType(status);
    setIsOpen(false);
  };

  const showOrders = orders.filter((order) => {
    if (showOrdersType === "active") {
      return order.status === "pending" || order.status === "paid";
    } else if (showOrdersType === "canceled") {
      return order.status === "canceled";
    }
    return true;
  });

  if (!orders || orders.length === 0) {
    return (
      <div className="p-10 text-gray-500">
        <p className="text-lg">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-3 py-10 shadow-[0_2px_6px_rgba(0,0,0,0.1)] sm:px-10 sm:py-12">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-xl font-semibold uppercase">Order history</h3>
        <div
          ref={dropdownRef}
          className="group relative w-36 text-center text-sm"
        >
          <button
            onClick={toggleDropdown}
            className="flex w-full items-center justify-center gap-2 bg-darker py-2 text-white"
          >
            Order status
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          <ul
            className={`absolute left-0 w-full origin-top transform bg-white shadow-lg transition-all duration-200 ease-out 
        ${isOpen ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-0 opacity-0"}`}
          >
            <li
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              onClick={() => handleOrders("active")}
            >
              Active orders
            </li>
            <li
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              onClick={() => handleOrders("canceled")}
            >
              Canceled orders
            </li>
          </ul>
        </div>
      </div>

      {showOrders.length === 0 ? (
        <div className="p-10 text-gray-500">
          <p className="text-lg">You have no {showOrdersType} orders yet.</p>
        </div>
      ) : (
        showOrders.map((order) => (
          <div
            key={order._id}
            className="mb-4 space-y-4 border p-4 shadow-sm transition hover:bg-gray-50 sm:p-5"
          >
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
              <h5 className="font-semibold">Order #{order._id.slice(-6)}</h5>
              <span
                className={`${
                  order.status === "pending" && "bg-yellow-200 text-yellow-800"
                } ${order.status === "paid" && "bg-green-200 text-green-800"} ${
                  order.status === "canceled" && "bg-red-200 text-red-800"
                } rounded-full px-3 py-1.5 text-xs font-semibold uppercase`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="text-lightBlack">
                <h5 className="mb-1 text-center text-xs sm:text-start">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h5>
                <div className="flex flex-wrap justify-center sm:justify-start">
                  {order.products.map((product, index) => (
                    <span
                      key={index}
                      className="mb-1 mr-2 inline-block text-sm"
                    >
                      {product.title}{" "}
                      <span className="text-xs text-gray-500">
                        x {product.quantity}
                      </span>
                      {index < order.products.length - 1 && ","}
                    </span>
                  ))}
                </div>
              </div>
              <p className="whitespace-nowrap text-sm font-semibold text-lightBlack">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(order.totalPrice)}
              </p>
            </div>
            {order.status === "pending" && (
              <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setModalOrderId(order._id)}
                  className="border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Cancel Order
                </button>
                <button
                  onClick={() => continuePayment(order.stripeSessionId)}
                  className="bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Continue Payment
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
    </div>
  );
};

export default OrderHistory;
