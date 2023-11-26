import { products } from "../../App";
import ProductSmallItem from "./ProductSmallItem";

const BestProducts = () => {
  const bestProducsts = products.slice(5, 11).map((product) => {
    return <ProductSmallItem key={product.id} product={product} />;
  });
  return (
    <div className="my-container mt-24">
      <h2 className="mb-8 mx-auto w-fit text-3xl font-semibold lg:mx-0">
        Best Sellers
      </h2>
      <div className="flex gap-4 lg:gap-2 justify-evenly lg:justify-between items-center flex-wrap">
        {bestProducsts}
      </div>
    </div>
  );
};

export default BestProducts;
