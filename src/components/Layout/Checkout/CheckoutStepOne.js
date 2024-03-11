import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { cartActions } from "../../../store/cart-slice";
import { Link } from "react-router-dom";

const CheckoutStepOne = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const subtotal = useSelector((state) => state.cart.subtotal);
  const dispatch = useDispatch();
  const increaseQuantity = (item) => {
    dispatch(cartActions.increaseQuantity(item));
  };
  const decreaseQuantity = (id) => {
    dispatch(cartActions.decreaseQuantity(id));
  };
  const removeItem = (id) => {
    dispatch(cartActions.removeItemFromCart(id));
  };
  const formatNumber = (number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
  return (
    <div className="my-container mt-12">
      <h1 className="text-3xl font-bold">Shopping basket</h1>
      <div className="mt-10 flex flex-wrap justify-center gap-16 font-Heebo font-semibold">
        <div className="basis-full min-[1000px]:flex-1">
          <div className="hidden border-b-2 pb-3 uppercase sm:flex">
            <div className="grow">Article</div>
            <div className="basis-1/6">Price</div>
            <div className="basis-1/6">Quantity</div>
            <div className="basis-1/6">Total</div>
          </div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-2 items-center border-b-2 py-3 sm:my-0 sm:grid-cols-12"
            >
              <div className="flex items-center">
                <div
                  className="inline-block pr-5 text-center sm:hidden"
                  onClick={() => removeItem(item.id)}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </div>
                <img
                  className="h-24 w-24 sm:h-full sm:w-full"
                  src={`/${item.imgs[0]}`}
                  alt=""
                />
              </div>
              <div className="text-right sm:col-span-5 sm:pl-4 sm:text-start">
                <p className="mb-1 block text-sm uppercase sm:hidden">
                  Product
                </p>
                <p>{item.title}</p>
              </div>
              <div className="mt-3 text-sm uppercase sm:my-0 sm:hidden">
                Price
              </div>
              <div className="text-right sm:col-span-2 sm:text-start">
                <p>{formatNumber(item.price)}</p>
              </div>
              <div className="mt-3 text-sm uppercase sm:my-0 sm:hidden">
                Quantity
              </div>
              <div className="text-right sm:col-span-2 sm:text-start">
                <button
                  className="h-6 w-6 bg-lightBlack text-xs text-white"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  className="h-6 w-6 bg-lightBlack text-xs text-white"
                  onClick={() => increaseQuantity(item)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <div className="mt-3 text-sm uppercase sm:hidden">Total</div>
              <div className="text-right sm:text-start">
                {formatNumber(item.totalPrice)}
              </div>
              <div
                className="hidden text-center sm:block"
                onClick={() => removeItem(item.id)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </div>
            </div>
          ))}
          <Link
            to="/categories/all"
            className="mt-7 inline-block bg-lightBlack px-4 py-2 text-xs uppercase text-white"
          >
            Back to shop
          </Link>
        </div>
        <div className="basis-full min-[1000px]:basis-[30%] min-[1000px]:border-l-2 min-[1000px]:pl-7">
          <div className="align-center flex justify-between border-b-2 pb-3">
            <h1 className="uppercase">Order summary</h1>
            <p className="text-slate-500">{formatNumber(subtotal)}</p>
          </div>
          <h2 className="border-b-2 py-3">
            The delivery price will be calculated on the next step.
          </h2>
          <div className="mt-7 flex justify-between">
            <h3 className="uppercase">Total</h3>
            <div className="text-right">
              <p className="mb-3 text-xl">{formatNumber(subtotal)}</p>
              <p className="text-xs text-slate-500">
                VAT is included in the price (20%)
              </p>
            </div>
          </div>
          <Link
            to="/checkout/2"
            className="float-right mt-7 bg-lightBlack px-4 py-2 text-xs uppercase text-white"
          >
            Continue payment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStepOne;
