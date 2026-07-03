import ProductSmallItem from "./ProductSmallItem";
import { useSelector } from "react-redux";
import { sortOutOfStockLast } from "../../utils/productStock";

const BestProducts = () => {
  const { allProducts, loading } = useSelector((state) => state.products);

  const bestSellers = sortOutOfStockLast(allProducts).slice(3, 11);

  return (
    <div className="my-container mt-24">
      <h2 className="mx-auto mb-8 w-fit text-3xl font-semibold lg:mx-0">
        Best Sellers
      </h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-4 xl:gap-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
          </div>
        ) : (
          bestSellers.map((product) => (
            <ProductSmallItem
              key={product._id ?? product.id}
              product={product}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BestProducts;
