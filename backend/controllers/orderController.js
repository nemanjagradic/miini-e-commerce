const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { getShippingCost } = require("../utils/shipping");

const buildStripeLineItems = (order) => {
  const lineItems = order.products.map((item) => ({
    price_data: {
      currency: "usd",
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        images: [`https://miini-backend.up.railway.app/api/${item.img}`],
      },
    },
    quantity: item.quantity,
  }));

  if (order.shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        unit_amount: order.shippingCost * 100,
        product_data: { name: "Standard delivery" },
      },
      quantity: 1,
    });
  }

  return lineItems;
};

const getOrderSubtotal = (order) =>
  order.subtotal ??
  order.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

const ensureOrderShipping = (order) => {
  const subtotal = getOrderSubtotal(order);
  const shippingCost = order.shippingCost ?? getShippingCost(subtotal);

  order.subtotal = subtotal;
  order.shippingCost = shippingCost;
  order.totalPrice = subtotal + shippingCost;

  return order;
};

const createCheckoutSessionForOrder = async (order, email) => {
  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/?payment=success`,
    cancel_url: `${process.env.FRONTEND_URL}/?payment=cancel`,
    customer_email: email,
    client_reference_id: order._id.toString(),
    metadata: {
      userId: order.user.toString(),
      orderId: order._id.toString(),
    },
    line_items: buildStripeLineItems(order),
  });
};

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("cart.product");
  if (!user) return next(new AppError("User not found.", 400));

  if (!user.cart || user.cart.length === 0)
    return next(new AppError("There are no products in cart", 400));

  for (const item of user.cart) {
    if (item.quantity > item.product.stockQuantity) {
      return next(
        new AppError(
          `Only ${item.product.stockQuantity} item(s) of "${item.product.title}" available in stock.`,
          400
        )
      );
    }
  }

  const products = user.cart.map((item) => ({
    product: item.product._id,
    title: item.product.title,
    price: item.product.price,
    quantity: item.quantity,
    img: item.product.imgs[0],
  }));

  const subtotal = products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCost = getShippingCost(subtotal);

  const order = await Order.create({
    user: req.user.id,
    products,
    status: "pending",
    subtotal,
    shippingCost,
    totalPrice: subtotal + shippingCost,
  });

  const session = await createCheckoutSessionForOrder(order, req.user.email);

  order.stripeSessionId = session.id;
  await order.save();

  res.status(200).json({
    status: "success",
    session,
    order: {
      id: order._id,
      products: order.products,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      stripeSessionId: session.id,
    },
  });
});

exports.resumePayment = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    user: req.user.id,
    status: "pending",
  });

  if (!order) {
    return next(new AppError("Order not found.", 404));
  }

  for (const item of order.products) {
    const product = await Product.findById(item.product);
    if (!product || item.quantity > product.stockQuantity) {
      return next(
        new AppError(
          `Only ${product?.stockQuantity ?? 0} item(s) of "${item.title}" available in stock.`,
          400
        )
      );
    }
  }

  let session = null;
  if (order.stripeSessionId) {
    session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
  }

  if (session?.status === "open") {
    return res.status(200).json({
      status: "success",
      session: { id: session.id },
    });
  }

  if (session?.status === "complete") {
    return next(
      new AppError(
        "Payment was already completed. Please refresh your orders.",
        400
      )
    );
  }

  ensureOrderShipping(order);
  const newSession = await createCheckoutSessionForOrder(order, req.user.email);
  order.stripeSessionId = newSession.id;
  await order.save();

  res.status(200).json({
    status: "success",
    session: { id: newSession.id },
  });
});

exports.webhookHandler = catchAsync(async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const orderId = event.data.object.client_reference_id;
    const order = await Order.findById(orderId);

    if (order && order.status !== "paid") {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: -item.quantity },
        });
      }

      order.status = "paid";
      await order.save();

      await User.findByIdAndUpdate(order.user, { cart: [] });
    }
  }

  res.status(200).json({ received: true });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate("products.product", "slug");

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

  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate("products.product", "slug");

  res.status(200).json({ status: "success", data: orders });
});
