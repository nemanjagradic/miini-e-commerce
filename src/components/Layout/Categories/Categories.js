import { products } from "../../../App";
import ProductSmallItem from "../../Products/ProductSmallItem";
import { useState, useRef, useEffect } from "react";
import useIntersectionNav from "../../../hooks/useIntersectionNav";
import { Link } from "react-router-dom";
/* eslint-disable no-unused-vars */

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
    <div className="my-container">
      <h3 className="my-8 text-center text-3xl font-semibold">
        {categoryName}
      </h3>
      <ul className="font-Heebo text-center">
        {categoryButtons.map((button, i) => {
          return (
            <Link
              to={`/categories/${button}`}
              key={i}
              onClick={filterProducts.bind(null, button, i)}
              className={`inline-block mx-4 border border-black py-1 px-4 mt-4 md:mt-0 hover:shadow-md ${
                active === i ? "bg-light" : ""
              }`}
            >
              {`${button[0].toUpperCase()}${button.slice(1)}`}
            </Link>
          );
        })}
      </ul>
      <div
        className="flex gap-2 justify-evenly lg:justify-between flex-wrap mt-16"
        ref={productList}
      >
        {allProducts}
      </div>
    </div>
  );
};

export default Categories;
