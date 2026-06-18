const AppError = require("../utils/AppError");

// Handling cast Errors
const handleCastError = (error) => {
  const errorMessage = `Invalid value '${error.value}' for property '${error.path}'.`;

  return new AppError(errorMessage, 400);
};

// Handling duplicate key errors
const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];

  const errorMessage = `A document with field '${field}' and value '${value}' already exists.`;

  return new AppError(errorMessage, 400);
};

// Handle Mongoose Validation Errors
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((val) => val.message);

  const errorMessage = `Invalid input data. ${errors.join(". ")}`;

  return new AppError(errorMessage, 400);
};

// Handling Global Error
const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    error = handleCastError(err);
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  }

  // Validation Error
  if (err.name === "ValidationError") {
    error = handleValidationError(err);
  }

  // Default values
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

module.exports = errorMiddleware;
