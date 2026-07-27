const authService = require("./auth.service");
const catchAsync = require("../utils/catchAsync");

// SIGNUP
const signupController = catchAsync(async (req, res) => {
  const response = await authService.signup(req.body);

  return res.status(201).json({
    message: "Student registered successfully",
    token: response.token,
    data: response.student,
  });
});

// LOGIN
const loginController = catchAsync(async (req, res, next) => {
  const response = await authService.login(req.body);

  return res.status(200).json({
    message: "Login successful",
    token: response.token,
    data: response.student,
  });
});

// CHANGE PASSWORD
const changePasswordController = catchAsync(async (req, res) => {
  const student = await authService.changePassword(req.user._id, req.body);

  return res.status(200).json({
    message: "Password changed successfully.",
  });
});

// FORGOT PASSWORD
const forgotPasswordController = catchAsync(async (req, res) => {
  const resetToken = await authService.forgotPassword(req.body.email);

  return res.status(200).json({
    message: "Password reset token generated successfully.",
    resetToken,
  });
});

// RESET PASSWORD
const resetPasswordController = catchAsync(async (req, res) => {
  const response = await authService.resetPassword(
    req.params.token,
    req.body.newPassword,
    req.body.confirmPassword,
  );

  return res.status(200).json({
    message: "Password reset successfully. Please log in again.",
  });
});

module.exports = {
  signupController,
  loginController,
  changePasswordController,
  forgotPasswordController,
  resetPasswordController,
};
