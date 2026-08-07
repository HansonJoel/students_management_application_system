const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();

const errorMiddleware = require("./middleware/error.middleware");
const AppError = require("./utils/AppError");
const User = require("./users/users.model");
const userValidation = require("./users/users.validation");
const studentRouter = require("./students/students.routes");
const authRouter = require("./auth/auth.route");
const adminRouter = require("./admins/admins.routes");
const superAdminRouter = require("./superAdmins/superAdmins.routes");

// Middleware for parsing JSON bodies (highly recommended for POST/PATCH)
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("Environment: ", process.env.NODE_ENV);

app.get("/", (req, res) => {
  res.send("Welcome to the School Management Application System!");
});

// app.post(
//   "/test-user",
//   userValidation.validateCreateUser,
//   async (req, res, next) => {
//     try {
//       const user = await User.create(req.body);

//       user.password = undefined;

//       res.status(201).json({
//         message: "User created successfully",
//         data: user,
//       });
//     } catch (error) {
//       next(error);
//     }
//   },
// );

//  register routes
app.use("/v1/students", studentRouter);
app.use("/v1/auth", authRouter);
app.use("/v1/admins", adminRouter);
app.use("/v1/super-admins", superAdminRouter);

// Unmatched routes
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global Error Middleware
app.use(errorMiddleware);

// Export app so server.js can import it
module.exports = app;
