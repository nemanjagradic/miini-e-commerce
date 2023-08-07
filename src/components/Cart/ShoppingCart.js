import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import classes from "./ShoppingCart.module.css";
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
        className={`${classes["overlay-2"]} ${isShow ? "" : classes.hidden}`}
        onClick={closeModal}
      ></div>
      <div
        className={`${classes["shopping-cart"]} ${
          isShow ? "" : classes["hide-cart"]
        }`}
      >
        {cartItems.length === 0 && (
          <div className={classes.empty}>
            <div className={classes["empty-img"]}>
              <img src="/images/empty.png" alt="" />
            </div>
            <h5>Your cart is empty.</h5>
            <Link to="/">Keep Browsing</Link>
          </div>
        )}
        <h6>
          Your Shopping Cart (
          <span className={classes["number-items"]}>{totalQuantity}</span>)
        </h6>
        <div className={classes["close-cart"]} onClick={closeModal}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
        <div className={classes["shopping-cart-items"]}>
          {shoppingCartItems}
        </div>
        <div className={classes["subtotal-side"]}>
          {cartItems.length !== 0 && (
            <div>
              <p>Subtotal:</p>
              <p className={classes["subtotal"]}>${subtotal}</p>
            </div>
          )}
          {cartItems.length !== 0 && (
            <div>
              <button>Payment</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
