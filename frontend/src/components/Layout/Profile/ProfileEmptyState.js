import { Link } from "react-router-dom";

const ProfileEmptyState = ({ title, description, ctaLabel, ctaTo }) => (
  <div className="flex flex-col items-center py-16 text-center sm:py-20">
    <div className="mx-auto h-24 w-24">
      <img className="h-full w-full" src="/images/empty.png" alt="" />
    </div>
    <h5 className="mb-2 mt-6 text-xl font-semibold">{title}</h5>
    <p className="mb-6 text-gray-500">{description}</p>
    <Link
      to={ctaTo}
      className="rounded-lg border border-black/20 bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-black hover:bg-lightBlack hover:text-white"
    >
      {ctaLabel}
    </Link>
  </div>
);

export default ProfileEmptyState;
