import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="mt-24 bg-lightBlack pb-5 pt-24 text-center font-Heebo text-white">
      <h3 className="mb-5 text-3xl font-bold tracking-wide">Newsletter</h3>
      <input
        className="h-8 w-52 border-none pl-3 text-black outline-none"
        type="email"
        placeholder="your@email.com"
      />
      <button className="h-8 border-none bg-slate-300 px-2 font-bold text-black">
        Subscribe
      </button>
      <ul className="mb-5 mt-24">
        <li className="mx-3 inline-block">
          <Link to="/home">About</Link>
        </li>
        <li className="mx-3 inline-block">
          <Link to="/home">Store Locator</Link>
        </li>
        <li className="mx-3 inline-block">
          <Link to="/home">FAQs</Link>
        </li>
        <li className="mx-3 inline-block">
          <Link to="/home">News</Link>
        </li>
        <li className="mx-3 inline-block">
          <Link to="/home">Carrers</Link>
        </li>
        <li className="mx-3 inline-block">
          <Link to="/home">Contact Us</Link>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
