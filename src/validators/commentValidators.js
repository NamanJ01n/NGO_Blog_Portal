// Mirrors CommentRequest and ReplyRequest (both are just a single required "text" field)
const { body } = require("express-validator");

const commentValidators = [
  body("text").notEmpty().withMessage("must not be blank"),
];

const replyValidators = [
  body("text").notEmpty().withMessage("must not be blank"),
];

module.exports = { commentValidators, replyValidators };
