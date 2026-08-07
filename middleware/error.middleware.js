const AppError = require("../utils/AppError");

// ===============================
// Development Error Response
// ===============================
const devError = (res, error) => {
  res.status(error.statusCode || 500).json({
    status: error.status || "error",
    message: error.message,
    stack: error.stack,
    error,
  });
};

// ===============================
// Production Error Response
// ===============================
const prodErrors = (res, error) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error("ERROR", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Handling cast Errors
const handleCastError = (error) => {
  const errorMessage = `Invalid value '${error.value}' for property '${error.path}'.`;

  return new AppError(errorMessage, 400);
};

// Handling duplicate key errors
const handleDuplicateKeyError = (error) => {
  // Sometimes keyValue may not be available
  if (!error.keyValue) {
    return new AppError(
      "A duplicate value was detected. Please use a unique value.",
      400,
    );
  }

  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];

  const errorMessage = `A document with field '${field}' and value '${value}' already exists.`;

  return new AppError(errorMessage, 409);
};

// Handle Mongoose Validation Errors
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((val) => val.message);

  const errorMessage = `Invalid input data. ${errors.join(". ")}`;

  return new AppError(errorMessage, 400);
};

// JWT Error Handlers
const handleJsonWebTokenError = (error) => {
  const errorMessage = "Invalid access token. Please log in again.";
  return new AppError(errorMessage, 401);
};

// JWT Expired Error Handler
const handleTokenExpiredError = (error) => {
  const errorMessage = "Your access token has expired. Please log in again.";
  return new AppError(errorMessage, 401);
};

// Handling Global Error
const errorMiddleware = (err, req, res, next) => {
  let error = err;
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

  // JWT Error
  if (err.name === "JsonWebTokenError") {
    error = handleJsonWebTokenError(err);
  }

  // JWT Expired Error
  if (err.name === "TokenExpiredError") {
    error = handleTokenExpiredError(err);
  }

  // Default values
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  //Environment-based error response
  if (process.env.NODE_ENV === "development") {
    return devError(res, error);
  } else {
    return prodErrors(res, error);
  }
};

module.exports = errorMiddleware;
