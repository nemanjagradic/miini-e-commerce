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
import useScrollNav from "../../../hooks/useIntersectionNav";
import { useLogout } from "../../../hooks/useLogout";

const MainNavigation = () => {
  const [showNav, setShowNav] = useState(false);
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

  return (
    <div className="navigation z-[2] w-full bg-white py-6 font-Heebo shadow-small">
      <div className="my-container flex items-center justify-between">
        <div className="flex-1">
          <Link to="/home">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-auto max-w-full"
            />
          </Link>
        </div>
        <ul className="hidden justify-center gap-6 text-lg font-extrabold uppercase text-darker md:flex">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="categories/all">Categories</Link>
          </li>
          <li>
            <Link to="product-page">Product Page</Link>
          </li>
        </ul>
        <div className="flex flex-1 items-center justify-end gap-3">
          <form onSubmit={submitSearch} className="hidden items-center md:flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="h-9 w-40 rounded-l-md border border-gray-300 px-3 text-sm outline-none focus:border-lightBlack lg:w-56"
            />
            <button
              type="submit"
              aria-label="Search"
              className="h-9 rounded-r-md border border-l-0 border-gray-300 bg-lightBlack px-3 text-white transition hover:bg-black"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>
          {user && (
            <>
              <div
                className="relative cursor-pointer text-2xl"
                onClick={showModal}
              >
                <div className={totalQuantityClasses}>{totalQuantity}</div>
                <FontAwesomeIcon icon={faCartShopping} />
              </div>
              <div className="group relative -mt-2 cursor-pointer">
                <div className="h-9 w-9">
                  <Link to="profile">
                    <img
                      className="h-full w-full rounded-full"
                      src={`${ASSET_URL}/images/users/${user.photo}`}
                      alt="User"
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
            </>
          )}

          <div
            className="cursor-pointer text-2xl md:hidden"
            onClick={showNavHandler}
          >
            <FontAwesomeIcon icon={showNav ? faXmark : faBars} />
          </div>
        </div>
      </div>
      {showNav && (
        <div className="bg-white text-lg font-extrabold uppercase text-darker md:hidden">
          <form onSubmit={submitSearch} className="flex px-5 pt-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="h-9 flex-1 rounded-l-md border border-gray-300 px-3 text-sm normal-case outline-none focus:border-lightBlack"
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
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="categories/all">Categories</Link>
            </li>
            <li>
              <Link to="product-page">Product Page</Link>
            </li>
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
