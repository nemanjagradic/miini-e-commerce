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
    <div className="relative my-6 flex justify-between border border-black/30">
      <div className="w-24">
        <img className="h-full w-full" src={`/${item.imgs[0]}`} alt="" />
      </div>
      <div className="flex-1 p-2.5">
        <div className="flex h-14 justify-between">
          <h6 className="font-bold">{item.title}</h6>
          <h6 className="font-bold">
            {" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(item.totalPrice)}
          </h6>
        </div>
        <div className="item-center flex">
          <button
            className="h-[22px] w-[22px] bg-lightBlack text-xs text-white"
            onClick={decreaseQuantity}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span className="w-6 text-center">{item.quantity}</span>
          <button
            className="h-[22px] w-[22px] bg-lightBlack text-xs text-white"
            onClick={increaseQuantity}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <div
          className="absolute bottom-1.5 right-3.5 text-xl"
          onClick={removeItem}
        >
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
