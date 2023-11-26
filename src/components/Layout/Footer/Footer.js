import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="pt-24 pb-5 mt-24 bg-lightBlack text-white font-Heebo text-center">
      <h3 className="text-3xl font-bold tracking-wide mb-5">Newsletter</h3>
      <input
        className="h-8 w-52 border-none text-black pl-3 outline-none"
        type="email"
        placeholder="your@email.com"
      />
      <button className="h-8 border-none px-2 font-bold bg-slate-300 text-black">
        Subscribe
      </button>
      <ul className="mt-24 mb-5">
        <li className="inline-block mx-3">
          <Link to="/">About</Link>
        </li>
        <li className="inline-block mx-3">
          <Link to="/">Store Locator</Link>
        </li>
        <li className="inline-block mx-3">
          <Link to="/">FAQs</Link>
        </li>
        <li className="inline-block mx-3">
          <Link to="/">News</Link>
        </li>
        <li className="inline-block mx-3">
          <Link to="/">Carrers</Link>
        </li>
        <li className="inline-block mx-3">
          <Link to="/">Contact Us</Link>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
