const Product = require("../models/productModel");

exports.getAllProducts = async (req, res) => {
  const filter = {};

  if (req.query.category) filter.category = req.query.category;

  const products = await Product.find(filter);

  res.status(200).json({
    status: "success",
    results: products.length,
    data: { products },
  });
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Can't find product with that ID.",
      });
    }

    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong.",
    });
  }
};
