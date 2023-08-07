import GridLayout from "../components/Layout/Grid Layout/GridLayout";
import HarmonousLiving from "../components/Layout/Harmonous Section/HarmonousLiving";
import TrendingProducts from "../components/Products/TrendingProducts";
import BestProducts from "../components/Products/BestProducts";

const HomePage = () => {
  return (
    <>
      <GridLayout />
      <BestProducts />
      <HarmonousLiving order={1} />
      <TrendingProducts />
      <HarmonousLiving order={2} />
    </>
  );
};

export default HomePage;
