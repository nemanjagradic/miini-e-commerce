const mongoose = require("mongoose");
const { shippingAddressSchema } = require("../utils/shippingAddress");

const ORDER_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "canceled",
  "refunded",
];

const statusHistorySchema = new mongoose.Schema(
  {
    from: {
      type: String,
      enum: ORDER_STATUSES,
      required: true,
    },
    to: {
      type: String,
      enum: ORDER_STATUSES,
      required: true,
    },
    at: {
      type: Date,
      default: Date.now,
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    comment: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const adminNoteSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      trim: true,
    },
    at: {
      type: Date,
      default: Date.now,
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: String,
        price: Number,
        quantity: Number,
        img: String,
      },
    ],
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    trackingNumber: {
      type: String,
      default: "",
      trim: true,
    },
    carrier: {
      type: String,
      default: "",
      trim: true,
    },
    adminNotes: {
      type: [adminNoteSchema],
      default: [],
    },
    stripeRefundId: String,
    subtotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: shippingAddressSchema,
      default: undefined,
    },
    stripeSessionId: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
module.exports.ORDER_STATUSES = ORDER_STATUSES;
