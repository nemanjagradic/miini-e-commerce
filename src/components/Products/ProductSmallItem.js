import { Link } from "react-router-dom";

const ProductSmallItem = ({ product }) => {
  return (
    <div className="mb-5 border border-solid transition duration-400 hover:shadow-big border-black/20 hover:border-black/40">
      <Link to={`/products/${product.id}`}>
        <div className="w-56 h-56 md:w-[270px] md:h-[250px]">
          <img className="w-full h-full" src={`/${product.imgs[0]}`} alt="" />
        </div>
        <h3 className="font-Heebo text-2xl m-2.5">{product.title}</h3>
        <p className="text-xl font-bold m-2.5">${product.price}</p>
      </Link>
    </div>
  );
};

export default ProductSmallItem;
