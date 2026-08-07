const SuperAdminProfile = require("./superAdmins.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// REQUIRE PRIMARY SUPER ADMIN
const requirePrimarySuperAdmin = catchAsync(async (req, res, next) => {
  // req.user is populated by isAuthenticated middleware
  const profile = await SuperAdminProfile.findOne({
    user: req.user._id,
  });

  if (!profile) {
    throw new AppError("Super Admin profile not found.", 404);
  }

  if (!profile.isPrimary) {
    throw new AppError(
      "You do not have permission to perform this action.",
      403,
    );
  }

  // Make the profile available to later middleware/controllers
  req.superAdminProfile = profile;

  next();
});

module.exports = {
  requirePrimarySuperAdmin,
};
