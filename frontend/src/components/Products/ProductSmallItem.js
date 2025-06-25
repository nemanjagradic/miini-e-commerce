import { Link } from "react-router-dom";

const ProductSmallItem = ({ product }) => {
  return (
    <div className="border border-solid border-black/20 transition duration-400 hover:border-black/40 hover:shadow-[3px_3px_4px_#e3e2e2,6px_6px_10px_#ababab]">
      <Link to={`/products/${product.id}`}>
        <div className="h-[220px] w-[220px] xl:h-[250px] xl:w-[270px]">
          <img className="h-full w-full" src={`/${product.imgs[0]}`} alt="" />
        </div>
        <h3 className="m-2.5 font-Heebo text-xl xl:text-2xl">
          {product.title}
        </h3>
        <p className="m-2.5 text-xl font-bold">${product.price}</p>
      </Link>
    </div>
  );
};

export default ProductSmallItem;
