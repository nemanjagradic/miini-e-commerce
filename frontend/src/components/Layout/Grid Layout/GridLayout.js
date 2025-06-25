import useIntersectionNav from "../../../hooks/useIntersectionNav";
import { useEffect, useRef, useState } from "react";
/* eslint-disable no-unused-vars */

const GridLayout = () => {
  const [runAgain, setRunAgain] = useState(false);
  useEffect(() => {
    // da bi se rerenderovao page zbog nav elementa i izvrsavanja useIntersectionNav
    setRunAgain(true);
  }, []);
  const gridContainer = useRef();
  useIntersectionNav({ root: null, threshold: 0 }, gridContainer.current);

  return (
    <div className="my-container">
      <div
        className="mt-12 grid grid-cols-4 grid-rows-200 gap-2"
        ref={gridContainer}
      >
        <div className="col-span-2 row-span-2">
          <div className="relative h-full w-full">
            <img
              className="h-full w-full object-cover"
              src="./images/bed.png"
              alt=""
            />
            <div className="absolute left-0 top-0 block h-full w-full opacity-10 transition hover:bg-black"></div>
            <p className="absolute left-5 top-5 text-2xl">Bedroom</p>
          </div>
        </div>
        <div className="col-span-2">
          <div className="relative h-full w-full">
            <img
              className="h-full w-full object-cover"
              src="./images/light.png"
              alt=""
            />
            <div className="absolute left-0 top-0 block h-full w-full opacity-10 transition hover:bg-black"></div>
            <p className="absolute bottom-5 left-5 text-2xl">Lighting</p>
          </div>
        </div>
        <div className="col-span-2">
          <div className="relative h-full w-full">
            <img
              className="h-full w-full object-cover"
              src="./images/kitchen.png"
              alt=""
            />
            <div className="absolute left-0 top-0 block h-full w-full opacity-10 transition hover:bg-black"></div>
            <p className="absolute bottom-5 left-5 text-2xl">Kitchen</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridLayout;
