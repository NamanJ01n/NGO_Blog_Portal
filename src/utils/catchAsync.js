// Wraps an async route handler so a rejected promise / thrown error
// is forwarded to Express's error-handling middleware (GlobalExceptionHandler equivalent),
// the same way Spring Boot automatically routes exceptions thrown in a @RestController method.
module.exports = function catchAsync(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
