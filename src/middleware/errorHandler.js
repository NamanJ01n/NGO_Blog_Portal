// Mirrors com.ngoportal.backend.exception.GlobalExceptionHandler
const ApiException = require("../utils/ApiException");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiException) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: "Something went wrong: " + err.message });
}

module.exports = errorHandler;
