import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getPrimaryImageUrl,
  resolveMediaUrl,
} from "../../utils/productImages";

const TrendingProducts = () => {
  const [slide, setSlide] = useState(0);
  const [margin, setMargin] = useState(0);
  const { allProducts, loading } = useSelector((state) => state.products);

  const hasFeatured = allProducts.some(
    (p) => p.featuredPlacement === "trending" || p.featuredPlacement === "both"
  );

  const productSliced = hasFeatured
    ? allProducts.filter(
        (p) =>
          p.featuredPlacement === "trending" || p.featuredPlacement === "both"
      )
    : allProducts.slice(1, 9);

  const slideLeft = () => {
    if (slide === 0) {
      setSlide(-2);
      setMargin(-36);
    } else {
      setSlide((prevSlide) => prevSlide + 1);
      setMargin((prevMargin) => prevMargin + 12);
    }
  };
  const slideRight = () => {
    if (slide === -2) {
      setSlide(0);
      setMargin(0);
    } else {
      setSlide((prevSlide) => prevSlide - 1);
      setMargin((prevMargin) => prevMargin - 12);
    }
  };

  const trendingProducts = productSliced.map((product) => {
    return (
      <div
        key={product._id ?? product.id}
        className="group mr-3 w-[220px] flex-shrink-0 overflow-hidden rounded-lg border border-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-lg lg:h-72 lg:w-[200px] xl:h-72 xl:w-[190px]"
        style={{ transform: `translateX(calc(${100 * slide}% + ${margin}px))` }}
      >
        <Link to={`/products/${product.slug}`}>
          <div className="h-[200px] overflow-hidden">
            <img
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={resolveMediaUrl(getPrimaryImageUrl(product.imgs))}
              alt={product.title}
            />
          </div>
          <h2 className="m-2 font-Heebo text-lg">{product.title}</h2>
          <p className="m-2 text-lg font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(product.price)}
          </p>
        </Link>
      </div>
    );
  });

  return (
    <>
      <div className="my-container flex items-center pb-5 pt-24">
        <div className="flex-1">
          <h2 className="font-Heebo text-3xl font-semibold">Trending Now</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-black transition hover:border-black hover:bg-lightBlack hover:text-white"
            onClick={slideLeft}
            aria-label="Previous products"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-black transition hover:border-black hover:bg-lightBlack hover:text-white"
            onClick={slideRight}
            aria-label="Next products"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
      <div className="my-container flex overflow-hidden">
        {loading ? (
          <div className="flex w-full justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
          </div>
        ) : (
          trendingProducts
        )}
      </div>
    </>
  );
};

export default TrendingProducts;
