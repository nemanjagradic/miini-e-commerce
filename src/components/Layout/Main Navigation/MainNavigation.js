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
    <div className="navigation relative z-[2] block w-full px-9 py-5 uppercase shadow-small md:flex md:h-20 md:items-center md:justify-between md:py-3 lg:px-[9%] xl:px-[10.5%]">
      <div className="flex">
        <div className="flex-1">
          <Link to="/">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-auto max-w-full"
            />
          </Link>
        </div>
        <div
          className="relative mx-3 cursor-pointer text-xl md:hidden"
          onClick={showModal}
        >
          <div className={totalQuantityClasses}>{totalQuantity}</div>
          <FontAwesomeIcon icon={faCartShopping} />
        </div>
        <div
          className="cursor-pointer text-xl md:hidden"
          onClick={showNavHandler}
        >
          <FontAwesomeIcon icon={showNav ? faXmark : faBars} />
        </div>
      </div>
      <div className={`${!showNav ? "hidden" : "block"} md:block`}>
        <ul className="mb-0 w-full list-none bg-white pl-0 font-Heebo">
          <li className="my-3 mb-1 cursor-pointer md:mx-3 md:my-0 md:inline-block">
            <Link className="font-extrabold text-darker" to="/">
              Home
            </Link>
          </li>
          <li className="my-1 cursor-pointer md:mx-3 md:my-0 md:inline-block">
            <Link className="font-extrabold text-darker" to="categories/all">
              Categories
            </Link>
          </li>
          <li className="my-1 cursor-pointer md:mx-3 md:my-0 md:inline-block">
            <Link className="font-extrabold text-darker" to="product-page">
              Product Page
            </Link>
          </li>
          <li
            className="relative mx-3 cursor-pointer text-xl md:inline-block"
            onClick={showModal}
          >
            <div className={totalQuantityClasses}>{totalQuantity}</div>
            <FontAwesomeIcon icon={faCartShopping} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MainNavigation;
