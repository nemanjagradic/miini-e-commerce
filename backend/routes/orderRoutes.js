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

router.post(
  "/:orderId/resume-payment",
  authController.protect,
  orderController.resumePayment
);

module.exports = router;
