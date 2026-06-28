const GridLayout = () => {
  return (
    <div className="my-container">
      <div className="mt-12 grid grid-cols-1 gap-2 md:grid-cols-4 md:grid-rows-200">
        <div className="md:col-span-2 md:row-span-2">
          <div className="relative h-72 w-full md:h-full">
            <img
              className="h-full w-full object-cover"
              src="./images/bed.png"
              alt=""
            />
            <div className="absolute left-0 top-0 block h-full w-full transition hover:bg-black/10"></div>
            <p className="absolute left-5 top-5 text-2xl">Bedroom</p>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="relative h-64 w-full md:h-full">
            <img
              className="h-full w-full object-cover"
              src="./images/light.png"
              alt=""
            />
            <div className="absolute left-0 top-0 block h-full w-full transition hover:bg-black/10"></div>
            <p className="absolute bottom-5 left-5 text-2xl">Lighting</p>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="relative h-64 w-full md:h-full">
            <img
              className="h-full w-full object-cover"
              src="./images/kitchen.png"
              alt=""
            />
            <div className="absolute left-0 top-0 block h-full w-full transition hover:bg-black/10"></div>
            <p className="absolute bottom-5 left-5 text-2xl">Kitchen</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridLayout;
