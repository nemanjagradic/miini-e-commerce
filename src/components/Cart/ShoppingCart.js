import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import CartItem from "./CartItem";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const isShow = useSelector((state) => state.ui.isShow);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const subtotal = useSelector((state) => state.cart.subtotal);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const closeModal = () => {
    dispatch(uiActions.closeModal());
  };
  useEffect(() => {
    localStorage.setItem("subtotal", JSON.stringify(subtotal));
    localStorage.setItem("totalQuantity", JSON.stringify(totalQuantity));
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [subtotal, totalQuantity, cartItems]);

  const shoppingCartItems = cartItems.map((item) => {
    return (
      <CartItem
        key={item.id}
        item={{
          id: item.id,
          imgs: item.imgs,
          title: item.title,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        }}
      />
    );
  });
  return (
    <>
      <div
        className={`fixed left-0 top-0 z-[3] h-full w-full bg-black/40 transition duration-300 ${
          !isShow ? "hidden" : ""
        }`}
        onClick={closeModal}
      ></div>
      <div
        className={`fixed right-0 top-0 z-[4] h-screen w-[370px] overflow-y-scroll bg-white p-6 font-Heebo transition duration-300 ${
          !isShow ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <h6 className="font-bold">
          Your Shopping Cart (<span>{totalQuantity}</span>)
        </h6>
        <div className="absolute right-7 top-5 text-2xl" onClick={closeModal}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
        {cartItems.length === 0 && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="mx-auto h-24 w-24">
              <img className="h-full w-full" src="/images/empty.png" alt="" />
            </div>
            <h5 className="mb-3 mt-6 text-xl">Your cart is empty.</h5>
            <Link
              className="mx-auto block rounded-md bg-slate-300 px-5 py-2.5 text-center"
              to="/"
            >
              Keep Browsing
            </Link>
          </div>
        )}
        <div>{shoppingCartItems}</div>
        <div className="flex h-[15%] items-center justify-between bg-white font-Heebo font-bold">
          {cartItems.length !== 0 && (
            <div>
              <p className="mb-1 text-lg">Subtotal:</p>
              <p className="mb-1 text-lg">${subtotal}</p>
            </div>
          )}
          {cartItems.length !== 0 && (
            <div>
              <button className="text-md border-2 border-solid border-black bg-white px-5 py-2">
                Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
