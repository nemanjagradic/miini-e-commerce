export const LOW_STOCK_THRESHOLD = 5;

export function getStockInfo(stockQuantity) {
  const stock = stockQuantity ?? 0;

  if (stock <= 0) {
    return {
      label: "Out of stock",
      className: "bg-red-100 text-red-700",
    };
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return {
      label: "Low stock",
      className: "bg-amber-100 text-amber-800",
    };
  }

  return {
    label: "In stock",
    className: "bg-green-100 text-green-800",
  };
}

export function sortOutOfStockLast(products) {
  return [...products].sort((a, b) => {
    const aOut = (a.stockQuantity ?? 0) === 0 ? 1 : 0;
    const bOut = (b.stockQuantity ?? 0) === 0 ? 1 : 0;
    return aOut - bOut;
  });
}

export function capQuantity(quantity, stockQuantity) {
  const stock = stockQuantity ?? 0;
  if (stock <= 0) return 0;
  return Math.min(quantity, stock);
}
