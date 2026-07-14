const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const slugify = require("../utils/slugify");
const logAdminAction = require("../utils/logAdminAction");

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find().sort({ sortOrder: 1, name: 1 });

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: categories,
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const { slugOrId } = req.params;
  let category;

  if (OBJECT_ID_RE.test(slugOrId)) {
    category = await Category.findById(slugOrId);
  }
  if (!category) {
    category = await Category.findOne({ slug: slugOrId });
  }
  if (!category) {
    return next(new AppError("Category not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const { name, slug, sortOrder, image } = req.body;
  if (!name) return next(new AppError("Category name is required.", 400));

  const category = await Category.create({
    name,
    slug: slug || slugify(name),
    sortOrder: sortOrder ?? 0,
    image: image || null,
  });

  await logAdminAction(req, {
    action: "category.create",
    resourceType: "Category",
    resourceId: category._id,
    meta: { name: category.name, slug: category.slug },
  });

  res.status(201).json({
    status: "success",
    data: category,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const { name, slug, sortOrder, image } = req.body;
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError("Category not found.", 404));

  if (name !== undefined) category.name = name;
  if (slug !== undefined) category.slug = slugify(slug);
  else if (name !== undefined && !req.body.slug) category.slug = slugify(name);
  if (sortOrder !== undefined) category.sortOrder = sortOrder;
  if (image !== undefined) category.image = image || null;
  if (req.file) {
    category.image = `images/categories/${req.file.filename}`;
  }

  await category.save();

  await logAdminAction(req, {
    action: "category.update",
    resourceType: "Category",
    resourceId: category._id,
    meta: { name: category.name, slug: category.slug },
  });

  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError("Category not found.", 404));

  const productCount = await Product.countDocuments({
    category: category._id,
    deletedAt: null,
  });
  if (productCount > 0) {
    return next(
      new AppError(
        `Cannot delete category while ${productCount} product(s) still use it. Reassign them first.`,
        400
      )
    );
  }

  await Category.findByIdAndDelete(category._id);

  await logAdminAction(req, {
    action: "category.delete",
    resourceType: "Category",
    resourceId: category._id,
    meta: { name: category.name, slug: category.slug },
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
