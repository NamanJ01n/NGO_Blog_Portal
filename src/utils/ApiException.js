// Mirrors com.ngoportal.backend.exception.ApiException
class ApiException extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

module.exports = ApiException;
