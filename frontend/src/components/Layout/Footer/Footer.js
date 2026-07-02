import { Link } from "react-router-dom";

const SHOP_LINKS = [
  { label: "All Products", to: "/categories/all" },
  { label: "Chairs", to: "/categories/chairs" },
  { label: "Lamps", to: "/categories/lamps" },
  { label: "Tables", to: "/categories/tables" },
];

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-borderColor bg-white py-10 font-Heebo">
      <div className="my-container flex flex-col items-center gap-4 text-center">
        <nav aria-label="Shop categories">
          <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm">
            {SHOP_LINKS.map(({ label, to }, index) => (
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
