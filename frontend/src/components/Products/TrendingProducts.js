import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const TrendingProducts = () => {
  const { productId } = useParams();
  const [slide, setSlide] = useState(0);
  const [margin, setMargin] = useState(0);
  const { allProducts, loading } = useSelector((state) => state.products);

  const productSliced = allProducts.slice(1, 9);

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
        key={product.id}
        className="mr-3 w-[220px] flex-shrink-0 border border-solid border-black/20 transition duration-500 lg:h-72 lg:w-[200px] xl:h-72 xl:w-[190px]"
        style={{ transform: `translateX(calc(${100 * slide}% + ${margin}px))` }}
      >
        <Link to={`/products/${product.id}`}>
          <div className="h-[200px]">
            <img
              className="h-full w-full object-cover"
              src={!productId ? product.imgs[0] : `/${product.imgs[0]}`}
              alt=""
            />
          </div>
          <h2 className="m-2 font-Heebo text-lg">{product.title}</h2>
          <p className="m-2 text-lg font-bold">${product.price}</p>
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
        <div>
          <button
            className="mx-1 border border-black bg-lightBlack px-3 py-2 text-white transition hover:bg-transparent hover:text-black"
            onClick={slideLeft}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className="mx-1 border border-black bg-lightBlack px-3 py-2 text-white transition hover:bg-transparent hover:text-black"
            onClick={slideRight}
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
