const express = require("express");
const auditController = require("../controllers/auditController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect, authController.restrictTo("admin"));

router.get("/", auditController.getAuditLogs);

module.exports = router;
