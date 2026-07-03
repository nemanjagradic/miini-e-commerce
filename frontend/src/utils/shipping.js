export const FREE_SHIPPING_THRESHOLD = 100;
export const STANDARD_SHIPPING = 15;

export const TRUST_LINE =
  "Free delivery on orders over $100 · 30-day returns · Delivery calculated at checkout";

export const getShippingCost = (subtotal) =>
  subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;

export const getAmountUntilFreeShipping = (subtotal) =>
  Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

export const getOrderTotal = (subtotal) => subtotal + getShippingCost(subtotal);
