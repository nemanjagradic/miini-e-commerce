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
        className="w-32 h-32 hover:border hover:border-black/30 hover:shadow-md"
        onClick={setMainImage.bind(null, img)}
      >
        <img className="w-full h-full" src={`/${img}`} alt="" />
      </div>
    );
  });

  return (
    <>
      <h2 className="text-4xl my-12 text-center font-semibold">{title}</h2>
      <div className="my-container flex gap-4 flex-wrap" ref={productContainer}>
        <div className="basis-8/12 mx-auto lg-2:flex-1">
          <div className="w-full sm:w-11/12 h-[400px]">
            <img className="w-full h-full" src={`/${bigImage}`} alt="" />
          </div>
          <div className="flex gap-2 mt-2">{smallImgs}</div>
        </div>
        <div className="basis-8/12 mx-auto lg-2:flex-1">
          <p className="text-xl mb-9">{description}</p>
          <div className="flex mb-6 justify-between items-center">
            <h4 className="flex-1 text-xl md:text-2xl font-bold">Quantity</h4>
            <div className="basis-3/6 lg:flex-1 text-center">
              <button
                className="py-1 px-2 md:px-3.5 md:py-2 transition duration-300 border border-black/80 hover:bg-light hover:border hover:border-black"
                onClick={quantityMinus}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span className="py-2 px-2 md:px-3.5 md:py-2 text-lg">
                {itemData.quantity}
              </span>
              <button
                className="py-1 px-2 md:px-3.5 md:py-2 transition duration-300 border border-black/80 hover:bg-light hover:border hover:border-black"
                onClick={quantityPlus}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <h4 className="flex-1 text-2xl text-right font-bold">
              ${itemData.totalPrice}
            </h4>
          </div>
          <div className="flex justify-between">
            <button
              className="w-34 md:w-40 lg:w-48 xl:w-56 h-12 uppercase font-semibold px-2 text-base md:text-lg transition duration-300 border-2 border-solid border-black hover:bg-lightBlack hover:text-white"
              onClick={addToCart}
            >
              Add To Cart
            </button>
            <button className="w-34 md:w-40 lg:w-48 xl:w-56 h-12 uppercase font-semibold px-2 text-base md:text-lg transition duration-300 border-2 border-solid border-bloodRed bg-bloodRed text-white hover:bg-transparent hover:text-bloodRed">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="w-7/12 mx-auto flex gap-4 justify-evenly mt-20">
        <div
          className={`bg-light p-3 ${
            !curProduct.size ? "basis-1/3" : "flex-1"
          }`}
        >
          <h4 className="text-lg lg:text-2xl font-bold mb-1">Weight:</h4>
          <p className="text-sm lg:text-base">{weight}</p>
        </div>
        <div
          className={`bg-light p-3 ${
            !curProduct.size ? "basis-1/3" : "flex-1"
          }`}
        >
          <h4 className="text-lg lg:text-2xl font-bold mb-1">Dimensions:</h4>
          <p className="text-sm lg:text-base">{dimensions}</p>
        </div>
        {curProduct.size && (
          <div className="bg-light p-3 flex-1">
            <h4 className="text-lg lg:text-2xl font-bold mb-1">Size:</h4>
            <p className="text-sm lg:text-base">{curProduct.size}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
