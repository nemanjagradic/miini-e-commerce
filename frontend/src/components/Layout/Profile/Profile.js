import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import UserAvatar from "../../../UI/UserAvatar";

const profileLinks = [
  { to: "", end: true, label: "Settings" },
  { to: "orders", label: "Orders" },
  { to: "favorites", label: "Favorites" },
];

const getProfileNavClass = (active) =>
  `shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
    active
      ? "bg-lightBlack text-white"
      : "border border-gray-300 text-darker/70 hover:border-lightBlack hover:text-lightBlack"
  }`;

const Profile = () => {
  const user = useSelector((state) => state.user.currentUser);
  const API_URL = process.env.REACT_APP_API_URL;
  const ASSET_URL = API_URL.replace("/api", "");

  if (!user) return;

  return (
    <div className="my-container mb-16 mt-8 font-Heebo">
      <h1 className="mb-6 text-center text-3xl font-semibold">My Account</h1>

      <div className="mb-8 space-y-3 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-lg sm:p-8">
        <div className="m-auto h-28 w-28">
          <UserAvatar
            photo={user.photo}
            assetUrl={ASSET_URL}
            className="h-full w-full"
            iconClassName="text-gray-500 text-3xl"
          />
        </div>
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="break-words px-2 text-sm text-gray-500 sm:text-base">
          {user.email}
        </p>
      </div>

      <nav
        aria-label="Profile sections"
        className="mb-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {profileLinks.map(({ to, end, label }) => (
          <NavLink
            key={to || "settings"}
            to={to}
            end={end}
            className={({ isActive }) => getProfileNavClass(isActive)}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
};

export default Profile;
