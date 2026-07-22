const express = require("express");
const morgan = require("morgan");
const app = express();

const errorMiddleware = require("./middleware/error.middleware");
const AppError = require("./utils/AppError");
const studentRouter = require("./students/students.routes");
const authRouter = require("./auth/auth.route");

// Middleware for parsing JSON bodies (highly recommended for POST/PATCH)
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the School Management Application System!");
});

//  register routes
app.use("/v1/students", studentRouter);
app.use("/v1/auth", authRouter);

// Unmatched routes
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global Error Middleware
app.use(errorMiddleware);

// Export app so server.js can import it
module.exports = app;
