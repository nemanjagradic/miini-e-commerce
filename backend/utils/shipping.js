const FREE_SHIPPING_THRESHOLD = 100;
const STANDARD_SHIPPING = 15;

const getShippingCost = (subtotal) =>
  subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;

const getAmountUntilFreeShipping = (subtotal) =>
  Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

module.exports = {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING,
  getShippingCost,
  getAmountUntilFreeShipping,
};
