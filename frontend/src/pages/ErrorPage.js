import { Link } from "react-router-dom";
import MainNavigation from "../components/Layout/Main Navigation/MainNavigation";

const ErrorPage = () => {
  return (
    <>
      <MainNavigation />
      <div className="flex h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-6xl font-bold text-lightBlack">404</h1>
        <h3 className="mb-6 text-2xl text-gray-600">
          Oops! The page you’re looking for doesn’t exist.
        </h3>
        <Link
          to="/home"
          className="rounded-2xl bg-lightBlack px-6 py-3 text-white shadow-md transition-all duration-300 hover:bg-black"
        >
          Back to Home
        </Link>
      </div>
    </>
  );
};

export default ErrorPage;
