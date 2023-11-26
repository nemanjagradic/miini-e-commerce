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
        className="grid grid-cols-4 grid-rows-200 gap-2 mt-12"
        ref={gridContainer}
      >
        <div className="col-span-2 row-span-2">
          <div className="relative w-full h-full">
            <img
              className="w-full h-full object-cover"
              src="./images/bed.png"
              alt=""
            />
            <div className="absolute top-0 left-0 block w-full h-full transition opacity-10 hover:bg-black"></div>
            <p className="text-2xl absolute left-5 top-5">Bedroom</p>
          </div>
        </div>
        <div className="col-span-2">
          <div className="relative w-full h-full">
            <img
              className="w-full h-full object-cover"
              src="./images/light.png"
              alt=""
            />
            <div className="absolute top-0 left-0 block w-full h-full transition opacity-10 hover:bg-black"></div>
            <p className="text-2xl absolute left-5 bottom-5">Lighting</p>
          </div>
        </div>
        <div className="col-span-2">
          <div className="relative w-full h-full">
            <img
              className="w-full h-full object-cover"
              src="./images/kitchen.png"
              alt=""
            />
            <div className="absolute top-0 left-0 block w-full h-full transition opacity-10 hover:bg-black"></div>
            <p className="text-2xl absolute left-5 bottom-5">Kitchen</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridLayout;
