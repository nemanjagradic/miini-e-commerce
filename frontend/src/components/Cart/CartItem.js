import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useUpdateQuantity } from "../../hooks/useUpdateQuantity";
import { useRemoveItem } from "../../hooks/useRemoveItem";

const CartItem = ({ item }) => {
  const updateQuantity = useUpdateQuantity();
  const removeItem = useRemoveItem();

  return (
    <div className="relative my-6 flex justify-between border border-black/30">
      <div className="w-20 min-[570px]:w-24">
        <img
          className="h-full w-full"
          src={`/${item.imgs[0]}`}
          alt={item.title}
        />
      </div>
      <div className="flex-1 p-2.5">
        <div className="flex h-12 justify-between gap-x-2 min-[570px]:h-14">
          <h6 className="truncate text-sm font-bold min-[570px]:text-base">
            {item.title}
          </h6>
          <h6 className="text-sm font-bold min-[570px]:text-base">
            {" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(item.totalPrice)}
          </h6>
        </div>
        <div className="item-center flex">
          <button
            className={`h-[20px] w-[20px] bg-lightBlack text-xs text-white min-[570px]:h-[22px] min-[570px]:w-[22px]`}
            onClick={() => updateQuantity(item.id, -1)}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span className="w-6 text-center text-sm min-[570px]:text-base">
            {item.quantity}
          </span>
          <button
            className="h-[20px] w-[20px] bg-lightBlack text-xs text-white min-[570px]:h-[22px] min-[570px]:w-[22px]"
            onClick={() => updateQuantity(item.id, 1)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <div
          className="absolute bottom-1.5 right-3.5 text-xl"
          onClick={() => removeItem(item.id)}
        >
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
