import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state) => state.user.currentUser);
  const API_URL = process.env.REACT_APP_API_URL;
  const ASSET_URL = API_URL.replace("/api", "");

  if (!user) return;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-20 font-Heebo min-[1020px]:w-5/6 min-[1020px]:px-0 xl:w-4/6">
      <div className="mb-10 space-y-4 rounded-lg border-t-4 border-t-lightBlack py-3 text-center shadow-md min-[310px]:p-3 min-[700px]:p-6">
        <div className="m-auto h-28 w-28">
          <img
            className="h-full w-full rounded-full"
            src={`${ASSET_URL}/images/users/${user.photo}`}
            alt="profile"
          />
        </div>
        <h3 className="text-xl font-semibold">{user.name}</h3>
        <h5 className="break-words px-2 text-sm min-[700px]:text-base">
          {user.email}
        </h5>
      </div>

      <div className="flex flex-col gap-x-10 gap-y-10 min-[700px]:flex-row min-[700px]:gap-y-0">
        <ul>
          <li>
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                `block px-8 py-3 text-sm uppercase shadow-md ${isActive ? "bg-lightBlack text-white" : "text-darker"}`
              }
            >
              Profile Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="orders"
              className={({ isActive }) =>
                `block px-8 py-3 text-sm uppercase shadow-md ${isActive ? "bg-lightBlack text-white" : "text-darker"}`
              }
            >
              Order History
            </NavLink>
          </li>
          <li>
            <NavLink
              to="favorites"
              className={({ isActive }) =>
                `block px-8 py-3 text-sm uppercase shadow-md ${isActive ? "bg-lightBlack text-white" : "text-darker"}`
              }
            >
              Favorites
            </NavLink>
          </li>
        </ul>
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
