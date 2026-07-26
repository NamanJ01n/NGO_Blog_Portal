// Mirrors AdminController -- restricted to ADMIN, matching
// SecurityConfig's ".requestMatchers(\"/api/admin/**\").hasRole(\"ADMIN\")"
const express = require("express");
const router = express.Router();

const { requireAdmin } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { createAdminValidators } = require("../validators/adminValidators");
const adminController = require("../controllers/adminController");

router.post("/create-admin", requireAdmin, createAdminValidators, validateRequest, adminController.createAdmin);

module.exports = router;
