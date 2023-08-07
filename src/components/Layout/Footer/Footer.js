import classes from "./Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className={classes.footer}>
      <h3>Newsletter</h3>
      <input type="email" placeholder="your@email.com" />
      <button>Subscribe</button>
      <ul className={classes["footer-pages"]}>
        <li>
          <Link to="/">About</Link>
        </li>
        <li>
          <Link to="/">Store Locator</Link>
        </li>
        <li>
          <Link to="/">FAQs</Link>
        </li>
        <li>
          <Link to="/">News</Link>
        </li>
        <li>
          <Link to="/">Carrers</Link>
        </li>
        <li>
          <Link to="/">Contact Us</Link>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
