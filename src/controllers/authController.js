// Mirrors com.ngoportal.backend.controller.AuthController
const authService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

// Student self-registration
const register = catchAsync(async (req, res) => {
  const message = await authService.registerStudent(req.body);
  res.json({ message });
});

// GET /api/auth/verify?token=... -- verifies then redirects to the frontend,
// exactly like the Java version's backend-redirect flow.
const verify = catchAsync(async (req, res) => {
  const { token } = req.query;
  try {
    await authService.verifyEmail(token);
    res.redirect(`${frontendUrl}/verify-email?token=${token}&success=true`);
  } catch (err) {
    const errorMsg = encodeURIComponent(err.message);
    res.redirect(`${frontendUrl}/verify-email?token=${token}&success=false&error=${errorMsg}`);
  }
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

const forgotPassword = catchAsync(async (req, res) => {
  const message = await authService.forgotPassword(req.body.email);
  res.json({ message });
});

const resetPassword = catchAsync(async (req, res) => {
  const message = await authService.resetPassword(req.body.token, req.body.newPassword);
  res.json({ message });
});

module.exports = { register, verify, login, forgotPassword, resetPassword };
