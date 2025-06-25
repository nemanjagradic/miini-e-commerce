const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product must have a title."],
      trim: true,
    },
    imgs: {
      type: [String],
      required: [true, "Product must have a images."],
    },
    price: {
      type: Number,
      required: [true, "Product must have a price."],
    },
    description: {
      type: String,
      required: [true, "Product must have a description."],
    },
    category: {
      type: String,
      required: [true, "Product must have a category."],
      enum: ["chairs", "tables", "clocks", "lamps", "other"],
    },
    dimensions: String,
    weight: String,
    size: {
      type: String,
      enum: ["S", "M"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
