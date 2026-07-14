import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faBars,
  faXmark,
  faRightFromBracket,
  faUser,
  faBoxArchive,
  faHeart,
  faMagnifyingGlass,
  faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Modal from "../../../UI/Modal";
import UserAvatar from "../../../UI/UserAvatar";
import useScrollNav from "../../../hooks/useIntersectionNav";
import { useLogout } from "../../../hooks/useLogout";

const NAV_ITEMS = [
  { label: "Home", to: "/", end: true },
  {
    label: "Categories",
    to: "/categories/all",
    isActive: (pathname) => pathname.startsWith("/categories"),
  },
];

const getNavLinkClass = (active) =>
  `relative pb-1 text-base font-extrabold uppercase tracking-wide transition-colors lg:text-lg ${
    active ? "text-lightBlack" : "text-darker/60 hover:text-lightBlack"
  }`;

const getMobileNavLinkClass = (active) =>
  `block rounded-md px-3 py-2 normal-case transition-colors ${
    active ? "bg-light text-lightBlack" : "hover:bg-gray-50"
  }`;

const MainNavigation = () => {
  const [showNav, setShowNav] = useState(false);
  const [showTabletSearch, setShowTabletSearch] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useScrollNav();
  const API_URL = process.env.REACT_APP_API_URL;
  const ASSET_URL = API_URL.replace("/api", "");

  const showNavHandler = () => {
    setShowNav((prevState) => !prevState);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    navigate(q ? `/categories/all?q=${encodeURIComponent(q)}` : "/categories/all");
    setShowNav(false);
    setShowTabletSearch(false);
  };

  const dispatch = useDispatch();
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const user = useSelector((state) => state.user.currentUser);
  const showModal = () => {
    dispatch(uiActions.showModal());
  };
  const logout = useLogout();

  const prevQuantityRef = useRef(null);
  const hasInitializedRef = useRef(false);

  const badgeClasses = [
    "absolute -right-1 -top-1 z-[2] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-lightBlack px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white transition",
    highlighted && "bump",
    totalQuantity === 0 && "hidden",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    const prev = prevQuantityRef.current;
    prevQuantityRef.current = totalQuantity;

    if (prev === null) return;

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }

    if (totalQuantity > prev) {
      setHighlighted(true);
      const timer = setTimeout(() => setHighlighted(false), 350);
      return () => clearTimeout(timer);
    }
  }, [totalQuantity]);

  useEffect(() => {
    setShowNav(false);
  }, [pathname]);

  const searchFormClassName =
    "h-9 rounded-l-full border border-gray-300 px-4 text-sm outline-none focus:border-lightBlack";

  return (
    <div className="navigation z-[3] w-full border-b border-borderColor bg-white py-4 font-Heebo shadow-small">
      <div className="my-container flex items-center gap-3 lg:gap-6">
        <div className="flex shrink-0 items-center gap-4 md:gap-6 lg:gap-8">
          <Link to="/" className="shrink-0 opacity-90 transition-opacity hover:opacity-100">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-auto max-w-[120px] md:max-w-[140px]"
            />
          </Link>

          <ul className="hidden items-center gap-4 md:flex lg:gap-6">
            {NAV_ITEMS.map(({ label, to, end, isActive }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive: rrActive }) =>
                    getNavLinkClass(isActive ? isActive(pathname) : rrActive)
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={submitSearch}
          className="mx-4 hidden min-w-0 flex-1 items-center justify-center lg:flex xl:mx-8"
        >
          <div className="flex w-full max-w-md items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className={`min-w-0 flex-1 ${searchFormClassName}`}
            />
            <button
              type="submit"
              aria-label="Search"
              className="h-9 shrink-0 rounded-r-full border border-l-0 border-gray-300 bg-lightBlack px-3 text-white transition hover:bg-black"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0 lg:gap-3">
          <button
            type="button"
            aria-label={showTabletSearch ? "Close search" : "Open search"}
            aria-expanded={showTabletSearch}
            onClick={() => setShowTabletSearch((prev) => !prev)}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-300 text-lg transition hover:bg-gray-100 md:flex lg:hidden"
          >
            <FontAwesomeIcon icon={showTabletSearch ? faXmark : faMagnifyingGlass} />
          </button>

          <div
            className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-gray-300 text-base transition hover:bg-gray-100"
            onClick={showModal}
            role="button"
            tabIndex={0}
            aria-label="Open shopping cart"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                showModal();
              }
            }}
          >
            <span className={badgeClasses}>{totalQuantity}</span>
            <FontAwesomeIcon icon={faCartShopping} />
          </div>

          {user ? (
            <div className="group relative shrink-0 cursor-pointer">
              <div className="h-9 w-9">
                <Link to="/profile">
                  <UserAvatar
                    photo={user.photo}
                    assetUrl={ASSET_URL}
                    className="h-full w-full"
                  />
                </Link>
              </div>
              <div className="pointer-events-none absolute right-0 top-full z-10 w-64 -translate-y-4 transform rounded-xl border border-gray-200 bg-white py-2 opacity-0 shadow-lg transition-all ease-in-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <div className="flex items-center gap-3 border-b border-gray-100 px-4 pb-3 pt-1">
                  <UserAvatar
                    photo={user.photo}
                    assetUrl={ASSET_URL}
                    className="h-10 w-10 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-lightBlack">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <ul className="space-y-0.5 px-2 pt-2 font-Heebo text-sm">
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-lightBlack/80 transition hover:bg-gray-50 hover:text-lightBlack"
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="w-4 text-center text-gray-500"
                      />
                      Profile Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile/orders"
                      className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-lightBlack/80 transition hover:bg-gray-50 hover:text-lightBlack"
                    >
                      <FontAwesomeIcon
                        icon={faBoxArchive}
                        className="w-4 text-center text-gray-500"
                      />
                      Order History
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile/favorites"
                      className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-lightBlack/80 transition hover:bg-gray-50 hover:text-lightBlack"
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="w-4 text-center text-gray-500"
                      />
                      My Favorites
                    </Link>
                  </li>
                  {user.role === "admin" && (
                    <>
                      <li
                        className="my-1.5 border-t border-gray-100"
                        aria-hidden="true"
                      />
                      <li>
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-lightBlack/80 transition hover:bg-gray-50 hover:text-lightBlack"
                        >
                          <FontAwesomeIcon
                            icon={faGaugeHigh}
                            className="w-4 text-center text-emerald-700/80"
                          />
                          Admin dashboard
                        </Link>
                      </li>
                    </>
                  )}
                  <li
                    className="my-1.5 border-t border-gray-100"
                    aria-hidden="true"
                  />
                  <li>
                    <button
                      type="button"
                      onClick={() => setModal(true)}
                      className="flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-left text-red-600/90 transition hover:bg-red-50 hover:text-red-700"
                    >
                      <FontAwesomeIcon
                        icon={faRightFromBracket}
                        className="w-4 text-center"
                      />
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="hidden shrink-0 items-center gap-2 md:flex lg:gap-3">
              <Link
                to="/auth"
                className="whitespace-nowrap rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold transition hover:bg-gray-100 lg:px-4"
              >
                Log in
              </Link>
              <Link
                to="/auth?mode=signup"
                className="whitespace-nowrap rounded-lg bg-lightBlack px-3 py-2 text-sm font-semibold text-white transition hover:bg-black lg:px-4"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            aria-label={showNav ? "Close menu" : "Open menu"}
            className="shrink-0 cursor-pointer text-2xl md:hidden"
            onClick={showNavHandler}
          >
            <FontAwesomeIcon icon={showNav ? faXmark : faBars} />
          </button>
        </div>
      </div>

      {showTabletSearch && (
        <form
          onSubmit={submitSearch}
          className="my-container mt-4 hidden md:flex lg:hidden"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className={`flex-1 ${searchFormClassName}`}
            autoFocus
          />
          <button
            type="submit"
            aria-label="Search"
            className="h-9 shrink-0 rounded-r-full border border-l-0 border-gray-300 bg-lightBlack px-4 text-white transition hover:bg-black"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
      )}

      {showNav && (
        <div className="bg-white text-lg font-extrabold uppercase text-darker md:hidden">
          <form onSubmit={submitSearch} className="flex px-5 pt-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className={`flex-1 normal-case ${searchFormClassName}`}
            />
            <button
              type="submit"
              aria-label="Search"
              className="h-9 rounded-r-full border border-l-0 border-gray-300 bg-lightBlack px-3 text-white"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>
          <ul className="flex flex-col gap-1 px-5 py-3">
            {NAV_ITEMS.map(({ label, to, end, isActive }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => setShowNav(false)}
                  className={({ isActive: rrActive }) =>
                    getMobileNavLinkClass(
                      isActive ? isActive(pathname) : rrActive,
                    )
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            {!user && (
              <>
                <li className="my-2 border-t border-borderColor" aria-hidden="true" />
                <li>
                  <Link
                    to="/auth"
                    onClick={() => setShowNav(false)}
                    className="block rounded-md px-3 py-2 normal-case transition-colors hover:bg-gray-50"
                  >
                    Log in
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auth?mode=signup"
                    onClick={() => setShowNav(false)}
                    className="block rounded-md px-3 py-2 normal-case transition-colors hover:bg-gray-50"
                  >
                    Sign up
                  </Link>
                </li>
              </>
            )}
            {user?.role === "admin" && (
              <>
                <li className="my-2 border-t border-borderColor" aria-hidden="true" />
                <li>
                  <Link
                    to="/admin"
                    onClick={() => setShowNav(false)}
                    className="block rounded-md px-3 py-2 normal-case transition-colors hover:bg-gray-50"
                  >
                    Admin dashboard
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {modal && (
        <Modal
          message="Are you sure you want to log out?"
          cancelMessage="No"
          confirmMessage="Log out"
          handleCancel={() => setModal(false)}
          handleConfirm={() => logout(setModal)}
        />
      )}
    </div>
  );
};

export default MainNavigation;
