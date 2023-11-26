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
        className={`fixed top-0 left-0 bg-black/40 w-full h-full z-[3] transition duration-300 ${
          !isShow ? "hidden" : ""
        }`}
        onClick={closeModal}
      ></div>
      <div
        className={`font-Heebo fixed top-0 right-0 w-[370px] bg-white h-screen p-6 transition duration-300 z-[4] overflow-y-scroll ${
          !isShow ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <h6 className="font-bold">
          Your Shopping Cart (<span>{totalQuantity}</span>)
        </h6>
        <div className="absolute top-5 right-7 text-2xl" onClick={closeModal}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
        {cartItems.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
            <div className="w-24 h-24 mx-auto">
              <img className="w-full h-full" src="/images/empty.png" alt="" />
            </div>
            <h5 className="text-xl mt-6 mb-3">Your cart is empty.</h5>
            <Link
              className="block mx-auto px-5 py-2.5 rounded-md text-center bg-slate-300"
              to="/"
            >
              Keep Browsing
            </Link>
          </div>
        )}
        <div>{shoppingCartItems}</div>
        <div className="h-[15%] flex justify-between items-center font-Heebo bg-white font-bold">
          {cartItems.length !== 0 && (
            <div>
              <p className="text-lg mb-1">Subtotal:</p>
              <p className="text-lg mb-1">${subtotal}</p>
            </div>
          )}
          {cartItems.length !== 0 && (
            <div>
              <button className="px-5 py-2 text-md bg-white border-2 border-solid border-black">
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
