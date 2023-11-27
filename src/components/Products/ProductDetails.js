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
    productContainer.current,
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
        className="h-32 w-32 hover:border hover:border-black/30 hover:shadow-md"
        onClick={setMainImage.bind(null, img)}
      >
        <img className="h-full w-full" src={`/${img}`} alt="" />
      </div>
    );
  });

  return (
    <>
      <h2 className="my-12 text-center text-4xl font-semibold">{title}</h2>
      <div className="my-container flex flex-wrap gap-4" ref={productContainer}>
        <div className="mx-auto basis-8/12 min-[910px]:flex-1">
          <div className="h-[400px] w-full sm:w-11/12">
            <img className="h-full w-full" src={`/${bigImage}`} alt="" />
          </div>
          <div className="mt-2 flex gap-2">{smallImgs}</div>
        </div>
        <div className="mx-auto basis-8/12 min-[910px]:flex-1">
          <p className="mb-9 text-xl">{description}</p>
          <div className="mb-6 flex items-center justify-between">
            <h4 className="flex-1 text-xl font-bold md:text-2xl">Quantity</h4>
            <div className="basis-3/6 text-center lg:flex-1">
              <button
                className="border border-black/80 px-2 py-1 transition duration-300 hover:border hover:border-black hover:bg-light md:px-3.5 md:py-2"
                onClick={quantityMinus}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span className="px-2 py-2 text-lg md:px-3.5 md:py-2">
                {itemData.quantity}
              </span>
              <button
                className="border border-black/80 px-2 py-1 transition duration-300 hover:border hover:border-black hover:bg-light md:px-3.5 md:py-2"
                onClick={quantityPlus}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <h4 className="flex-1 text-right text-2xl font-bold">
              ${itemData.totalPrice}
            </h4>
          </div>
          <div className="flex justify-between">
            <button
              className="w-34 h-12 border-2 border-solid border-black px-2 text-base font-semibold uppercase transition duration-300 hover:bg-lightBlack hover:text-white md:w-40 md:text-lg lg:w-48 xl:w-56"
              onClick={addToCart}
            >
              Add To Cart
            </button>
            <button className="w-34 h-12 border-2 border-solid border-bloodRed bg-bloodRed px-2 text-base font-semibold uppercase text-white transition duration-300 hover:bg-transparent hover:text-bloodRed md:w-40 md:text-lg lg:w-48 xl:w-56">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-20 flex w-7/12 justify-evenly gap-4">
        <div
          className={`bg-light p-3 ${
            !curProduct.size ? "basis-1/3" : "flex-1"
          }`}
        >
          <h4 className="mb-1 text-lg font-bold lg:text-2xl">Weight:</h4>
          <p className="text-sm lg:text-base">{weight}</p>
        </div>
        <div
          className={`bg-light p-3 ${
            !curProduct.size ? "basis-1/3" : "flex-1"
          }`}
        >
          <h4 className="mb-1 text-lg font-bold lg:text-2xl">Dimensions:</h4>
          <p className="text-sm lg:text-base">{dimensions}</p>
        </div>
        {curProduct.size && (
          <div className="flex-1 bg-light p-3">
            <h4 className="mb-1 text-lg font-bold lg:text-2xl">Size:</h4>
            <p className="text-sm lg:text-base">{curProduct.size}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
