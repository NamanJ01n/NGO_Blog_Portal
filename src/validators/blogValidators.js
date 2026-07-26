// Mirrors BlogRequest
const { body } = require("express-validator");

const blogValidators = [
  body("title").notEmpty().withMessage("must not be blank"),
  body("content").notEmpty().withMessage("must not be blank"),
  // sessionDate, pptLink, youtubeLink, instagramLink are all optional, unvalidated -- same as Java
];

module.exports = { blogValidators };
