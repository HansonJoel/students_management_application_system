const Router = require("express").Router;
const studentMiddleware = require("../students/students.middleware");
const authController = require("./auth.controller");
const authMiddleware = require("./auth.middleware");
const authValidation = require("./auth.validation");

const authRouter = Router();

// student self-registration route
authRouter.post(
  "/signup",
  studentMiddleware.validateCreateStudents,
  authController.signupController,
);

// LOGIN
authRouter.post("/login", authController.loginController);

// CHANGE PASSWORD
authRouter.patch(
  "/change-password",
  authMiddleware.isAuthenticated,
  authValidation.validateChangePassword,
  authController.changePasswordController,
);

// FORGOT PASSWORD
authRouter.post(
  "/forgot-password",
  authValidation.validateForgotPassword,
  authController.forgotPasswordController,
);

// RESET PASSWORD
authRouter.patch(
  "/reset-password/:token",
  authValidation.validateResetPassword,
  authController.resetPasswordController,
);
module.exports = authRouter;
