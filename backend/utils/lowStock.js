const Product = require("../models/productModel");
const User = require("../models/userModel");
const Email = require("./email");
const {
  getOrCreateSettings,
  DEFAULT_LOW_STOCK_THRESHOLD,
} = require("../models/settingsModel");

const getLowStockThreshold = async () => {
  const settings = await getOrCreateSettings();
  return settings.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;
};

const getLowStockRecipients = async () => {
  const admins = await User.find({ role: "admin" })
    .select("+active email name")
    .lean();

  const emails = new Set(
    admins
      .filter((a) => a.active !== false)
      .map((a) => a.email)
      .filter(Boolean)
  );

  if (process.env.ADMIN_EMAIL) {
    emails.add(process.env.ADMIN_EMAIL.trim());
  }

  return [...emails];
};

/**
 * After a stock change: notify once when crossing below threshold;
 * clear the flag when stock returns to threshold or above.
 */
const checkAndNotifyLowStock = async (productId) => {
  const threshold = await getLowStockThreshold();
  const product = await Product.findById(productId).select(
    "+lowStockNotifiedAt title slug stockQuantity"
  );

  if (!product) return;

  const below = product.stockQuantity < threshold;

  if (below && !product.lowStockNotifiedAt) {
    const recipients = await getLowStockRecipients();
    if (recipients.length) {
      try {
        await Email.sendLowStockAlert({
          to: recipients,
          product: {
            title: product.title,
            slug: product.slug,
            stockQuantity: product.stockQuantity,
            id: product._id.toString(),
          },
          threshold,
        });
      } catch (err) {
        console.error("Low-stock email failed:", err.message);
      }
    }

    product.lowStockNotifiedAt = new Date();
    await product.save({ validateBeforeSave: false });
    return;
  }

  if (!below && product.lowStockNotifiedAt) {
    product.lowStockNotifiedAt = null;
    await product.save({ validateBeforeSave: false });
  }
};

module.exports = {
  DEFAULT_LOW_STOCK_THRESHOLD,
  getLowStockThreshold,
  getLowStockRecipients,
  checkAndNotifyLowStock,
};
