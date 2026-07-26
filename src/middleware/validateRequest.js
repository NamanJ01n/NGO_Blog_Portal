// Mirrors GlobalExceptionHandler.handleValidation (MethodArgumentNotValidException case):
// returns a flat { field: message } map with HTTP 400, matching bean-validation-style output.
const { validationResult } = require("express-validator");

function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const fieldErrors = {};
  // Matches the Java forEach behavior: if multiple errors exist for the same
  // field, the last one processed wins (a plain map .put() overwrite).
  result.array().forEach((err) => {
    fieldErrors[err.path] = err.msg;
  });

  return res.status(400).json(fieldErrors);
}

module.exports = validateRequest;
