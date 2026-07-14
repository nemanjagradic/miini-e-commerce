const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Order = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const slugify = require("../utils/slugify");
const logAdminAction = require("../utils/logAdminAction");
const { productUploadDir } = require("../utils/uploadPaths");
const {
  checkAndNotifyLowStock,
  getLowStockThreshold,
} = require("../utils/lowStock");

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Only images are allowed", 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImages = upload.array("images", 5);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files?.length) return next();

  req.body.uploadedImages = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `product-${Date.now()}-${i + 1}.jpeg`;
      const filePath = path.join(productUploadDir, filename);
      await sharp(file.buffer)
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .toFormat("jpeg")
        .jpeg({ quality: 85 })
        .toFile(filePath);
      req.body.uploadedImages.push(`images/products/${filename}`);
    })
  );
  next();
});

const normalizeImgs = (imgs) => {
  if (!imgs) return undefined;
  let parsed = imgs;
  if (typeof imgs === "string") {
    try {
      parsed = JSON.parse(imgs);
    } catch {
      parsed = [imgs];
    }
  }
  if (!Array.isArray(parsed)) return undefined;

  return parsed.map((img, index) => {
    if (typeof img === "string") {
      return { url: img, sortOrder: index, isPrimary: index === 0 };
    }
    return {
      url: img.url,
      sortOrder: img.sortOrder ?? index,
      isPrimary: Boolean(img.isPrimary),
    };
  });
};

const parseFeaturedPlacement = (value) => {
  if (value === undefined) return undefined;
  if (value === null || value === "" || value === "null") return null;
  return value;
};

const buildPublicFilter = async (req) => {
  const filter = { deletedAt: null };

  if (req.query.category && req.query.category !== "all") {
    const category = await Category.findOne({ slug: req.query.category });
    filter.category = category ? category._id : null;
  }

  return filter;
};

