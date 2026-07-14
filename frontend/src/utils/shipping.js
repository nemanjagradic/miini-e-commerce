export const DEFAULT_FREE_SHIPPING_THRESHOLD = 100;
export const FREE_SHIPPING_THRESHOLD = DEFAULT_FREE_SHIPPING_THRESHOLD;
export const STANDARD_SHIPPING = 15;

export const getTrustLine = (
  threshold = DEFAULT_FREE_SHIPPING_THRESHOLD
) =>
  `Free delivery on orders over $${threshold} · 30-day returns · Delivery calculated at checkout`;

/** @deprecated Prefer getTrustLine(threshold) with the live settings value */
export const TRUST_LINE = getTrustLine(DEFAULT_FREE_SHIPPING_THRESHOLD);

export const getShippingCost = (
  subtotal,
  threshold = DEFAULT_FREE_SHIPPING_THRESHOLD
) => (subtotal >= threshold ? 0 : STANDARD_SHIPPING);

export const getAmountUntilFreeShipping = (
  subtotal,
  threshold = DEFAULT_FREE_SHIPPING_THRESHOLD
) => Math.max(0, threshold - subtotal);

export const getOrderTotal = (
  subtotal,
  threshold = DEFAULT_FREE_SHIPPING_THRESHOLD
) => subtotal + getShippingCost(subtotal, threshold);
