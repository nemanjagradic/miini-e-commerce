const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Can't find product with that ID.", 404));
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});
