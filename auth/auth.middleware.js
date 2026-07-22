const jwt = require("jsonwebtoken");
const Student = require("../students/students.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const isAuthenticated = catchAsync(async (req, res, next) => {
  let token;

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("You are not logged in. Please log in first.", 401);
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // check if the user still exists in the database
  const student = await Student.findById(decoded.id);

  if (!student) {
    throw new AppError("Student no longer exists.", 401);
  }

  // Check if account is active
  if (!student.isActive) {
    throw new AppError("Your account has been deactivated.", 403);
  }

  // Check if password was changed after the token was issued
  const passwordChanged = student.isPasswordChanged(decoded.iat);

  if (passwordChanged) {
    throw new AppError("Password changed recently. Please login again.", 401);
  }

  // Attach user to request
  req.user = student;

  next();
});

// =========================================
// Restrict Access by Role
// =========================================
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403),
      );
    }

    next();
  };
};

module.exports = {
  isAuthenticated,
  restrictTo,
};
