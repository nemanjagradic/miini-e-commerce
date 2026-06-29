const User = require("../models/userModel");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getTargetQuantity = (existingQuantity, requestedQuantity, buyNow) => {
  if (buyNow) return requestedQuantity;
  return existingQuantity + requestedQuantity;
};

const assertStockAvailable = (product, targetQuantity) => {
  if (targetQuantity > product.stockQuantity) {
    throw new AppError(
      `Only ${product.stockQuantity} item(s) of "${product.title}" available in stock.`,
      400
    );
  }
};

exports.getCart = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .populate({
      path: "cart.product",
    })
    .lean();
  if (!user) return next(new AppError("No user with that id.", 404));

  const updatedUserCart = user.cart.map((item) => ({
    ...item,
    totalPrice: item.quantity * item.product.price,
  }));

  const subtotal = updatedUserCart.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );
  const totalQuantity = updatedUserCart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  res.status(200).json({
    status: "success",
    cart: updatedUserCart,
    subtotal,
    totalQuantity,
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity, buyNow } = req.body;
  if (!productId || !quantity)
    return next(new AppError("Please provide product id and quantity!", 400));

  const product = await Product.findById(productId);
  if (!product) return next(new AppError("Product not found.", 404));

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("No user with that id.", 404));

  const existingProduct = user.cart.find(
    (item) => item.product.toString() === productId
  );

  const targetQuantity = getTargetQuantity(
    existingProduct?.quantity ?? 0,
    quantity,
    buyNow
  );

  assertStockAvailable(product, targetQuantity);

  if (existingProduct) {
    existingProduct.quantity = targetQuantity;
  } else {
    user.cart.push({ product: productId, quantity: targetQuantity });
  }

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id)
    .populate("cart.product")
    .lean();

  const updatedUserCart = updatedUser.cart.map((item) => ({
    ...item,
    totalPrice: item.quantity * item.product.price,
  }));

  const subtotal = updatedUserCart.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  const totalQuantity = updatedUserCart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  res.status(200).json({
    status: "success",
    cart: updatedUserCart,
    subtotal,
    totalQuantity,
  });
});

exports.updateQuantity = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { quantityChange } = req.body;

  if (typeof quantityChange !== "number")
    return next(new AppError("Quantity must be a number.", 400));

  const product = await Product.findById(productId);
  if (!product) return next(new AppError("Product not found.", 404));

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("No user with that id.", 404));

  const productIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId
  );
  if (productIndex === -1) {
    return next(new AppError("Product not found in cart", 404));
  }

  const currentQuantity = user.cart[productIndex].quantity;
  const newQuantity = currentQuantity + quantityChange;

  if (newQuantity < 1) {
    return next(new AppError("Minimum quantity is 1.", 400));
  }

  assertStockAvailable(product, newQuantity);

  user.cart[productIndex].quantity = newQuantity;

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id)
    .populate("cart.product")
    .lean();

  const updatedUserCart = updatedUser.cart.map((item) => ({
    ...item,
    totalPrice: item.quantity * item.product.price,
  }));

  const subtotal = updatedUserCart.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  const totalQuantity = updatedUserCart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  res.status(200).json({
    status: "success",
    cart: updatedUserCart,
    subtotal,
    totalQuantity,
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("No user with that id.", 404));

  const productInCart = user.cart.find(
    (item) => item.product.toString() === productId
  );
  if (!productInCart) {
    return next(new AppError("Product not found in cart", 404));
  }

  user.cart = user.cart.filter((item) => item.product.toString() !== productId);
  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id)
    .populate("cart.product")
    .lean();

  const updatedUserCart = updatedUser.cart.map((item) => ({
    ...item,
    totalPrice: item.quantity * item.product.price,
  }));

  const subtotal = updatedUserCart.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  const totalQuantity = updatedUserCart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  res.status(200).json({
    status: "success",
    cart: updatedUserCart,
    subtotal,
    totalQuantity,
  });
});

exports.mergeCart = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const anonymousCart = req.body.cart;

  for (const anonymousItem of anonymousCart) {
    const product = await Product.findById(anonymousItem.id);
    if (!product) continue;

    const existingItem = user.cart.find(
      (userItem) => userItem.product.toString() === anonymousItem.id
    );

    const mergedQuantity = existingItem
      ? existingItem.quantity + anonymousItem.quantity
      : anonymousItem.quantity;

    const cappedQuantity = Math.min(mergedQuantity, product.stockQuantity);

    if (existingItem) {
      existingItem.quantity = cappedQuantity;
    } else if (cappedQuantity > 0) {
      user.cart.push({
        product: anonymousItem.id,
        quantity: cappedQuantity,
      });
    }
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({ status: "success", cart: user.cart });
});
