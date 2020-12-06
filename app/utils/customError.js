/**
 * Custom error handling
 */

// Extend the Error object with code and data properties
class CustomError extends Error {
  constructor(message, code, data) {
    super(message);
    this.code = code || "";
    this.data = data || {};
  }
}

class ValidationError extends CustomError {}

module.exports = {
  CustomError,
  ValidationError
};
