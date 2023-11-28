import { products } from "../../App";
import ProductSmallItem from "./ProductSmallItem";

const BestProducts = () => {
  const bestProducsts = products.slice(5, 13).map((product) => {
    return <ProductSmallItem key={product.id} product={product} />;
  });
  return (
    <div className="my-container mt-24">
      <h2 className="mx-auto mb-8 w-fit text-3xl font-semibold lg:mx-0">
        Best Sellers
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-3 xl:gap-9">
        {bestProducsts}
      </div>
    </div>
  );
};

export default BestProducts;
