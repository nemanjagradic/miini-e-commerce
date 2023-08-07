import classes from "./ProductDetails.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { cartActions } from "../../store/cart-slice";
import useIntersectionNav from "../../hooks/useIntersectionNav";

const ProductDetails = ({ curProduct }) => {
  const { id, description, dimensions, imgs, price, title, weight } =
    curProduct;
  const dispatch = useDispatch();
  const productContainer = useRef();
  useIntersectionNav(
    {
      root: null,
      threshold: 0.5,
    },
    productContainer.current
  );
  const [bigImage, setBigImage] = useState(imgs[0]);
  const [itemData, setItemData] = useState({
    quantity: 1,
    totalPrice: price,
  });

  const updateItemData = (newQuantity) => {
    setItemData(() => ({
      quantity: newQuantity,
      totalPrice: newQuantity * price,
    }));
  };
  const quantityPlus = () => {
    updateItemData(itemData.quantity + 1);
  };
  const quantityMinus = () => {
    if (itemData.quantity > 1) {
      updateItemData(itemData.quantity - 1);
    }
  };
  const setMainImage = (img) => {
    setBigImage(img);
  };
  useEffect(() => {
    setBigImage(imgs[0]);
    setItemData({ quantity: 1, totalPrice: price });
  }, [imgs, price]);

  const addToCart = () => {
    const item = {
      id,
      quantity: itemData.quantity,
      price,
      totalPrice: itemData.totalPrice,
      title,
      imgs,
    };
    dispatch(cartActions.addToCart(item));
  };

  const smallImgs = imgs.map((img, i) => {
    return (
      <div
        key={i}
        className={classes["small-img"]}
        onClick={setMainImage.bind(null, img)}
      >
        <img src={`/${img}`} alt="" />
      </div>
    );
  });

  return (
    <>
      <h2 className={classes["product-name"]}>{title}</h2>
      <div className={classes["product-container"]} ref={productContainer}>
        <div className={classes["product-images"]}>
          <div className={classes["product-main-image"]}>
            <img src={`/${bigImage}`} alt="" />
          </div>
          <div className={classes["product-small-images"]}>{smallImgs}</div>
        </div>
        <div className={classes["product-content"]}>
          <p className={classes["description"]}>{description}</p>
          <div className={classes.info}>
            <h4>Quantity</h4>
            <div className={classes["quantity-buttons"]}>
              <button onClick={quantityMinus}>
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span className={classes.quantity}>{itemData.quantity}</span>
              <button onClick={quantityPlus}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <h4 className={classes.price}>${itemData.totalPrice}</h4>
          </div>
          <div className={classes["add-and-buy"]}>
            <button onClick={addToCart}>Add To Cart</button>
            <button>Buy Now</button>
          </div>
        </div>
      </div>
      <div className={classes["additional-description"]}>
        <div className={classes.weight}>
          <h4>Weight:</h4>
          <p>{weight}</p>
        </div>
        <div className={classes.dimensions}>
          <h4>Dimensions:</h4>
          <p>{dimensions}</p>
        </div>
        {curProduct.size && (
          <div className={classes.size}>
            <h4>Size:</h4>
            <p>{curProduct.size}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
