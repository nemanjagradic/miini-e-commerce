import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const MainNavigation = () => {
  const [showNav, setShowNav] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const showNavHandler = () => {
    setShowNav((prevState) => !prevState);
  };
  const dispatch = useDispatch();
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const showModal = () => {
    dispatch(uiActions.showModal());
  };
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
    <div className="navigation relative px-8 py-5 shadow-small w-full block md:flex md:items-center md:justify-between md:h-20 md:px-[17%] z-[2] uppercase md:py-3">
      <div className="flex">
        <div className="flex-1">
          <Link to="/">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="max-w-full h-auto"
            />
          </Link>
        </div>
        <div className="relative md:hidden text-xl mx-3" onClick={showModal}>
          <div className={totalQuantityClasses}>{totalQuantity}</div>
          <FontAwesomeIcon icon={faCartShopping} />
        </div>
        <div className="md:hidden text-xl" onClick={showNavHandler}>
          <FontAwesomeIcon icon={showNav ? faXmark : faBars} />
        </div>
      </div>
      <div className={`${!showNav ? "hidden" : "block"} md:block`}>
        <ul className="w-full mb-0 pl-0 bg-white list-none font-Heebo">
          <li className="my-3 mb-1 cursor-pointer md:mx-3 md:inline-block md:my-0">
            <Link className="text-darker font-extrabold" to="/">
              Home
            </Link>
          </li>
          <li className="my-1 cursor-pointer md:mx-3 md:inline-block md:my-0">
            <Link className="text-darker font-extrabold" to="categories/all">
              Categories
            </Link>
          </li>
          <li className="my-1 cursor-pointer md:mx-3 md:inline-block md:my-0">
            <Link className="text-darker font-extrabold" to="product-page">
              Product Page
            </Link>
          </li>
          {!showNav && (
            <li
              className="relative block text-xl mx-3 md:inline-block cursor-pointer"
              onClick={showModal}
            >
              <div className={totalQuantityClasses}>{totalQuantity}</div>
              <FontAwesomeIcon icon={faCartShopping} />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MainNavigation;
