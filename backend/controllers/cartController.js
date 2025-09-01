const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

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

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("No user with that id.", 404));

  const existingProduct = user.cart.find(
    (item) => item.product.toString() === productId
  );

  if (existingProduct) {
    if (!buyNow) existingProduct.quantity += quantity;
  } else {
    user.cart.push({ product: productId, quantity });
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
  const guestCart = req.body.cart;

  guestCart.forEach((guestItem) => {
    const existingItem = user.cart.find(
      (userItem) => userItem.product.toString() === guestItem.id
    );

    if (existingItem) {
      existingItem.quantity += guestItem.quantity;
    } else {
      user.cart.push({
        product: guestItem.id,
        quantity: guestItem.quantity,
      });
    }
  });

  await user.save({ validateBeforeSave: false });

  res.status(200).json({ status: "success", cart: user.cart });
});
