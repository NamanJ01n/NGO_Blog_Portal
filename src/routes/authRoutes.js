// Mirrors AuthController mappings. All public, matching
// SecurityConfig's ".requestMatchers(\"/api/auth/**\").permitAll()"
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const {
  registerValidators,
  loginValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
} = require("../validators/authValidators");

router.post("/register", registerValidators, validateRequest, authController.register);
router.get("/verify", authController.verify);
router.post("/login", loginValidators, validateRequest, authController.login);
router.post("/forgot-password", forgotPasswordValidators, validateRequest, authController.forgotPassword);
router.post("/reset-password", resetPasswordValidators, validateRequest, authController.resetPassword);

module.exports = router;
