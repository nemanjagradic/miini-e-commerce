import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [shopLinks, setShopLinks] = useState([
    { label: "All Products", to: "/categories/all" },
  ]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        if (!cancelled && res.ok) {
          const cats = (data.data || []).map((c) => ({
            label: c.name,
            to: `/categories/${c.slug}`,
          }));
          setShopLinks([
            { label: "All Products", to: "/categories/all" },
            ...cats,
          ]);
        }
      } catch {
        setShopLinks([
          { label: "All Products", to: "/categories/all" },
          { label: "Chairs", to: "/categories/chairs" },
          { label: "Lamps", to: "/categories/lamps" },
          { label: "Tables", to: "/categories/tables" },
        ]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  return (
    <footer className="mt-24 border-t border-borderColor bg-white py-10 font-Heebo">
      <div className="my-container flex flex-col items-center gap-4 text-center">
        <nav aria-label="Shop categories">
          <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm">
            {shopLinks.map(({ label, to }, index) => (
              <li key={to} className="inline-flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-darker/30" aria-hidden="true">
                    ·
                  </span>
                )}
                <Link
                  to={to}
                  className="font-medium text-darker/70 transition-colors hover:text-lightBlack"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs text-darker/50">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
