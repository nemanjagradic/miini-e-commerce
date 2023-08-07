import classes from "./ProductSmallItem.module.css";
import { Link } from "react-router-dom";

const ProductSmallItem = ({ product }) => {
  return (
    <div className={classes["product-item"]}>
      <Link to={`/products/${product.id}`}>
        <div className={classes["product-img"]}>
          <img src={`/${product.imgs[0]}`} alt="" />
        </div>
        <h3 className={classes["product-title"]}>{product.title}</h3>
        <p className={classes["product-price"]}>${product.price}</p>
      </Link>
    </div>
  );
};

export default ProductSmallItem;
