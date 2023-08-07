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
import { cartActions } from "../../../store/cart-slice";
import "./MainNavigation.css";

const MainNavigation = () => {
  const [showNav, setShowNav] = useState(false);
  const showNavHandler = () => {
    setShowNav((prevState) => !prevState);
  };
  const dispatch = useDispatch();
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const changedQuantity = useSelector((state) => state.cart.changedQuantity);
  const showModal = () => {
    dispatch(uiActions.showModal());
  };
  let totalQuantityClasses;
  if (!changedQuantity) {
    totalQuantityClasses = "shopping-items";
  }
  if (changedQuantity) {
    totalQuantityClasses = "shopping-items bump";
  }
  if (totalQuantity === 0) {
    totalQuantityClasses = "shopping-items hidden";
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(cartActions.setChangedQuantity());
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [totalQuantity, dispatch]);

  return (
    <div className="nav">
      <div className="logo-side">
        <Link to="/">
          <div className="logo">
            <img src="/images/logo.png" alt="" />
          </div>
        </Link>
        <div className="menu" onClick={showNavHandler}>
          {!showNav && <FontAwesomeIcon icon={faBars} />}
          {showNav && <FontAwesomeIcon icon={faXmark} />}
        </div>
      </div>
      <div className={`nav-side ${showNav ? "show-nav" : ""}`}>
        <ul className="nav-list">
          <li>
            <Link to="">Home</Link>
          </li>
          <li>
            <Link to="categories/all">Categories</Link>
          </li>
          <li>
            <Link to="product-page">Product Page</Link>
          </li>
          <li className="shopping-cart-icon" onClick={showModal}>
            <div className={totalQuantityClasses}>{totalQuantity}</div>
            <FontAwesomeIcon icon={faCartShopping} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MainNavigation;
