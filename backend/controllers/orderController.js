const Order = require("../models/orderModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("cart.product");
  if (!user) return next(new AppError("User not found.", 400));

  if (!user.cart || user.cart.length === 0)
    return next(new AppError("There are no products in cart", 400));

  const products = user.cart.map((item) => ({
    product: item.product._id,
    title: item.product.title,
    price: item.product.price,
    quantity: item.quantity,
    img: item.product.imgs[0],
  }));

  const totalPrice = products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: req.user.id,
    products,
    status: "pending",
    totalPrice,
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}`,
    cancel_url: "http://localhost:3000/home",
    customer_email: req.user.email,
    client_reference_id: order._id.toString(),
    metadata: {
      userId: req.user._id.toString(),
      orderId: order._id.toString(),
    },
    line_items: order.products.map((item) => ({
      price_data: {
        currency: "usd",
        unit_amount: item.price * 100,
        product_data: {
          name: item.title,
          images: [
            "https://miini-e-commerce.netlify.app/images/roundtable-1.png",
          ],
        },
      },
      quantity: item.quantity,
    })),
  });

  order.stripeSessionId = session.id;
  await order.save();

  res.status(200).json({
    status: "success",
    session,
    order: {
      id: order._id,
      products: order.products,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      stripeSessionId: session.sessionId,
    },
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).sort({
    createdAt: -1,
  });

  res.status(200).json({ status: "success", data: orders });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findOneAndUpdate(
    { _id: req.body.id, user: req.user.id },
    { status: "canceled" }
  );

  if (!order) {
    return next(new AppError("Order not found or not yours", 404));
  }

  const orders = await Order.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.status(200).json({ status: "success", data: orders });
});
