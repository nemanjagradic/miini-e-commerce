const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", productController.getAllProducts);

router.get(
  "/admin/list",
  authController.protect,
  authController.restrictTo("admin"),
  productController.adminGetProducts
);

router.get(
  "/admin/low-stock",
  authController.protect,
  authController.restrictTo("admin"),
  productController.adminGetLowStock
);

router.get(
  "/admin/:id",
  authController.protect,
  authController.restrictTo("admin"),
  productController.adminGetProduct
);

router.post(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  productController.uploadProductImages,
  productController.resizeProductImages,
  productController.createProduct
);

router.patch(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  productController.uploadProductImages,
  productController.resizeProductImages,
  productController.updateProduct
);

router.patch(
  "/:id/soft-delete",
  authController.protect,
  authController.restrictTo("admin"),
  productController.softDeleteProduct
);

router.patch(
  "/:id/restore",
  authController.protect,
  authController.restrictTo("admin"),
  productController.restoreProduct
);

router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  productController.hardDeleteProduct
);

router.get("/:slugOrId", productController.getProduct);

module.exports = router;
