import { useParams } from "react-router-dom";
import { products } from "../../App";
import ProductDetails from "./ProductDetails";

const SingleProduct = () => {
  const { productId } = useParams();
  const curProduct = products.find(
    (product) => product.id === parseInt(productId),
  );

  return <ProductDetails curProduct={curProduct} />;
};

export default SingleProduct;
