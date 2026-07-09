const Router = require("express").Router;
const authController = require("./auth.controller");

const authRouter = Router();

authRouter.post("/signup", authController.signupController);
authRouter.post("/login", authController.loginController);

module.exports = authRouter;
