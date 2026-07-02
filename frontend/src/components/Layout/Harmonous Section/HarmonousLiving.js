import { Link } from "react-router-dom";

const PromoContent = ({ title, description, to, ctaLabel }) => (
  <div className="flex flex-col justify-center bg-neutral-50 px-8 py-10 md:px-12 md:py-14 lg:flex-1">
    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-darker/50">
      Collection
    </p>
    <h2 className="text-3xl font-semibold tracking-wide text-lightBlack md:text-4xl">
      {title}
    </h2>
    <p className="mb-6 mt-4 max-w-md font-normal leading-relaxed text-darker/70">
      {description}
    </p>
    <Link
      className="inline-block w-fit rounded-md bg-lightBlack px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-darker"
      to={to}
    >
      {ctaLabel}
    </Link>
  </div>
);

const PromoImage = ({ src, alt, objectPosition = "center" }) => (
  <div className="group overflow-hidden lg:flex-1">
    <div className="h-64 w-full lg:h-full lg:min-h-[400px]">
      <img
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        style={{ objectPosition }}
        src={src}
        alt={alt}
      />
    </div>
  </div>
);

const HarmonousLiving = ({ order }) => {
  if (order === 1) {
    return (
      <div className="my-container mt-16 font-Heebo md:mt-20">
        <div className="flex flex-col overflow-hidden rounded-xl border border-black/10 lg:flex-row">
          <PromoContent
            title="Seating for every space"
            description="From dining to lounge — explore chairs designed for comfort, craft, and everyday living."
            to="/categories/chairs"
            ctaLabel="Shop Chairs"
          />
          <PromoImage
            src="/images/harmonious-chairs.png"
            alt="Chairs collection preview"
            objectPosition="center 40%"
          />
        </div>
      </div>
    );
  }

  if (order === 2) {
    return (
      <div className="my-container mt-16 font-Heebo md:mt-20">
        <div className="flex flex-col overflow-hidden rounded-xl border border-black/10 lg:flex-row">
          <PromoImage
            src="/images/harmonious-lamps.jpg"
            alt="Lamps collection preview"
            objectPosition="center 35%"
          />
          <PromoContent
            title="Light with intention"
            description="Pendants and lamps that set the mood — sculptural pieces for modern, harmonious homes."
            to="/categories/lamps"
            ctaLabel="Shop Lamps"
          />
        </div>
      </div>
    );
  }

  return null;
};

export default HarmonousLiving;
