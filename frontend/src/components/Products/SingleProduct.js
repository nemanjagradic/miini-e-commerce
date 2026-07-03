import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useProduct } from "../../hooks/useProduct";
import Breadcrumb from "../../UI/Breadcrumb";
import ImageLightbox from "../../UI/ImageLightbox";
import StockBadge from "../../UI/StockBadge";
import ProductSpecs from "./ProductSpecs";
import Spinner from "../../UI/Spinner";
import { capQuantity, LOW_STOCK_THRESHOLD } from "../../utils/productStock";
import { TRUST_LINE } from "../../utils/shipping";

const capitalize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const SingleProduct = ({ tableProductSlug }) => {
  const { slug } = useParams();
  const slugToUse = tableProductSlug ?? slug;
  const { product: curProduct, loading } = useProduct(slugToUse);
  const addToCart = useAddToCart();

  const navigate = useNavigate();
  const [bigImage, setBigImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [addStatus, setAddStatus] = useState("idle");
  const [buying, setBuying] = useState(false);
  const [itemData, setItemData] = useState({
    quantity: 1,
    totalPrice: curProduct?.price,
  });

  const stockQuantity = curProduct?.stockQuantity ?? 0;
  const outOfStock = stockQuantity === 0;

  const currentImageIndex =
    curProduct?.imgs?.findIndex((img) => img === bigImage) ?? 0;

  useEffect(() => {
    if (!curProduct) return;

    setBigImage(curProduct.imgs?.[0]);
    const initialQuantity = capQuantity(1, curProduct.stockQuantity);
    setItemData({
      quantity: initialQuantity,
      totalPrice: initialQuantity * curProduct.price,
    });
  }, [curProduct]);

  const updateItemData = (newQuantity) => {
    const capped = capQuantity(newQuantity, stockQuantity);
    setItemData({
      quantity: capped,
      totalPrice: capped * curProduct?.price,
    });
  };

  const quantityPlus = () => {
    if (itemData.quantity < stockQuantity) {
      updateItemData(itemData.quantity + 1);
    }
  };

  const quantityMinus = () => {
    if (itemData.quantity > 1) {
      updateItemData(itemData.quantity - 1);
    }
  };

  const setMainImage = (img) => {
    setBigImage(img);
  };

  const navigateLightbox = (index) => {
    const img = curProduct.imgs[index];
    setBigImage(img);
  };

  const addToCartHandler = async () => {
    if (addStatus === "adding" || buying || outOfStock) return;
    setAddStatus("adding");
    const productId = curProduct._id;
    await addToCart(productId, itemData.quantity, false);
    setAddStatus("added");
    setTimeout(() => setAddStatus("idle"), 1500);
  };

  const buyHandler = async () => {
    if (buying || addStatus === "adding" || outOfStock) return;
    setBuying(true);
    const productId = curProduct._id;
    await addToCart(productId, itemData.quantity, true);
    navigate("/checkout");
  };

  if (loading || !curProduct) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const smallImgs = curProduct.imgs.map((img, i) => {
    const isActive = img === bigImage;

    return (
      <button
        type="button"
        key={i}
        className={`h-32 w-32 cursor-pointer transition hover:shadow-md ${
          isActive
            ? "ring-2 ring-black ring-offset-2"
            : "ring-1 ring-transparent hover:ring-black/30"
        }`}
        onClick={() => setMainImage(img)}
        aria-label={`View image ${i + 1}`}
        aria-current={isActive ? "true" : undefined}
      >
        <img className="h-full w-full object-cover" src={`/${img}`} alt="" />
      </button>
    );
  });

  return (
    <>
      <div className="my-container flex flex-wrap gap-8 py-8">
        <div className="basis-11/12 min-[910px]:basis-6/12">
          <button
            type="button"
            className="block aspect-square w-full max-h-[520px] cursor-zoom-in overflow-hidden rounded-sm"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open image gallery"
          >
            <img
              className="h-full w-full object-cover"
              src={`/${bigImage}`}
              alt={curProduct.title}
            />
          </button>
          <div className="mt-2 flex flex-wrap gap-2">{smallImgs}</div>
        </div>

        <div className="mx-auto basis-11/12 min-[910px]:basis-[45%]">
          <Breadcrumb
            items={[
              { label: "Home", to: "/" },
              {
                label: capitalize(curProduct.category),
                to: `/categories/${curProduct.category}`,
              },
              { label: curProduct.title },
            ]}
          />

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Link
              to={`/categories/${curProduct.category}`}
              className="rounded-full bg-light px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-lightBlack hover:text-white"
            >
              {capitalize(curProduct.category)}
            </Link>
            <StockBadge stockQuantity={stockQuantity} />
            {stockQuantity > 0 && stockQuantity <= LOW_STOCK_THRESHOLD && (
              <span className="text-sm text-amber-700">
                Only {stockQuantity} left
              </span>
            )}
          </div>

          <h1 className="mb-3 font-Heebo text-3xl font-semibold">
            {curProduct.title}
          </h1>

          <p className="mb-1 text-2xl font-bold">
            {formatPrice(curProduct.price)}
          </p>

          {itemData.quantity > 1 && (
            <p className="mb-2 text-sm text-gray-500">
              Total: {formatPrice(itemData.totalPrice)}
            </p>
          )}

          <p className="mb-4 mt-2 text-sm text-gray-500">{TRUST_LINE}</p>

          <p className="mb-6 text-base leading-relaxed text-gray-600">
            {curProduct.description}
          </p>

          <div className="mb-6 flex items-center gap-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
              Quantity
            </span>
            <div className="flex items-center">
              <button
                className="border border-black/80 px-2 py-1 transition duration-300 hover:border hover:border-black hover:bg-light disabled:cursor-not-allowed disabled:opacity-50 md:px-3.5 md:py-2"
                onClick={quantityMinus}
                disabled={outOfStock || itemData.quantity <= 1}
                aria-label="Decrease quantity"
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span className="px-2 py-2 text-lg md:px-3.5 md:py-2">
                {itemData.quantity}
              </span>
              <button
                className="border border-black/80 px-2 py-1 transition duration-300 hover:border hover:border-black hover:bg-light disabled:cursor-not-allowed disabled:opacity-50 md:px-3.5 md:py-2"
                onClick={quantityPlus}
                disabled={outOfStock || itemData.quantity >= stockQuantity}
                aria-label="Increase quantity"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>

          <div className="mb-0 flex justify-between gap-6">
            <button
              disabled={outOfStock || addStatus === "adding" || buying}
              className="h-12 flex-1 border-2 border-solid border-black px-2 text-base font-semibold uppercase transition duration-300 hover:bg-lightBlack hover:text-white disabled:cursor-not-allowed disabled:opacity-70 md:w-40 md:text-lg lg:w-44 xl:w-56"
              onClick={addToCartHandler}
            >
              {outOfStock
                ? "Out of stock"
                : addStatus === "adding"
                  ? "Adding..."
                  : addStatus === "added"
                    ? "Added \u2713"
                    : "Add To Cart"}
            </button>
            <button
              disabled={outOfStock || buying || addStatus === "adding"}
              className="h-12 flex-1 border-2 border-solid border-bloodRed bg-bloodRed px-2 text-base font-semibold uppercase text-white transition duration-300 hover:bg-transparent hover:text-bloodRed disabled:cursor-not-allowed disabled:opacity-70 md:w-40 md:text-lg lg:w-44 xl:w-56"
              onClick={buyHandler}
            >
              {outOfStock
                ? "Out of stock"
                : buying
                  ? "Processing..."
                  : "Buy Now"}
            </button>
          </div>

          <ProductSpecs
            weight={curProduct.weight}
            dimensions={curProduct.dimensions}
            size={curProduct.size}
          />
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={curProduct.imgs}
          currentIndex={currentImageIndex >= 0 ? currentImageIndex : 0}
          onClose={() => setLightboxOpen(false)}
          onNavigate={navigateLightbox}
        />
      )}
    </>
  );
};

export default SingleProduct;
