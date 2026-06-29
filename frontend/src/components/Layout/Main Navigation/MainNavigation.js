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
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal from "../../../UI/Modal";
import UserAvatar from "../../../UI/UserAvatar";
import useScrollNav from "../../../hooks/useIntersectionNav";
import { useLogout } from "../../../hooks/useLogout";

const MainNavigation = () => {
  const [showNav, setShowNav] = useState(false);
  const [showTabletSearch, setShowTabletSearch] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  useScrollNav(0.3);
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

  let totalQuantityClasses;

  if (!highlighted) {
    totalQuantityClasses = "shopping-items";
  }
  if (highlighted) {
    totalQuantityClasses = "shopping-items bump";
  }
  if (totalQuantity === 0) {
    totalQuantityClasses = "shopping-items hidden";
  }

  useEffect(() => {
    setHighlighted(true);

    const timer = setTimeout(() => {
      setHighlighted(false);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [totalQuantity, dispatch]);

  const searchFormClassName =
    "h-9 rounded-l-md border border-gray-300 px-3 text-sm outline-none focus:border-lightBlack";

  const navLinkClassName =
    "transition-colors hover:text-lightBlack";

  return (
    <div className="navigation z-[3] w-full bg-white py-6 font-Heebo shadow-small">
      <div className="my-container flex items-center gap-3 lg:gap-6">
        <div className="flex shrink-0 items-center gap-4 md:gap-6 lg:gap-8">
          <Link to="/" className="shrink-0">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-auto max-w-[120px] md:max-w-[140px]"
            />
          </Link>

          <ul className="hidden items-center gap-4 text-base font-extrabold uppercase text-darker md:flex lg:gap-6 lg:text-lg">
            <li>
              <Link to="/" className={navLinkClassName}>
                Home
              </Link>
            </li>
            <li>
              <Link to="categories/all" className={navLinkClassName}>
                Categories
              </Link>
            </li>
            <li>
              <Link to="product-page" className={navLinkClassName}>
                Product Page
              </Link>
            </li>
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
              className="h-9 shrink-0 rounded-r-md border border-l-0 border-gray-300 bg-lightBlack px-3 text-white transition hover:bg-black"
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
            className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center text-xl"
            onClick={showModal}
          >
            <div className={totalQuantityClasses}>{totalQuantity}</div>
            <FontAwesomeIcon icon={faCartShopping} />
          </div>

          {user ? (
            <div className="group relative shrink-0 cursor-pointer">
              <div className="h-9 w-9">
                <Link to="profile">
                  <UserAvatar
                    photo={user.photo}
                    assetUrl={ASSET_URL}
                    className="h-full w-full"
                  />
                </Link>
              </div>
              <ul className="pointer-events-none absolute right-0 top-full z-10 w-48 -translate-y-4 transform space-y-2 rounded-md bg-white px-4 py-3 opacity-0 shadow-md transition-all ease-in-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <li className="flex items-center gap-2 rounded px-2 py-1 transition hover:bg-gray-100 hover:text-blue-500">
                  <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                  <Link to="/profile">Profile Settings</Link>
                </li>
                <li className="flex items-center gap-2 rounded px-2 py-1 transition hover:bg-gray-100 hover:text-blue-500">
                  <FontAwesomeIcon
                    icon={faBoxArchive}
                    className="text-yellow-500"
                  />
                  <Link to="/profile/orders">Order History</Link>
                </li>
                <li className="flex items-center gap-2 rounded px-2 py-1 transition hover:bg-gray-100 hover:text-blue-500">
                  <FontAwesomeIcon icon={faHeart} className="text-pink-500" />
                  <Link to="/profile/favorites">My Favorites</Link>
                </li>
                <li
                  onClick={() => setModal(true)}
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition hover:bg-gray-100 hover:text-red-700"
                >
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="text-red-500"
                  />
                  Logout
                </li>
              </ul>
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
                to="/auth"
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
            className="h-9 shrink-0 rounded-r-md border border-l-0 border-gray-300 bg-lightBlack px-4 text-white transition hover:bg-black"
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
              className="h-9 rounded-r-md border border-l-0 border-gray-300 bg-lightBlack px-3 text-white"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>
          <ul className="flex flex-col gap-2 px-5 py-3">
            <li>
              <Link to="/" onClick={() => setShowNav(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="categories/all" onClick={() => setShowNav(false)}>
                Categories
              </Link>
            </li>
            <li>
              <Link to="product-page" onClick={() => setShowNav(false)}>
                Product Page
              </Link>
            </li>
            {!user && (
              <>
                <li>
                  <Link to="/auth" onClick={() => setShowNav(false)}>
                    Log in
                  </Link>
                </li>
                <li>
                  <Link to="/auth" onClick={() => setShowNav(false)}>
                    Sign up
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
