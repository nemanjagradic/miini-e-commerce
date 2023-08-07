import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import classes from "./CartItem.module.css";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/cart-slice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const increaseQuantity = () => {
    dispatch(cartActions.increaseQuantity(item));
  };
  const decreaseQuantity = () => {
    dispatch(cartActions.decreaseQuantity(item.id));
  };
  const removeItem = () => {
    dispatch(cartActions.removeItemFromCart(item.id));
  };
  return (
    <div className={classes["shopping-cart-item"]}>
      <div className={classes["shopping-item-img"]}>
        <img src={`/${item.imgs[0]}`} alt="" />
      </div>
      <div className={classes["shopping-cart-content"]}>
        <div className={classes["shopping-item-title-price"]}>
          <h6 className={classes["shopping-item-title"]}>{item.title}</h6>
          <h6 className={classes["shopping-item-price"]}>${item.totalPrice}</h6>
        </div>
        <div className={classes["shopping-item-quantity"]}>
          <button
            className={classes["decrease-quantity"]}
            onClick={decreaseQuantity}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span className={classes["quantity"]}>{item.quantity}</span>
          <button className="increase-quantity" onClick={increaseQuantity}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className={classes["delete-shopping-item"]} onClick={removeItem}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
