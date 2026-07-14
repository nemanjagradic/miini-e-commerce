const Order = require("../models/orderModel");
const ORDER_STATUSES = Order.ORDER_STATUSES;
const Product = require("../models/productModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Email = require("../utils/email");
const logAdminAction = require("../utils/logAdminAction");
const { checkAndNotifyLowStock } = require("../utils/lowStock");
const {
  CANCEL_PRESETS,
  REFUNDABLE_STATUSES,
  EMAIL_ON_STATUS,
  canTransition,
  nextStatuses,
  formatCancelComment,
  appendStatusHistory,
  allowedEmailTemplates,
} = require("../utils/orderStatus");
const {
  PAID_LIKE,
  resolvePeriod,
  resolveTopSellersPeriod,
  eachUtcDay,
  fillDailySeries,
} = require("../utils/adminStatsPeriod");
const {
  validateShippingAddress,
  isCompleteShippingAddress,
  toStripeShipping,
} = require("../utils/shippingAddress");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { getShippingCost } = require("../utils/shipping");
const { getPrimaryImageUrl } = require("../utils/productImages");

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

const buildStripeLineItems = (order) => {
  const lineItems = order.products.map((item) => ({
    price_data: {
      currency: "usd",
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        images: [`https://miini-backend.up.railway.app/${item.img}`],
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

const ensureOrderShipping = async (order) => {
  const subtotal = getOrderSubtotal(order);
  const shippingCost =
    order.shippingCost ?? (await getShippingCost(subtotal));

  order.subtotal = subtotal;
  order.shippingCost = shippingCost;
  order.totalPrice = subtotal + shippingCost;

  return order;
};

const createCheckoutSessionForOrder = async (order, userDoc) => {
  const email = userDoc.email;
  const addr = order.shippingAddress;

  const customerPayload = {
    email,
    name: addr?.fullName || userDoc.name,
    phone: addr?.phone || undefined,
  };
  if (isCompleteShippingAddress(addr)) {
    customerPayload.shipping = toStripeShipping(addr);
  }

  const customer = await stripe.customers.create(customerPayload);

  const sessionPayload = {
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/?payment=success`,
    cancel_url: `${process.env.FRONTEND_URL}/?payment=cancel`,
    customer: customer.id,
    client_reference_id: order._id.toString(),
    metadata: {
      userId: order.user.toString(),
      orderId: order._id.toString(),
    },
    line_items: buildStripeLineItems(order),
  };

  if (isCompleteShippingAddress(addr)) {
    sessionPayload.payment_intent_data = {
      shipping: toStripeShipping(addr),
    };
  }

  return stripe.checkout.sessions.create(sessionPayload);
};

const populateOrder = (query) =>
  query
    .populate("user", "name email")
    .populate("products.product", "slug title stockQuantity")
    .populate("statusHistory.by", "name email")
    .populate("adminNotes.by", "name email");

const buildOrderMeta = (order) => ({
  nextStatuses: nextStatuses(order.status),
  cancelPresets: CANCEL_PRESETS,
  refundable: REFUNDABLE_STATUSES.includes(order.status),
  defaultRestock: ["paid", "processing"].includes(order.status),
  emailTemplates: allowedEmailTemplates(order.status),
});

const sendOrderStatusEmail = async (order, templateKey) => {
  if (!EMAIL_ON_STATUS[templateKey] && !Email.ORDER_EMAIL_TEMPLATES[templateKey]) {
    return;
  }

  let user = order.user;
  if (!user?.email) {
    user = await User.findById(order.user._id || order.user).select(
      "name email"
    );
  }
  if (!user?.email) {
    console.error("Cannot send order email: user email missing");
    return;
  }

  try {
    await new Email(user, process.env.FRONTEND_URL).sendOrderEmail(
      templateKey,
      order
    );
  } catch (err) {
    console.error(`Order ${templateKey} email failed:`, err.message);
  }
};

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("cart.product");
  if (!user) return next(new AppError("User not found.", 400));

  if (!user.cart || user.cart.length === 0)
    return next(new AppError("There are no products in cart", 400));

  let shippingAddress;
  try {
    shippingAddress = validateShippingAddress(req.body.shippingAddress);
  } catch (err) {
    return next(new AppError(err.message, err.statusCode || 400));
  }

  const saveToProfile = req.body.saveToProfile !== false;

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
    img: getPrimaryImageUrl(item.product.imgs),
  }));

  const subtotal = products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCost = await getShippingCost(subtotal);

  if (saveToProfile) {
    user.shippingAddress = shippingAddress;
    await user.save({ validateBeforeSave: false });
  }

  const order = await Order.create({
    user: req.user.id,
    products,
    status: "pending",
    statusHistory: [],
    subtotal,
    shippingCost,
    totalPrice: subtotal + shippingCost,
    shippingAddress,
  });

  const session = await createCheckoutSessionForOrder(order, user);

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
      shippingAddress: order.shippingAddress,
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

  let addressJustSet = false;
  if (!isCompleteShippingAddress(order.shippingAddress)) {
    if (!req.body?.shippingAddress) {
      return next(
        new AppError(
          "Shipping address is required before payment can continue.",
          400
        )
      );
    }
    let shippingAddress;
    try {
      shippingAddress = validateShippingAddress(req.body.shippingAddress);
    } catch (err) {
      return next(new AppError(err.message, err.statusCode || 400));
    }
    order.shippingAddress = shippingAddress;
    addressJustSet = true;

    const saveToProfile = req.body.saveToProfile !== false;
    if (saveToProfile) {
      await User.findByIdAndUpdate(req.user.id, { shippingAddress });
    }
    await order.save();
  }

  let session = null;
  if (order.stripeSessionId && !addressJustSet) {
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

  const user = await User.findById(req.user.id);
  await ensureOrderShipping(order);
  const newSession = await createCheckoutSessionForOrder(order, user);
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

    if (order && order.status === "pending") {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: -item.quantity },
        });
        await checkAndNotifyLowStock(item.product);
      }

      appendStatusHistory(order, {
        to: "paid",
        by: null,
        comment: "Payment received via Stripe",
      });
      await order.save();

      await User.findByIdAndUpdate(order.user, { cart: [] });

      const populated = await populateOrder(Order.findById(order._id));
      await sendOrderStatusEmail(populated, "paid");
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
  const order = await Order.findOne({
    _id: req.body.id,
    user: req.user.id,
  });

  if (!order) {
    return next(new AppError("Order not found or not yours", 404));
  }

  if (order.status !== "pending") {
    return next(
      new AppError("Only pending orders can be canceled.", 400)
    );
  }

  appendStatusHistory(order, {
    to: "canceled",
    by: req.user.id,
    comment: "Canceled by customer",
  });
  await order.save();

  const populated = await populateOrder(Order.findById(order._id));
  await sendOrderStatusEmail(populated, "canceled");

  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate("products.product", "slug");

  res.status(200).json({ status: "success", data: orders });
});

// ——— Admin ———

const paidAtExpr = {
  $let: {
    vars: {
      paidEntry: {
        $arrayElemAt: [
          {
            $filter: {
              input: { $ifNull: ["$statusHistory", []] },
              as: "h",
              cond: { $eq: ["$$h.to", "paid"] },
            },
          },
          0,
        ],
      },
    },
    in: {
      $ifNull: [
        "$$paidEntry.at",
        {
          $cond: [{ $in: ["$status", PAID_LIKE] }, "$createdAt", null],
        },
      ],
    },
  },
};

const refundedAtExpr = {
  $let: {
    vars: {
      refundEntry: {
        $arrayElemAt: [
          {
            $filter: {
              input: { $ifNull: ["$statusHistory", []] },
              as: "h",
              cond: { $eq: ["$$h.to", "refunded"] },
            },
          },
          0,
        ],
      },
    },
    in: {
      $ifNull: [
        "$$refundEntry.at",
        {
          $cond: [{ $eq: ["$status", "refunded"] }, "$updatedAt", null],
        },
      ],
    },
  },
};

exports.adminGetOrders = catchAsync(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  const q = (req.query.q || "").trim();
  const status = (req.query.status || "").trim();

  const filter = {};
  if (status && ORDER_STATUSES.includes(status)) {
    filter.status = status;
  }
  if (q) {
    const or = [
      { trackingNumber: { $regex: q, $options: "i" } },
      { carrier: { $regex: q, $options: "i" } },
      { status: { $regex: q, $options: "i" } },
    ];

    const idQuery = q.replace(/^#/, "").trim();
    if (OBJECT_ID_RE.test(idQuery)) {
      or.push({ _id: idQuery });
    } else if (/^[0-9a-fA-F]{2,23}$/.test(idQuery)) {
      // Match partial / short display ids (e.g. last 6 of ObjectId) anywhere in _id
      const escaped = idQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      or.push({
        $expr: {
          $regexMatch: {
            input: { $toString: "$_id" },
            regex: escaped,
            options: "i",
          },
        },
      });
    }

    const matchingUsers = await User.find({
      $or: [
        { email: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ],
    })
      .select("_id")
      .lean();

    if (matchingUsers.length) {
      or.push({ user: { $in: matchingUsers.map((u) => u._id) } });
    }

    filter.$or = or;
  }

  const [orders, total] = await Promise.all([
    populateOrder(
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
    ),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    status: "success",
    results: orders.length,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    data: orders,
  });
});

exports.adminGetRecentOrders = catchAsync(async (req, res) => {
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 5));
  const orders = await populateOrder(
    Order.find().sort({ createdAt: -1 }).limit(limit)
  );

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: orders,
  });
});

exports.adminGetStats = catchAsync(async (req, res, next) => {
  let periodInfo;
  try {
    periodInfo = resolvePeriod({
      period: req.query.period,
      from: req.query.from,
      to: req.query.to,
    });
  } catch (err) {
    return next(new AppError(err.message, err.statusCode || 400));
  }

  const topSellersInfo = resolveTopSellersPeriod(req.query.topSellersPeriod);

  const paidMatch = { paidAt: { $ne: null } };
  if (periodInfo.rangeStart) {
    paidMatch.paidAt.$gte = periodInfo.rangeStart;
  }
  paidMatch.paidAt.$lt = periodInfo.rangeEnd;

  const chartPaidMatch = {
    paidAt: {
      $ne: null,
      $gte: periodInfo.chartStart,
      $lt: periodInfo.chartEnd,
    },
  };

  const refundMatch = { refundedAt: { $ne: null } };
  if (periodInfo.rangeStart) {
    refundMatch.refundedAt.$gte = periodInfo.rangeStart;
  }
  refundMatch.refundedAt.$lt = periodInfo.rangeEnd;

  const topPaidMatch = {
    paidAt: {
      $ne: null,
      $gte: topSellersInfo.rangeStart,
      $lt: topSellersInfo.rangeEnd,
    },
  };

  const withDates = [{ $addFields: { paidAt: paidAtExpr, refundedAt: refundedAtExpr } }];

  const [
    moneyAgg,
    refundAgg,
    chartOrdersAgg,
    chartRevenueAgg,
    queueAgg,
    topSellersAgg,
  ] = await Promise.all([
    Order.aggregate([
      ...withDates,
      { $match: paidMatch },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
    ]),
    Order.aggregate([
      ...withDates,
      { $match: refundMatch },
      {
        $group: {
          _id: null,
          refunds: { $sum: "$totalPrice" },
          refundCount: { $sum: 1 },
        },
      },
    ]),
    Order.aggregate([
      ...withDates,
      { $match: chartPaidMatch },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt", timezone: "UTC" },
          },
          count: { $sum: 1 },
        },
      },
    ]),
    Order.aggregate([
      ...withDates,
      { $match: chartPaidMatch },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt", timezone: "UTC" },
          },
          amount: { $sum: "$totalPrice" },
        },
      },
    ]),
    Order.aggregate([
      { $match: { status: { $in: ["paid", "processing", "shipped"] } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      ...withDates,
      { $match: topPaidMatch },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          title: { $first: "$products.title" },
          img: { $first: "$products.img" },
          units: { $sum: "$products.quantity" },
          revenue: {
            $sum: { $multiply: ["$products.price", "$products.quantity"] },
          },
        },
      },
      { $sort: { units: -1, revenue: -1 } },
      { $limit: 3 },
    ]),
  ]);

  const revenue = moneyAgg[0]?.revenue || 0;
  const orders = moneyAgg[0]?.orders || 0;
  const refunds = refundAgg[0]?.refunds || 0;
  const refundCount = refundAgg[0]?.refundCount || 0;
  const aov = orders > 0 ? revenue / orders : 0;
  const net = revenue - refunds;

  const ordersByDate = new Map(
    chartOrdersAgg.map((row) => [row._id, row.count])
  );
  const revenueByDate = new Map(
    chartRevenueAgg.map((row) => [row._id, row.amount])
  );
  const days = eachUtcDay(periodInfo.chartStart, periodInfo.chartEnd);

  const queue = { paid: 0, processing: 0, shipped: 0 };
  for (const row of queueAgg) {
    if (Object.prototype.hasOwnProperty.call(queue, row._id)) {
      queue[row._id] = row.count;
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      period: {
        preset: periodInfo.preset,
        from: periodInfo.from,
        to: periodInfo.to,
      },
      money: {
        revenue,
        orders,
        aov,
        refunds,
        refundCount,
        net,
      },
      queue,
      charts: {
        truncated: periodInfo.chartsTruncated,
        from: periodInfo.chartStart.toISOString().slice(0, 10),
        to: periodInfo.to,
        ordersByDay: fillDailySeries(days, ordersByDate, "count"),
        revenueByDay: fillDailySeries(days, revenueByDate, "amount"),
      },
      topSellers: {
        period: topSellersInfo.period,
        items: topSellersAgg.map((row) => ({
          productId: row._id,
          title: row.title || "Product",
          img: row.img || "",
          units: row.units,
          revenue: row.revenue,
        })),
      },
    },
  });
});

exports.adminGetOrder = catchAsync(async (req, res, next) => {
  const order = await populateOrder(Order.findById(req.params.id));
  if (!order) return next(new AppError("Order not found.", 404));

  res.status(200).json({
    status: "success",
    data: order,
    meta: buildOrderMeta(order),
  });
});

exports.adminUpdateStatus = catchAsync(async (req, res, next) => {
  const { status, comment } = req.body;
  if (!status) return next(new AppError("Status is required.", 400));

  if (status === "canceled" || status === "refunded" || status === "paid") {
    return next(
      new AppError(
        "Use the dedicated cancel/refund endpoints for that transition.",
        400
      )
    );
  }

  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found.", 404));

  if (!canTransition(order.status, status)) {
    return next(
      new AppError(
        `Cannot transition from "${order.status}" to "${status}".`,
        400
      )
    );
  }

  appendStatusHistory(order, {
    to: status,
    by: req.user.id,
    comment: (comment || "").trim(),
  });
  await order.save();

  const populated = await populateOrder(Order.findById(order._id));

  if (EMAIL_ON_STATUS[status]) {
    await sendOrderStatusEmail(populated, status);
  }

  await logAdminAction(req, {
    action: "order.status",
    resourceType: "Order",
    resourceId: order._id,
    meta: { from: populated.statusHistory.at(-1)?.from, to: status },
  });

  res.status(200).json({
    status: "success",
    data: populated,
    meta: buildOrderMeta(populated),
  });
});

exports.adminUpdateTracking = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found.", 404));

  if (req.body.trackingNumber !== undefined) {
    order.trackingNumber = String(req.body.trackingNumber).trim();
  }
  if (req.body.carrier !== undefined) {
    order.carrier = String(req.body.carrier).trim();
  }

  await order.save();

  await logAdminAction(req, {
    action: "order.tracking",
    resourceType: "Order",
    resourceId: order._id,
    meta: {
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
    },
  });

  const populated = await populateOrder(Order.findById(order._id));

  res.status(200).json({ status: "success", data: populated });
});

exports.adminAddNote = catchAsync(async (req, res, next) => {
  const body = (req.body.body || req.body.note || "").trim();
  if (!body) return next(new AppError("Note body is required.", 400));

  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found.", 404));

  order.adminNotes.push({
    body,
    at: new Date(),
    by: req.user.id,
  });
  await order.save();

  await logAdminAction(req, {
    action: "order.note",
    resourceType: "Order",
    resourceId: order._id,
    meta: { noteLength: body.length },
  });

  const populated = await populateOrder(Order.findById(order._id));

  res.status(200).json({ status: "success", data: populated });
});

exports.adminCancelOrder = catchAsync(async (req, res, next) => {
  const { preset, note } = req.body;
  if (!preset || !CANCEL_PRESETS.includes(preset)) {
    return next(
      new AppError(
        `Cancel preset must be one of: ${CANCEL_PRESETS.join(", ")}.`,
        400
      )
    );
  }

  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found.", 404));

  if (order.status !== "pending") {
    return next(
      new AppError("Only pending orders can be canceled.", 400)
    );
  }

  appendStatusHistory(order, {
    to: "canceled",
    by: req.user.id,
    comment: formatCancelComment(preset, note),
  });
  await order.save();

  const populated = await populateOrder(Order.findById(order._id));
  await sendOrderStatusEmail(populated, "canceled");

  await logAdminAction(req, {
    action: "order.cancel",
    resourceType: "Order",
    resourceId: order._id,
    meta: { preset, note: (note || "").trim() || undefined },
  });

  res.status(200).json({
    status: "success",
    data: populated,
    meta: buildOrderMeta(populated),
  });
});

exports.adminRefundOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found.", 404));

  if (!REFUNDABLE_STATUSES.includes(order.status)) {
    return next(
      new AppError(
        `Cannot refund an order with status "${order.status}".`,
        400
      )
    );
  }

  if (order.stripeRefundId) {
    return next(new AppError("Order has already been refunded.", 400));
  }

  if (!order.stripeSessionId) {
    return next(new AppError("Order has no Stripe session to refund.", 400));
  }

  const defaultRestock = ["paid", "processing"].includes(order.status);
  const restock =
    req.body.restock === undefined
      ? defaultRestock
      : Boolean(req.body.restock);

  const session = await stripe.checkout.sessions.retrieve(
    order.stripeSessionId
  );
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!paymentIntentId) {
    return next(
      new AppError("Could not find payment intent for this order.", 400)
    );
  }

  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
  });

  const previousStatus = order.status;
  appendStatusHistory(order, {
    to: "refunded",
    by: req.user.id,
    comment: restock
      ? "Full refund issued; inventory restocked"
      : "Full refund issued; inventory not restocked",
  });
  order.stripeRefundId = refund.id;
  await order.save();

  if (restock) {
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: item.quantity },
      });
      await checkAndNotifyLowStock(item.product);
    }
  }

  const populated = await populateOrder(Order.findById(order._id));
  await sendOrderStatusEmail(populated, "refunded");

  await logAdminAction(req, {
    action: "order.refund",
    resourceType: "Order",
    resourceId: order._id,
    meta: {
      from: previousStatus,
      stripeRefundId: refund.id,
      restock,
      amount: order.totalPrice,
    },
  });

  res.status(200).json({
    status: "success",
    data: populated,
    meta: buildOrderMeta(populated),
  });
});

exports.adminResendEmail = catchAsync(async (req, res, next) => {
  const template = (req.body.template || "").trim();
  if (!Email.ORDER_EMAIL_TEMPLATES[template]) {
    return next(
      new AppError(
        `Template must be one of: ${Object.keys(Email.ORDER_EMAIL_TEMPLATES).join(", ")}.`,
        400
      )
    );
  }

  const order = await populateOrder(Order.findById(req.params.id));
  if (!order) return next(new AppError("Order not found.", 404));

  const allowed = allowedEmailTemplates(order.status);
  if (!allowed.includes(template)) {
    return next(
      new AppError(
        `Cannot send "${template}" email for an order with status "${order.status}". Allowed: ${allowed.length ? allowed.join(", ") : "none"}.`,
        400
      )
    );
  }

  await sendOrderStatusEmail(order, template);

  await logAdminAction(req, {
    action: "order.resendEmail",
    resourceType: "Order",
    resourceId: order._id,
    meta: { template },
  });

  res.status(200).json({
    status: "success",
    message: `Email "${template}" sent.`,
    data: order,
  });
});
