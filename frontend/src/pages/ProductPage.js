import { useSelector } from "react-redux";
import SingleProduct from "../components/Products/SingleProduct";
import TrendingProducts from "../components/Products/TrendingProducts";

const ProductPage = () => {
  const products = useSelector((state) => state.products.allProducts);

  if (!products.length) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
      </div>
    );
  }
  const productSlug = products[1].slug;

  return (
    <>
      <SingleProduct tableProductSlug={productSlug} />
      <TrendingProducts />
    </>
  );
};

export default ProductPage;