exports.getAllProducts = catchAsync(async (req, res) => {
  const filter = await buildPublicFilter(req);
  const products = await Product.find(filter)
    .populate("category", "name slug sortOrder image")
    .sort({ title: 1 });

  res.status(200).json({
    status: "success",
    results: products.length,
    data: products,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const { slugOrId } = req.params;
  const baseFilter = { deletedAt: null };
  let product;

  if (OBJECT_ID_RE.test(slugOrId)) {
    product = await Product.findOne({ _id: slugOrId, ...baseFilter }).populate(
      "category",
      "name slug sortOrder image"
    );
  }

  if (!product) {
    product = await Product.findOne({ slug: slugOrId, ...baseFilter }).populate(
      "category",
      "name slug sortOrder image"
    );
  }

  if (!product) {
    return next(new AppError("Can't find product with that slug.", 404));
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.adminGetProducts = catchAsync(async (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  const q = (req.query.q || "").trim();
  const includeDeleted = req.query.includeDeleted === "true";

  const filter = {};
  if (!includeDeleted) filter.deletedAt = null;

  if (req.query.category) {
    // Admin list filters by category ObjectId only
    if (!OBJECT_ID_RE.test(req.query.category)) {
      return next(new AppError("Category filter must be a category id.", 400));
    }
    filter.category = req.query.category;
  }

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { slug: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug sortOrder image")
      .sort({ updatedAt: -1, title: 1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    status: "success",
    results: products.length,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    data: products,
  });
});

exports.adminGetProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name slug sortOrder image"
  );
  if (!product) return next(new AppError("Product not found.", 404));

  res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const {
    title,
    slug,
    price,
    stockQuantity,
    description,
    category,
    dimensions,
    weight,
    size,
    featuredPlacement,
  } = req.body;

  if (!title) return next(new AppError("Title is required.", 400));
  if (!category) return next(new AppError("Category is required.", 400));
  if (!OBJECT_ID_RE.test(category)) {
    return next(new AppError("Category must be a valid category id.", 400));
  }

  const categoryDoc = await Category.findById(category);
  if (!categoryDoc) return next(new AppError("Category not found.", 404));

  let imgs = normalizeImgs(req.body.imgs);
  if (req.body.uploadedImages?.length) {
    const uploaded = req.body.uploadedImages.map((url, index) => ({
      url,
      sortOrder: index,
      isPrimary: index === 0,
    }));
    imgs = imgs?.length ? [...imgs, ...uploaded].slice(0, 5) : uploaded;
  }
  if (!imgs?.length) {
    return next(new AppError("At least one product image is required.", 400));
  }

  const product = await Product.create({
    title,
    slug: slug ? slugify(slug) : slugify(title),
    imgs,
    price: Number(price),
    stockQuantity: Number(stockQuantity),
    description,
    category: categoryDoc._id,
    dimensions,
    weight,
    size: size || undefined,
    featuredPlacement: parseFeaturedPlacement(featuredPlacement),
  });

  await product.populate("category", "name slug sortOrder image");

  await logAdminAction(req, {
    action: "product.create",
    resourceType: "Product",
    resourceId: product._id,
    meta: { title: product.title, slug: product.slug },
  });

  res.status(201).json({
    status: "success",
    data: product,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError("Product not found.", 404));

  const {
    title,
    slug,
    price,
    stockQuantity,
    description,
    category,
    dimensions,
    weight,
    size,
    featuredPlacement,
  } = req.body;

  if (title !== undefined) product.title = title;
  if (slug !== undefined) product.slug = slugify(slug);
  else if (title !== undefined && req.body.slug === undefined) {
    /* keep existing slug unless explicitly provided */
  }
  if (price !== undefined) product.price = Number(price);
  const stockChanged =
    stockQuantity !== undefined &&
    Number(stockQuantity) !== product.stockQuantity;
  if (stockQuantity !== undefined) product.stockQuantity = Number(stockQuantity);
  if (description !== undefined) product.description = description;
  if (dimensions !== undefined) product.dimensions = dimensions;
  if (weight !== undefined) product.weight = weight;
  if (size !== undefined) product.size = size || undefined;

  const placement = parseFeaturedPlacement(featuredPlacement);
  if (placement !== undefined) product.featuredPlacement = placement;

  if (category) {
    if (!OBJECT_ID_RE.test(category)) {
      return next(new AppError("Category must be a valid category id.", 400));
    }
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) return next(new AppError("Category not found.", 404));
    product.category = categoryDoc._id;
  }

  let imgs = normalizeImgs(req.body.imgs);
  if (req.body.uploadedImages?.length) {
    const start = imgs?.length || product.imgs.length;
    const uploaded = req.body.uploadedImages.map((url, index) => ({
      url,
      sortOrder: start + index,
      isPrimary: false,
    }));
    imgs = [...(imgs || product.imgs.map((i) => i.toObject?.() || i)), ...uploaded].slice(
      0,
      5
    );
  }
  if (imgs) product.imgs = imgs;

  await product.save();
  await product.populate("category", "name slug sortOrder image");

  if (stockChanged) {
    await checkAndNotifyLowStock(product._id);
  }

  await logAdminAction(req, {
    action: "product.update",
    resourceType: "Product",
    resourceId: product._id,
    meta: { title: product.title, slug: product.slug },
  });

  res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.adminGetLowStock = catchAsync(async (req, res) => {
  const threshold =
    parseInt(req.query.threshold, 10) || (await getLowStockThreshold());
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

  const products = await Product.find({
    deletedAt: null,
    stockQuantity: { $lt: threshold },
  })
    .populate("category", "name slug")
    .sort({ stockQuantity: 1, title: 1 })
    .limit(limit);

  res.status(200).json({
    status: "success",
    results: products.length,
    threshold,
    data: products,
  });
});

exports.softDeleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError("Product not found.", 404));
  if (product.deletedAt) {
    return next(new AppError("Product is already deleted.", 400));
  }

  product.deletedAt = new Date();
  await product.save({ validateBeforeSave: false });

  await logAdminAction(req, {
    action: "product.softDelete",
    resourceType: "Product",
    resourceId: product._id,
    meta: { title: product.title },
  });

  res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.restoreProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError("Product not found.", 404));
  if (!product.deletedAt) {
    return next(new AppError("Product is not deleted.", 400));
  }

  product.deletedAt = null;
  await product.save({ validateBeforeSave: false });
  await product.populate("category", "name slug sortOrder image");

  await logAdminAction(req, {
    action: "product.restore",
    resourceType: "Product",
    resourceId: product._id,
    meta: { title: product.title },
  });

  res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.hardDeleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError("Product not found.", 404));

  const ordered = await Order.exists({ "products.product": product._id });
  if (ordered) {
    return next(
      new AppError(
        "Cannot permanently delete a product that appears on an order. Soft delete instead.",
        400
      )
    );
  }

  await Product.findByIdAndDelete(product._id);

  await logAdminAction(req, {
    action: "product.hardDelete",
    resourceType: "Product",
    resourceId: product._id,
    meta: { title: product.title },
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
