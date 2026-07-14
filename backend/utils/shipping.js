const {
  getOrCreateSettings,
  DEFAULT_FREE_SHIPPING_THRESHOLD,
} = require("../models/settingsModel");

const STANDARD_SHIPPING = 15;

const getFreeShippingThreshold = async () => {
  const settings = await getOrCreateSettings();
  return settings.freeShippingThreshold ?? DEFAULT_FREE_SHIPPING_THRESHOLD;
};

const getShippingCost = async (subtotal) => {
  const threshold = await getFreeShippingThreshold();
  return subtotal >= threshold ? 0 : STANDARD_SHIPPING;
};

const getAmountUntilFreeShipping = async (subtotal) => {
  const threshold = await getFreeShippingThreshold();
  return Math.max(0, threshold - subtotal);
};

module.exports = {
  STANDARD_SHIPPING,
  DEFAULT_FREE_SHIPPING_THRESHOLD,
  getFreeShippingThreshold,
  getShippingCost,
  getAmountUntilFreeShipping,
};
