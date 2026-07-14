const express = require("express");
const settingsController = require("../controllers/settingsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/public", settingsController.getPublicSettings);

router.use(authController.protect, authController.restrictTo("admin"));

router.get("/", settingsController.getSettings);
router.patch("/", settingsController.updateSettings);

module.exports = router;
