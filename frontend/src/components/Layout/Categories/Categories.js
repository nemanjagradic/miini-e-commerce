import ProductSmallItem from "../../Products/ProductSmallItem";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Categories = () => {
  const productListRef = useRef();
  const categoryButtons = [
    "all",
    "chairs",
    "tables",
    "clocks",
    "lamps",
    "other",
  ];
  const { allProducts } = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [categoryName, setCategoryName] = useState("All");
  const [active, setActive] = useState(0);

  const filterProducts = (category, index) => {
    if (category === "all") {
      setFilteredProducts(allProducts);
    } else {
      const categories = allProducts.filter(
        (product) => product.category === category,
      );
      setFilteredProducts(categories);
    }
    setActive(index);
    setCategoryName(`${category[0].toUpperCase()}${category.slice(1)}`);
  };

  return (
    <div className="my-container">
      <h3 className="my-8 text-center text-3xl font-semibold">
        {categoryName}
      </h3>
      <ul className="text-center font-Heebo">
        {categoryButtons.map((button, i) => {
          return (
            <Link
              to={`/categories/${button}`}
              key={i}
              onClick={filterProducts.bind(null, button, i)}
              className={`mx-4 mt-4 inline-block border border-black px-4 py-1 hover:shadow-md md:mt-0 ${
                active === i ? "bg-light" : ""
              }`}
            >
              {`${button[0].toUpperCase()}${button.slice(1)}`}
            </Link>
          );
        })}
      </ul>

      <div
        className="mt-8 flex flex-wrap justify-center gap-8"
        ref={productListRef}
      >
        {(categoryName === "All" ? allProducts : filteredProducts).map(
          (product) => (
            <ProductSmallItem
              key={product._id || product.id}
              product={product}
            />
          ),
        )}
      </div>
    </div>
  );
};

export default Categories;
