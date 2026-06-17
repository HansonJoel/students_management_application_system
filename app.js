const express = require("express");
const morgan = require("morgan");
const app = express();

const studentRouter = require("./students/students.routes");
const AppError = require("./utils/AppError");
const errorMiddleware = require("./middleware/error.middleware");

// Middleware for parsing JSON bodies (highly recommended for POST/PATCH)
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Students Management Application System!");
});

//  register routes
app.use("/v1/students", studentRouter);

// Unmatched routes
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global Error Middleware
app.use(errorMiddleware);

// Export app so server.js can import it
module.exports = app;
