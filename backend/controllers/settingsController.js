const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const logAdminAction = require("../utils/logAdminAction");
const {
  getOrCreateSettings,
  DEFAULT_LOW_STOCK_THRESHOLD,
  DEFAULT_FREE_SHIPPING_THRESHOLD,
} = require("../models/settingsModel");
const { STANDARD_SHIPPING } = require("../utils/shipping");

exports.getPublicSettings = catchAsync(async (req, res) => {
  const settings = await getOrCreateSettings();

  res.status(200).json({
    status: "success",
    data: {
      freeShippingThreshold:
        settings.freeShippingThreshold ?? DEFAULT_FREE_SHIPPING_THRESHOLD,
      standardShipping: STANDARD_SHIPPING,
    },
  });
});

exports.getSettings = catchAsync(async (req, res) => {
  const settings = await getOrCreateSettings();

  res.status(200).json({
    status: "success",
    data: {
      lowStockThreshold:
        settings.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD,
      freeShippingThreshold:
        settings.freeShippingThreshold ?? DEFAULT_FREE_SHIPPING_THRESHOLD,
      standardShipping: STANDARD_SHIPPING,
    },
  });
});

exports.updateSettings = catchAsync(async (req, res, next) => {
  const { lowStockThreshold, freeShippingThreshold } = req.body;
  const settings = await getOrCreateSettings();
  const before = {
    lowStockThreshold: settings.lowStockThreshold,
    freeShippingThreshold: settings.freeShippingThreshold,
  };

  if (lowStockThreshold !== undefined) {
    const value = Number(lowStockThreshold);
    if (!Number.isFinite(value) || value < 0) {
      return next(
        new AppError(
          "Low stock threshold must be a number 0 or greater.",
          400
        )
      );
    }
    settings.lowStockThreshold = Math.floor(value);
  }

  if (freeShippingThreshold !== undefined) {
    const value = Number(freeShippingThreshold);
    if (!Number.isFinite(value) || value < 0) {
      return next(
        new AppError(
          "Free shipping threshold must be a number 0 or greater.",
          400
        )
      );
    }
    settings.freeShippingThreshold = Math.floor(value);
  }

  await settings.save();

  await logAdminAction(req, {
    action: "settings.update",
    resourceType: "Settings",
    resourceId: settings._id,
    meta: {
      before,
      after: {
        lowStockThreshold: settings.lowStockThreshold,
        freeShippingThreshold: settings.freeShippingThreshold,
      },
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      lowStockThreshold: settings.lowStockThreshold,
      freeShippingThreshold: settings.freeShippingThreshold,
      standardShipping: STANDARD_SHIPPING,
    },
  });
});
