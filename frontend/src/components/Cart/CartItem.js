import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useUpdateQuantity } from "../../hooks/useUpdateQuantity";
import { useRemoveItem } from "../../hooks/useRemoveItem";
import {
  getPrimaryImageUrl,
  resolveMediaUrl,
} from "../../utils/productImages";

const CartItem = ({ item }) => {
  const updateQuantity = useUpdateQuantity();
  const removeItem = useRemoveItem();
  const atMax = item.quantity >= (item.stockQuantity ?? 0);

  return (
    <div className="relative my-6 flex justify-between overflow-hidden rounded-lg border border-black/10">
      <div className="w-20 min-[570px]:w-24">
        <img
          className="h-full w-full object-cover"
          src={resolveMediaUrl(getPrimaryImageUrl(item.imgs))}
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
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-black/20 text-xs text-black transition hover:border-black hover:bg-lightBlack hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => updateQuantity(item.id, -1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span className="min-w-6 text-center text-sm min-[570px]:text-base">
            {item.quantity}
          </span>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-black/20 text-xs text-black transition hover:border-black hover:bg-lightBlack hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => updateQuantity(item.id, 1)}
            disabled={atMax}
            aria-label="Increase quantity"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <button
          type="button"
          className="absolute bottom-1.5 right-3.5 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-black/5 hover:text-black"
          onClick={() => removeItem(item.id)}
          aria-label={`Remove ${item.title} from cart`}
        >
          <FontAwesomeIcon icon={faXmark} className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
