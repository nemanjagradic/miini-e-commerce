import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import classes from "./Categories.module.css";
import { products } from "../../../App";
import ProductSmallItem from "../../Products/ProductSmallItem";
import { useState, useRef, useEffect } from "react";
import useIntersectionNav from "../../../hooks/useIntersectionNav";
import { Link } from "react-router-dom";

const Categories = () => {
  const [runAgain, setRunAgain] = useState(false);
  useEffect(() => {
    // da bi se rerenderovao page zbog nav elementa i izvrsavanja useIntersectionNav
    setRunAgain(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const productList = useRef();
  useIntersectionNav({ root: null, threshold: 0.4 }, productList.current, true);
  const categoryButtons = [
    "all",
    "chairs",
    "tables",
    "clocks",
    "lamps",
    "other",
  ];
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [categoryName, setCategoryName] = useState("All");
  const [active, setActive] = useState(0);

  const filterProducts = (category, index) => {
    if (category === "all") {
      setFilteredProducts(products);
    } else {
      const categories = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(categories);
    }
    setActive(index);
    setCategoryName(`${category[0].toUpperCase()}${category.slice(1)}`);
  };
  const allProducts = filteredProducts.map((product) => {
    return <ProductSmallItem key={product.id} product={product} />;
  });

  return (
    <Container>
      <h3 className={classes["category-name"]}>{categoryName}</h3>
      <ul className={classes["categories"]}>
        {categoryButtons.map((button, i) => {
          return (
            <Link
              to={`/categories/${button}`}
              key={i}
              onClick={filterProducts.bind(null, button, i)}
              className={active === i ? classes.active : ""}
            >
              {`${button[0].toUpperCase()}${button.slice(1)}`}
            </Link>
          );
        })}
      </ul>
      <div className={classes["product-list"]} ref={productList}>
        {allProducts}
      </div>
    </Container>
  );
};

export default Categories;
