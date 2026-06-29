import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="mt-24 bg-lightBlack pb-5 pt-24 text-center font-Heebo text-white">
      <h3 className="mb-5 text-3xl font-bold tracking-wide">Newsletter</h3>
      {subscribed ? (
        <p className="font-semibold text-green-400">
          Thanks for subscribing!
        </p>
      ) : (
        <form onSubmit={handleSubscribe} className="flex justify-center">
          <input
            className="h-10 w-52 border-none pl-3 text-black outline-none"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
          <button
            type="submit"
            className="h-10 border-none bg-slate-300 px-4 font-bold text-black transition hover:bg-white"
          >
            Subscribe
          </button>
        </form>
      )}
      <ul className="mb-5 mt-24">
        <li className="mx-3 inline-block">
          <Link to="/">About</Link>
        </li>
        <li className="mx-3 inline-block">
          <Link to="/">Store Locator</Link>
        </li>
        <li className="mx-3 inline-block">
          <Link to="/">FAQs</Link>
        </li>
        <li className="mx-3 inline-block">
          <Link to="/">News</Link>
        </li>
        <li className="mx-3 inline-block">
          <Link to="/">Careers</Link>
        </li>
        <li className="mx-3 inline-block">
          <Link to="/">Contact Us</Link>
        </li>
      </ul>
      <p className="text-sm text-white/60">
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
