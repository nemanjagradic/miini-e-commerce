import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCartShopping,
  faCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useFavoriteToggle } from "../../hooks/useFavoriteToggle";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useSelector } from "react-redux";
import StockBadge from "../../UI/StockBadge";

const capitalize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;

const ProductSmallItem = ({ product }) => {
  const favorites = useSelector((state) => state.favorites.favorites);
  const toggleFavorite = useFavoriteToggle();
  const addToCart = useAddToCart();
  const [addStatus, setAddStatus] = useState("idle");

  const productId = product._id ?? product.id;
  const outOfStock = (product.stockQuantity ?? 0) === 0;

  const isFavorite = favorites.some(
    (fav) => fav._id.toString() === productId.toString(),
  );

  const addToCartHandler = async () => {
    if (addStatus === "adding" || outOfStock) return;

    setAddStatus("adding");
    await addToCart(productId, 1, false);
    setAddStatus("added");
    setTimeout(() => setAddStatus("idle"), 1500);
  };

  const cartIcon =
    addStatus === "adding"
      ? faSpinner
      : addStatus === "added"
        ? faCheck
        : faCartShopping;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(productId);
        }}
        className={`absolute right-3 top-3 z-[2] rounded-full px-3 py-2 transition-all duration-300 ${
          isFavorite
            ? "bg-red-50 text-red-500"
            : "bg-white/80 text-gray-400 hover:text-red-400"
        }`}
        aria-label={
          isFavorite
            ? `Remove ${product.title} from favorites`
            : `Add ${product.title} to favorites`
        }
      >
        <FontAwesomeIcon
          className={`text-lg ${isFavorite ? "text-red-500" : "text-gray-400"}`}
          icon={faHeart}
        />
      </button>

      <div className="absolute left-3 top-3 z-[2] flex flex-col gap-1.5">
        <Link
          to={`/categories/${product.category}`}
          onClick={(e) => e.stopPropagation()}
          className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-white hover:text-black"
        >
          {capitalize(product.category)}
        </Link>
        <StockBadge stockQuantity={product.stockQuantity} />
      </div>

      <Link to={`/products/${productId}`}>
        <div className="h-[220px] w-[220px] overflow-hidden xl:h-[250px] xl:w-[270px]">
          <img
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={`/${product.imgs[0]}`}
            alt={product.title}
          />
        </div>
      </Link>

      <div className="flex items-center gap-2 m-2.5">
        <Link to={`/products/${productId}`} className="min-w-0 flex-1">
          <h3 className="truncate font-Heebo text-xl xl:text-2xl">
            {product.title}
          </h3>
          <p className="text-xl font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(product.price)}
          </p>
        </Link>

        <button
          type="button"
          disabled={outOfStock || addStatus === "adding"}
          onClick={addToCartHandler}
          aria-label={
            outOfStock
              ? `${product.title} is out of stock`
              : addStatus === "added"
                ? `${product.title} added to cart`
                : `Add ${product.title} to cart`
          }
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/20 transition disabled:cursor-not-allowed disabled:opacity-40 ${
            addStatus === "added"
              ? "border-green-600 bg-green-50 text-green-600"
              : "bg-light text-black hover:border-black hover:bg-lightBlack hover:text-white"
          }`}
        >
          <FontAwesomeIcon
            icon={cartIcon}
            className={`text-base ${addStatus === "adding" ? "animate-spin" : ""}`}
          />
        </button>
      </div>
    </div>
  );
};

export default ProductSmallItem;
