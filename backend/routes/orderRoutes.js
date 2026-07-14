const express = require("express");
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.get("/", authController.protect, orderController.getMyOrders);
router.patch("/", authController.protect, orderController.cancelOrder);

router.post(
  "/checkout-session",
  authController.protect,
  orderController.getCheckoutSession
);

router.get(
  "/admin/list",
  authController.protect,
  authController.restrictTo("admin"),
  orderController.adminGetOrders
);

router.get(
  "/admin/recent",
  authController.protect,
  authController.restrictTo("admin"),
  orderController.adminGetRecentOrders
);

router.get(
  "/admin/stats",
  authController.protect,
  authController.restrictTo("admin"),
  orderController.adminGetStats
);

router.get(
  "/admin/:id",
  authController.protect,
  authController.restrictTo("admin"),
  orderController.adminGetOrder
);

router.patch(
  "/admin/:id/status",
  authController.protect,
  authController.restrictTo("admin"),
  orderController.adminUpdateStatus
);

router.patch(
  "/admin/:id/tracking",
  authController.protect,
  authController.restrictTo("admin"),
  orderController.adminUpdateTracking
);

router.post(
  "/admin/:id/notes",
  authController.protect,
  authController.restrictTo("admin"),
  orderController.adminAddNote
);

router.post(
  "/admin/:id/cancel",
  authController.protect,
  authController.restrictTo("admin"),
  orderController.adminCancelOrder
);

router.post(
  "/admin/:id/refund",
  authController.protect,
  authController.restrictTo("admin"),
  orderController.adminRefundOrder
);

router.post(
  "/admin/:id/resend-email",
  authController.protect,
  authController.restrictTo("admin"),
  orderController.adminResendEmail
);

router.post(
  "/:orderId/resume-payment",
  authController.protect,
  orderController.resumePayment
);

module.exports = router;
