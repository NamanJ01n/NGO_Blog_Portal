// Mirrors com.ngoportal.backend.controller.AdminController
// All routes here are restricted to ADMIN via the requireAdmin middleware ("/api/admin/**")
const authService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");

const createAdmin = catchAsync(async (req, res) => {
  const message = await authService.createAdmin(req.body);
  res.json({ message });
});

module.exports = { createAdmin };
