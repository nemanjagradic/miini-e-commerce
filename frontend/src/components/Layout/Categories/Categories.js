import ProductSmallItem from "../../Products/ProductSmallItem";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { sortOutOfStockLast } from "../../../utils/productStock";
import { getCategorySlug } from "../../../utils/productImages";

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "name-desc", label: "Name: Z–A" },
];

const capitalize = (str) =>
  str ? `${str[0].toUpperCase()}${str.slice(1)}` : "";

const getCategoryChipClass = (active) =>
  `shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
    active
      ? "bg-lightBlack text-white"
      : "border border-gray-300 text-darker/70 hover:border-lightBlack hover:text-lightBlack"
  }`;

const Categories = () => {
  const { categoryName = "all" } = useParams();
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const API_URL = process.env.REACT_APP_API_URL;

  const { allProducts } = useSelector((state) => state.products);
  const [sort, setSort] = useState("default");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        if (!cancelled && res.ok) setCategories(data.data || []);
      } catch {
        /* keep empty; chips fall back below */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  const categoryButtons = useMemo(() => {
    const slugs = categories.map((c) => c.slug);
    return ["all", ...(slugs.length ? slugs : ["chairs", "tables", "clocks", "lamps", "other"])];
  }, [categories]);

  const activeCategory = query ? "all" : categoryName.toLowerCase();

  const displayedProducts = useMemo(() => {
    let products = [...allProducts];

    if (query) {
      const q = query.toLowerCase();
      products = products.filter((p) => {
        const slug = getCategorySlug(p.category);
        return (
          p.title?.toLowerCase().includes(q) ||
          slug.toLowerCase().includes(q) ||
          (typeof p.category === "object" &&
            p.category?.name?.toLowerCase().includes(q))
        );
      });
    } else if (activeCategory !== "all") {
      products = products.filter(
        (p) => getCategorySlug(p.category) === activeCategory
      );
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
      case "name-desc":
        products.sort((a, b) => b.title.localeCompare(a.title));
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
      <h3 className="mb-6 mt-8 text-center text-3xl font-semibold">{heading}</h3>

      <div className="mb-8 flex flex-col gap-4 font-Heebo">
        <nav
          aria-label="Product categories"
          className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {categoryButtons.map((button) => {
            const active = activeCategory === button;
            const label =
              button === "all"
                ? "All"
                : categories.find((c) => c.slug === button)?.name ||
                  capitalize(button);
            return (
              <Link
                to={`/categories/${button}`}
                key={button}
                aria-current={active ? "page" : undefined}
                className={getCategoryChipClass(active)}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
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
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-lightBlack"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {displayedProducts.length === 0 ? (
        <p className="py-16 text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-4 xl:gap-8">
          {displayedProducts.map((product) => (
            <ProductSmallItem
              key={product._id ?? product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
