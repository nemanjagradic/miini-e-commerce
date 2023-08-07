import { products } from "../App";
import ProductDetails from "../components/Products/ProductDetails";
import TrendingProducts from "../components/Products/TrendingProducts";

const ProductPage = () => {
  const table = products[3];
  return (
    <>
      <ProductDetails curProduct={table} />
      <TrendingProducts />
    </>
  );
};

export default ProductPage;
