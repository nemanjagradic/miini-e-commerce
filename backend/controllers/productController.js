const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const filter = {};

  if (req.query.category) filter.category = req.query.category;

  const products = await Product.find(filter);

  res.status(200).json({
    status: "success",
    results: products.length,
    data: products,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const { slugOrId } = req.params;
  let product;

  if (OBJECT_ID_RE.test(slugOrId)) {
    product = await Product.findById(slugOrId);
  }

  if (!product) {
    product = await Product.findOne({ slug: slugOrId });
  }

  if (!product) {
    return next(new AppError("Can't find product with that slug.", 404));
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});
