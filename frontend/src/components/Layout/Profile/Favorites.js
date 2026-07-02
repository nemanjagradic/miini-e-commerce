import { useSelector } from "react-redux";
import ProductSmallItem from "../../Products/ProductSmallItem";
import ProfilePanel from "./ProfilePanel";
import ProfileEmptyState from "./ProfileEmptyState";

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites.favorites);

  return (
    <ProfilePanel>
      <h2 className="mb-8 text-2xl font-semibold sm:text-3xl">My favorites</h2>

      {!favorites || favorites.length === 0 ? (
        <ProfileEmptyState
          title="You have no favorites yet"
          description="Save products you love by tapping the heart icon."
          ctaLabel="Browse all products"
          ctaTo="/categories/all"
        />
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {favorites.map((product) => (
            <ProductSmallItem
              key={product._id ?? product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </ProfilePanel>
  );
};

export default Favorites;
