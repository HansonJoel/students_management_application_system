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

module.exports = {
  signupController,
  loginController,
};
