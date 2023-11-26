import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { products } from "../../App";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const TrendingProducts = () => {
  const { productId } = useParams();
  const [slide, setSlide] = useState(0);
  const [margin, setMargin] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  const slideLeft = () => {
    if (slide === 0) {
      setSlide(-3);
      setMargin(-36);
    } else {
      setSlide((prevSlide) => prevSlide + 1);
      setMargin((prevMargin) => prevMargin + 12);
    }
  };
  const slideRight = () => {
    if (slide === -3) {
      setSlide(0);
      setMargin(0);
    } else {
      setSlide((prevSlide) => prevSlide - 1);
      setMargin((prevMargin) => prevMargin - 12);
    }
  };

  const trendingProducts = products.slice(6, 14).map((product) => {
    return (
      <div
        key={product.id}
        className="w-[220px] lg:w-[200px] lg:h-72 xl:w-[190px] xl:h-72 mr-3 transition duration-1000 border border-solid border-black/20"
        style={{ transform: `translateX(calc(${100 * slide}% + ${margin}px))` }}
      >
        <Link to={`/products/${product.id}`}>
          <div className="w-[220px] lg:w-[200px] lg:h-[180px] xl:w-[190px] xl:h-[200px]">
            <img
              className="w-full h-full"
              src={!productId ? product.imgs[0] : `/${product.imgs[0]}`}
              alt=""
            />
          </div>
          <h2 className="font-Heebo text-lg m-2">{product.title}</h2>
          <p className="text-lg font-bold m-2">${product.price}</p>
        </Link>
      </div>
    );
  });

  return (
    <>
      <div className="my-container flex pt-24 pb-5 items-center">
        <div className="flex-1">
          <h2 className="text-3xl font-semibold font-Heebo">Trending Now</h2>
        </div>
        <div>
          <button
            className="px-3 py-2 mx-1 bg-lightBlack text-white border transition border-black hover:bg-transparent hover:text-black"
            onClick={slideLeft}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className="px-3 py-2 mx-1 bg-lightBlack text-white border transition border-black hover:bg-transparent hover:text-black"
            onClick={slideRight}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
      <div className="my-container flex overflow-hidden">
        {trendingProducts}
      </div>
    </>
  );
};

export default TrendingProducts;
