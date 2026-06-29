import { getStockInfo } from "../utils/productStock";

const StockBadge = ({ stockQuantity, className = "" }) => {
  const { label, className: badgeClass } = getStockInfo(stockQuantity);

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass} ${className}`}
    >
      {label}
    </span>
  );
};

export default StockBadge;
