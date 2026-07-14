const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Image must have a url."],
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product must have a title."],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product must have a slug."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    imgs: {
      type: [productImageSchema],
      required: [true, "Product must have images."],
      validate: {
        validator(imgs) {
          return Array.isArray(imgs) && imgs.length > 0 && imgs.length <= 5;
        },
        message: "Product must have between 1 and 5 images.",
      },
    },
    price: {
      type: Number,
      required: [true, "Product must have a price."],
    },
    stockQuantity: {
      type: Number,
      required: [true, "Product must have stock quantity."],
      min: [0, "Stock quantity cannot be negative."],
    },
    description: {
      type: String,
      required: [true, "Product must have a description."],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must have a category."],
    },
    dimensions: String,
    weight: String,
    size: {
      type: String,
      enum: ["S", "M"],
    },
    featuredPlacement: {
      type: String,
      enum: {
        values: ["bestSeller", "trending", "both", null],
        message:
          "Featured placement must be Best seller, Trending, Both, or empty.",
      },
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    lowStockNotifiedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.pre("validate", function (next) {
  if (this.imgs?.length) {
    const primaryCount = this.imgs.filter((img) => img.isPrimary).length;
    if (primaryCount === 0) {
      this.imgs[0].isPrimary = true;
    } else if (primaryCount > 1) {
      let seen = false;
      this.imgs.forEach((img) => {
        if (img.isPrimary && seen) img.isPrimary = false;
        else if (img.isPrimary) seen = true;
      });
    }
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
