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
  const productId = products[1].id;

  return (
    <>
      <SingleProduct tableProductId={productId} />
      <TrendingProducts />
    </>
  );
};

export default ProductPage;
