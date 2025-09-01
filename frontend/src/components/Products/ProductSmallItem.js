import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useFavoriteToggle } from "../../hooks/useFavoriteToggle";
import { useSelector } from "react-redux";

const ProductSmallItem = ({ product }) => {
  const favorites = useSelector((state) => state.favorites.favorites);
  const toggleFavorite = useFavoriteToggle();

  const isFavorite = favorites.some(
    (fav) => fav._id.toString() === product.id.toString(),
  );

  return (
    <div className="relative border border-solid border-black/20 transition duration-400 hover:border-black/40 hover:shadow-[3px_3px_4px_#e3e2e2,6px_6px_10px_#ababab]">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(product.id);
        }}
        className={`absolute right-3 top-3 rounded-full px-3 py-2 transition-all duration-300 ${
          isFavorite
            ? "bg-red-50 text-red-500"
            : "bg-white/80 text-gray-400 hover:text-red-400"
        }`}
      >
        <FontAwesomeIcon
          className={`text-lg ${isFavorite ? "text-red-500" : "text-gray-400"}`}
          icon={faHeart}
        />
      </button>

      <Link to={`/products/${product.id}`}>
        <div className="h-[220px] w-[220px] xl:h-[250px] xl:w-[270px]">
          <img
            className="h-full w-full"
            src={`/${product.imgs[0]}`}
            alt={product.title}
          />
        </div>
        <h3 className="m-2.5 font-Heebo text-xl xl:text-2xl">
          {product.title}
        </h3>
        <p className="m-2.5 text-xl font-bold">${product.price}</p>
      </Link>
    </div>
  );
};

export default ProductSmallItem;
