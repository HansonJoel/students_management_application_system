const Router = require("express").Router;
const studentMiddleware = require("../students/students.middleware");
const authController = require("./auth.controller");

const authRouter = Router();

// student self-registration route
authRouter.post(
  "/signup",
  studentMiddleware.validateCreateStudents,
  authController.signupController,
);
authRouter.post("/login", authController.loginController);

module.exports = authRouter;
