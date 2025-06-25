import { Link } from "react-router-dom";

const HarmonousLiving = ({ order }) => {
  let content;
  if (order === 1) {
    content = (
      <div className="my-container mt-24 font-Heebo">
        <div className="flex flex-wrap justify-center lg:justify-start">
          <div className="basis-3/4 border border-solid border-black/20 bg-gradient-to-t from-light  py-5 font-bold hover:bg-gradient-to-t hover:from-light hover:from-50% lg:flex-1">
            <div className="px-12 pt-4">
              <h2 className="text-3xl tracking-wide">
                Make your living creative and harmonous
              </h2>
              <p className="mb-3 mt-4">
                Our products are made in all sizes so that you can choose
                according to your wish.
              </p>
              <Link
                className="inline-block border border-black bg-lightBlack px-5 py-2.5 uppercase text-white transition hover:bg-transparent hover:text-black"
                to="/categories/all"
              >
                Shop Now
              </Link>
            </div>
          </div>
          <div className="basis-3/4 lg:flex-1">
            <div className="h-64 w-full lg:h-full">
              <img
                className="h-full w-full"
                src="./images/harmonous-living.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (order === 2) {
    content = (
      <div className="my-container mt-24 font-Heebo transition">
        <div className="flex flex-wrap justify-center lg:justify-start">
          <div className="basis-3/4 lg:flex-1">
            <div className="h-64 w-full lg:h-full">
              <img
                className="h-full w-full"
                src="./images/harmonous-living-2.jpeg"
                alt=""
              />
            </div>
          </div>
          <div className="basis-3/4 border border-solid border-black/20 bg-gradient-to-t from-light  py-5 font-bold hover:bg-gradient-to-t hover:from-light hover:from-50% lg:flex-1">
            <div className="px-12 pt-4">
              <h2 className="text-3xl tracking-wide">
                Make your living creative and harmonous
              </h2>
              <p className="mb-3 mt-4">
                Our products are made in all sizes so that you can choose
                according to your wish.
              </p>
              <Link
                className="inline-block border border-black bg-lightBlack px-5 py-2.5 uppercase text-white transition hover:bg-transparent hover:text-black"
                to="/categories/all"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return content;
};

export default HarmonousLiving;
