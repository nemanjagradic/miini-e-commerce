import { Link } from "react-router-dom";

const CategoryTile = ({
  to,
  label,
  src,
  alt,
  className = "",
  objectPosition = "center",
}) => (
  <Link
    to={to}
    className={`group relative block overflow-hidden rounded-xl border border-black/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${className}`}
  >
    <div className="relative h-72 w-full md:h-full md:min-h-[200px]">
      <img
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        style={{ objectPosition }}
        src={src}
        alt={alt}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
      <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
      <div className="absolute bottom-5 left-5 right-5 font-Heebo text-white">
        <p className="text-2xl font-semibold tracking-wide">{label}</p>
        <span className="mt-1 inline-block text-sm font-medium text-white/90 transition group-hover:translate-x-1">
          Shop &rarr;
        </span>
      </div>
    </div>
  </Link>
);

const GridLayout = () => {
  return (
    <div className="my-container mt-8 font-Heebo md:mt-10">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:grid-rows-200">
        <CategoryTile
          to="/categories/chairs"
          label="Chairs"
          src="/images/hero-chairs.png"
          alt="Shop chairs"
          className="md:col-span-2 md:row-span-2"
        />
        <CategoryTile
          to="/categories/lamps"
          label="Lamps"
          src="/images/hero-lamps.jpg"
          alt="Shop lamps"
          className="md:col-span-2"
        />
        <CategoryTile
          to="/categories/tables"
          label="Tables"
          src="/images/hero-tables.jpg"
          alt="Shop tables"
          className="md:col-span-2"
          objectPosition="center 40%"
        />
      </div>
    </div>
  );
};

export default GridLayout;
