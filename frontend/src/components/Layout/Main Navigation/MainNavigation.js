import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faBars,
  faXmark,
  faRightFromBracket,
  faUser,
  faBoxArchive,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal from "../../../UI/Modal";
import useScrollNav from "../../../hooks/useIntersectionNav";
import { useLogout } from "../../../hooks/useLogout";

const MainNavigation = () => {
  const [showNav, setShowNav] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const [modal, setModal] = useState(false);
  useScrollNav(0.3);

  const showNavHandler = () => {
    setShowNav((prevState) => !prevState);
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
        <div>
          <Link to="/home">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-auto max-w-full"
            />
          </Link>
        </div>
        <ul className="hidden flex-1 justify-center gap-6 text-lg font-extrabold uppercase text-darker md:flex">
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
        <div className="flex items-center justify-end gap-3">
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
                      src={`http://localhost:8000/images/users/${user.photo}`}
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
