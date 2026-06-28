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
    <div className="group relative overflow-hidden rounded-lg border border-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(product.id);
        }}
        className={`z-10 absolute right-3 top-3 rounded-full px-3 py-2 transition-all duration-300 ${
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
        <div className="h-[220px] w-[220px] overflow-hidden xl:h-[250px] xl:w-[270px]">
          <img
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={`/${product.imgs[0]}`}
            alt={product.title}
          />
        </div>
        <h3 className="m-2.5 font-Heebo text-xl xl:text-2xl">
          {product.title}
        </h3>
        <p className="m-2.5 text-xl font-bold">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(product.price)}
        </p>
      </Link>
    </div>
  );
};

export default ProductSmallItem;
