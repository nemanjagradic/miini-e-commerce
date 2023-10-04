import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { products } from "../../App";
import classes from "./TrendingProducts.module.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const TrendingProducts = () => {
  const { productId } = useParams();
  const [slide, setSlide] = useState(0);
  const trendingProducts = products.slice(6, 14).map((product) => {
    return (
      <div
        key={product.id}
        className={classes["trending-item"]}
        style={{ transform: `translateX(calc(${100 * slide}% + 20px))` }}
      >
        <Link to={`/products/${product.id}`}>
          <div className={classes["trending-img"]}>
            <img
              src={!productId ? product.imgs[0] : `/${product.imgs[0]}`}
              alt=""
            />
          </div>
          <h2 className={classes["product-title"]}>{product.title}</h2>
          <p className={classes["product-price"]}>${product.price}</p>
        </Link>
      </div>
    );
  });
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  const slideLeft = () => {
    if (slide === 0) {
      setSlide(-3);
    } else {
      setSlide((prevSlide) => prevSlide + 1);
    }
  };
  const slideRight = () => {
    if (slide === -3) {
      setSlide(0);
    } else {
      setSlide((prevSlide) => prevSlide - 1);
    }
  };
  return (
    <>
      <div className={classes["treding-title-buttons"]}>
        <div className={classes["trending-title"]}>
          <h2>Trending Now</h2>
        </div>
        <div className={classes["trending-right"]}>
          <div className={classes["trending-buttons"]}>
            <button className={classes["slider_btn-left"]} onClick={slideLeft}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
              className={classes["slider_btn-right"]}
              onClick={slideRight}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
      <Container className={classes["trending-now"]}>
        {trendingProducts}
      </Container>
    </>
  );
};

export default TrendingProducts;
