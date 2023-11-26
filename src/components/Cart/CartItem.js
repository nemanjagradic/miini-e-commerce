import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
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
    <div className="flex justify-between relative my-6 border border-black/30">
      <div className="w-24">
        <img className="w-full h-full" src={`/${item.imgs[0]}`} alt="" />
      </div>
      <div className="flex-1 p-2.5">
        <div className="flex justify-between h-14">
          <h6 className="font-bold">{item.title}</h6>
          <h6 className="font-bold">${item.totalPrice}</h6>
        </div>
        <div className="flex item-center">
          <button
            className="bg-lightBlack text-white text-xs w-[22px] h-[22px]"
            onClick={decreaseQuantity}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span className="w-6 text-center">{item.quantity}</span>
          <button
            className="bg-lightBlack text-white text-xs w-[22px] h-[22px]"
            onClick={increaseQuantity}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <div
          className="absolute right-3.5 bottom-1.5 text-xl"
          onClick={removeItem}
        >
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
