import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useProduct } from "../../hooks/useProduct";

const SingleProduct = ({ tableProductId }) => {
  const { productId } = useParams();
  const idToUse = tableProductId ?? productId;
  const { product: curProduct, loading } = useProduct(idToUse);
  const addToCart = useAddToCart();

  const navigate = useNavigate();
  const [bigImage, setBigImage] = useState(null);
  const [addStatus, setAddStatus] = useState("idle");
  const [buying, setBuying] = useState(false);
  const [itemData, setItemData] = useState({
    quantity: 1,
    totalPrice: curProduct?.price,
  });

  useEffect(() => {
    if (!curProduct) return;

    setBigImage(curProduct.imgs?.[0]);
    setItemData({ quantity: 1, totalPrice: curProduct?.price });
  }, [curProduct]);

  const updateItemData = (newQuantity) => {
    setItemData(() => ({
      quantity: newQuantity,
      totalPrice: newQuantity * curProduct?.price,
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

  const addToCartHandler = async () => {
    if (addStatus === "adding" || buying) return;
    setAddStatus("adding");
    await addToCart(idToUse, itemData.quantity, false);
    setAddStatus("added");
    setTimeout(() => setAddStatus("idle"), 1500);
  };

  const buyHandler = async () => {
    if (buying || addStatus === "adding") return;
    setBuying(true);
    await addToCart(idToUse, itemData.quantity, true);
    navigate("/checkout");
  };

  const smallImgs = curProduct?.imgs.map((img, i) => {
    return (
      <div
        key={i}
        className="h-32 w-32 cursor-pointer hover:border hover:border-black/30 hover:shadow-md"
        onClick={setMainImage.bind(null, img)}
      >
        <img className="h-full w-full object-cover" src={`/${img}`} alt="" />
      </div>
    );
  });

  if (loading || !curProduct) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
      </div>
    );
  }

  return (
    <>
      <h2 className="my-12 text-center text-4xl font-semibold">
        {curProduct.title}
      </h2>
      <div className="my-container flex flex-wrap gap-4">
        <div className="mx-auto basis-11/12 min-[910px]:basis-6/12">
          <div className="mx-auto h-[400px] md:w-9/12">
            <img
              className="h-full w-full object-contain"
              src={`/${bigImage}`}
              alt={curProduct.title}
            />
          </div>
          <div className="mx-auto mt-2 flex gap-2 md:w-9/12">{smallImgs}</div>
        </div>
        <div className="mx-auto basis-11/12 min-[910px]:basis-[45%]">
          <div className="w-11/12">
            <p className="mb-9 text-xl">{curProduct.description}</p>
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
              <h4 className="flex-1 text-right text-xl font-bold sm:text-2xl">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(itemData.totalPrice)}
              </h4>
            </div>
            <div className="flex justify-between gap-6">
              <button
                disabled={addStatus === "adding" || buying}
                className="h-12 flex-1 border-2 border-solid border-black px-2 text-base font-semibold uppercase transition duration-300 hover:bg-lightBlack hover:text-white disabled:cursor-not-allowed disabled:opacity-70 md:w-40 md:text-lg lg:w-44 xl:w-56"
                onClick={addToCartHandler}
              >
                {addStatus === "adding"
                  ? "Adding..."
                  : addStatus === "added"
                    ? "Added \u2713"
                    : "Add To Cart"}
              </button>
              <button
                disabled={buying || addStatus === "adding"}
                className="h-12 flex-1 border-2 border-solid border-bloodRed bg-bloodRed px-2 text-base font-semibold uppercase text-white transition duration-300 hover:bg-transparent hover:text-bloodRed disabled:cursor-not-allowed disabled:opacity-70 md:w-40 md:text-lg lg:w-44 xl:w-56"
                onClick={buyHandler}
              >
                {buying ? "Processing..." : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-20 flex w-11/12 justify-center gap-4 lg:w-8/12">
        <div
          className={`${
            curProduct.size ? "flex-1" : "basis-5/12"
          } bg-light p-3`}
        >
          <h4 className="mb-1 text-lg font-bold lg:text-2xl">Weight:</h4>
          <p className="text-sm lg:text-base">{curProduct.weight}</p>
        </div>
        <div
          className={`${
            curProduct.size ? "flex-1" : "basis-5/12"
          } bg-light p-3`}
        >
          <h4 className="mb-1 text-lg font-bold lg:text-2xl">Dimensions:</h4>
          <p className="text-sm lg:text-base">{curProduct.dimensions}</p>
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

export default SingleProduct;
