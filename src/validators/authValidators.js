// Mirrors RegisterRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest
const { body } = require("express-validator");

const registerValidators = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty().withMessage("Email is required")
    .bail()
    .isEmail().withMessage("Email must be valid"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .bail()
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

const loginValidators = [
  body("email")
    .notEmpty().withMessage("must not be blank")
    .bail()
    .isEmail().withMessage("must be a well-formed email address"),
  body("password").notEmpty().withMessage("must not be blank"),
];

const forgotPasswordValidators = [
  body("email")
    .notEmpty().withMessage("must not be blank")
    .bail()
    .isEmail().withMessage("must be a well-formed email address"),
];

const resetPasswordValidators = [
  body("token").notEmpty().withMessage("must not be blank"),
  body("newPassword")
    .notEmpty().withMessage("must not be blank")
    .bail()
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

module.exports = {
  registerValidators,
  loginValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
};
