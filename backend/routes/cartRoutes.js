const express = require("express");
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.post("/merge-cart", cartController.mergeCart);

router.post("/:productId", cartController.updateQuantity);
router.delete("/:productId", cartController.removeFromCart);

module.exports = router;
