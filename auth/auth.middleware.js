const jwt = require("jsonwebtoken");
const User = require("../users/users.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const isAuthenticated = catchAsync(async (req, res, next) => {
  let token;

  // 1. Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("You are not logged in. Please log in first.", 401);
  }

  // 2. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. Check if the user still exists in the database
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("User no longer exists.", 401);
  }

  // 4. Check if account is active
  if (!user.isActive) {
    throw new AppError("Your account has been deactivated.", 403);
  }

  // 5. Check if password was changed after the token was issued
  const passwordChanged = user.isPasswordChanged(decoded.iat);

  if (passwordChanged) {
    throw new AppError("Password changed recently. Please login again.", 401);
  }

  // Attach user to request
  req.user = user;

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
