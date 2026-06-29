import ProductSmallItem from "../../Products/ProductSmallItem";
import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { sortOutOfStockLast } from "../../../utils/productStock";

const categoryButtons = ["all", "chairs", "tables", "clocks", "lamps", "other"];

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

const capitalize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;

const Categories = () => {
  const { categoryName = "all" } = useParams();
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  const { allProducts } = useSelector((state) => state.products);
  const [sort, setSort] = useState("default");

  const activeCategory = query ? "all" : categoryName.toLowerCase();

  const displayedProducts = useMemo(() => {
    let products = [...allProducts];

    if (query) {
      const q = query.toLowerCase();
      products = products.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q),
      );
    } else if (activeCategory !== "all") {
      products = products.filter((p) => p.category === activeCategory);
    }

    switch (sort) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        products.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return sortOutOfStockLast(products);
  }, [allProducts, query, activeCategory, sort]);

  const heading = query
    ? `Search results for "${query}"`
    : capitalize(activeCategory);

  return (
    <div className="my-container">
      <h3 className="my-8 text-center text-3xl font-semibold">{heading}</h3>

      <ul className="text-center font-Heebo">
        {categoryButtons.map((button) => (
          <Link
            to={`/categories/${button}`}
            key={button}
            className={`mx-4 mt-4 inline-block border border-black px-4 py-1 transition hover:shadow-md md:mt-0 ${
              activeCategory === button ? "bg-light" : ""
            }`}
          >
            {capitalize(button)}
          </Link>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-center justify-between gap-3 font-Heebo sm:flex-row">
        <p className="text-sm text-gray-500">
          {displayedProducts.length}{" "}
          {displayedProducts.length === 1 ? "product" : "products"}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-500">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-lightBlack"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {displayedProducts.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center font-Heebo">
          <div className="mx-auto h-24 w-24">
            <img className="h-full w-full" src="/images/empty.png" alt="" />
          </div>
          <h5 className="mb-2 mt-6 text-xl font-semibold">
            {query
              ? `No results for "${query}"`
              : "No products in this category yet."}
          </h5>
          <p className="mb-6 text-gray-500">
            Try a different {query ? "search" : "category"}.
          </p>
          <Link
            to="/categories/all"
            className="border-2 border-solid border-black bg-white px-5 py-2.5 text-sm uppercase tracking-wider transition duration-300 hover:bg-lightBlack hover:text-white"
          >
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {displayedProducts.map((product) => (
            <ProductSmallItem
              key={product._id || product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
