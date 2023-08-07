import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import classes from "./BestProducts.module.css";
import { products } from "../../App";
import ProductSmallItem from "./ProductSmallItem";

const BestProducts = () => {
  const bestProducsts = products.slice(5, 11).map((product) => {
    return <ProductSmallItem key={product.id} product={product} />;
  });
  return (
    <Container className={classes["best-sellers"]}>
      <h2>Best Sellers</h2>
      <div className={`${classes["product-list"]} ${classes["mt-5"]}`}>
        {bestProducsts}
      </div>
    </Container>
  );
};

export default BestProducts;
