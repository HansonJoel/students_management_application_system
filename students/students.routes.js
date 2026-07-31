const Router = require("express").Router;
const studentController = require("./students.controller");
const studentMiddleware = require("./students.middleware");
const authMiddleware = require("../auth/auth.middleware");

const studentRouter = Router();

// ADMIN: Create a single student
studentRouter.post(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("admin"),
  studentMiddleware.validateCreateStudents,
  studentController.createStudentController,
);

// ADMIN: Create multiple students
studentRouter.post(
  "/bulk",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("admin"),
  studentMiddleware.validateBulkCreateStudents,
  studentController.createBulkStudentsController,
);

// ADMIN: Get all students
studentRouter.get(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("admin"),
  studentController.getAllStudentsController,
);

// Authenticated user: Get a student
studentRouter.get(
  "/:id",
  authMiddleware.isAuthenticated,
  studentController.getStudentController,
);

// Authenticated user: Update a student
studentRouter.patch(
  "/:id",
  authMiddleware.isAuthenticated,
  studentController.updateStudentController,
);

// ADMIN: Delete a student
studentRouter.delete(
  "/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("admin"),
  studentController.deactivateStudentController,
);

module.exports = studentRouter;
