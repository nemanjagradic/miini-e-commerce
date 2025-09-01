import { useFavoriteRemove } from "../../../hooks/useFavoriteRemove";

const Favorites = () => {
  const { favorites, removeFromFavorites } = useFavoriteRemove();
  if (!favorites || favorites.length === 0) {
    return (
      <div className="p-10 text-gray-500">
        <p className="text-lg">You have no favorites yet.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-3 py-10 shadow-[0_2px_6px_rgba(0,0,0,0.1)] sm:px-10 sm:py-12">
      <h3 className="mb-10 text-xl font-semibold uppercase">My favorites</h3>

      <div className="grid grid-cols-1 gap-10 min-[550px]:grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
        {favorites.map((fav) => (
          <div
            key={fav._id}
            className="border border-gray-200 bg-white p-10 shadow-sm transition hover:shadow-md"
          >
            <div className="h-52 w-full overflow-hidden">
              <img
                src={`/${fav.imgs[0]}`}
                alt={fav.title}
                className="mx-auto block h-full w-11/12 transition-transform duration-300 hover:scale-105 min-[400px]:w-3/4 sm:w-full"
              />
            </div>

            <h5
              className="mt-4 truncate text-center text-lg font-medium text-gray-800"
              title={fav.title}
            >
              {fav.title}
            </h5>

            <button
              onClick={() => removeFromFavorites(fav._id)}
              className="mx-auto mt-6 block rounded-md border border-red-400 px-5 py-2 text-base font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
              aria-label={`Remove ${fav.title} from favorites`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
