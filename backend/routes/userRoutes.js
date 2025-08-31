const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.protect, authController.logout);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.patch(
  "/updateMe",
  authController.protect,
  userController.uploadImage,
  userController.resizeUserImage,
  userController.updateMe
);

router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:token", authController.resetPassword);

router.get("/me", authController.protect, userController.getMe);

router.post(
  "/clear-guest-favorites",
  authController.protect,
  userController.clearGuestFavorites
);

router.get("/favorites", authController.protect, userController.getFavorites);
router.post(
  "/favorites",
  authController.protect,
  userController.toggleFavorite
);

module.exports = router;
