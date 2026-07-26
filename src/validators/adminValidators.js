// Mirrors CreateAdminRequest
const { body } = require("express-validator");

const createAdminValidators = [
  body("name").notEmpty().withMessage("must not be blank"),
  body("email")
    .notEmpty().withMessage("must not be blank")
    .bail()
    .isEmail().withMessage("must be a well-formed email address"),
  body("password")
    .notEmpty().withMessage("must not be blank")
    .bail()
    .isLength({ min: 8 }).withMessage("size must be between 8 and 2147483647"),
];

module.exports = { createAdminValidators };
