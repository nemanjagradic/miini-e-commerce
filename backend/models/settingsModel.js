const mongoose = require("mongoose");

const DEFAULT_LOW_STOCK_THRESHOLD = 5;
const DEFAULT_FREE_SHIPPING_THRESHOLD = 100;

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "global",
      unique: true,
    },
    lowStockThreshold: {
      type: Number,
      default: DEFAULT_LOW_STOCK_THRESHOLD,
      min: [0, "Low stock threshold cannot be negative."],
    },
    freeShippingThreshold: {
      type: Number,
      default: DEFAULT_FREE_SHIPPING_THRESHOLD,
      min: [0, "Free shipping threshold cannot be negative."],
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne({ key: "global" });
  if (!settings) {
    settings = await Settings.create({ key: "global" });
  }
  return settings;
};

module.exports = Settings;
module.exports.getOrCreateSettings = getOrCreateSettings;
module.exports.DEFAULT_LOW_STOCK_THRESHOLD = DEFAULT_LOW_STOCK_THRESHOLD;
module.exports.DEFAULT_FREE_SHIPPING_THRESHOLD =
  DEFAULT_FREE_SHIPPING_THRESHOLD;
