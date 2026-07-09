const authService = require("./auth.service");
const catchAsync = require("../utils/catchAsync");

// SIGNUP
const signupController = catchAsync(async (req, res, next) => {
  const auth = await authService.signup(req.body);

  return res.status(201).json({
    message: "Student signed up successfully",
    data: auth,
  });
});

// LOGIN
const loginController = catchAsync(async (req, res, next) => {
  const auth = await authService.login(req.body);

  return res.status(200).json({
    message: "Student logged in successfully",
    data: auth,
  });
});

module.exports = {
  signupController,
  loginController,
};
