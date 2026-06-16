const Router = require("express").Router;
const studentController = require("./students.controller");
const studentMiddleware = require("./students.middleware");

const studentRouter = Router();

studentRouter.post(
  "/",
  studentMiddleware.validateCreateStudents,
  studentController.createStudentController,
);
studentRouter.post(
  "/bulk",
  studentMiddleware.validateBulkCreateStudents,
  studentController.createBulkStudentsController,
);
studentRouter.get("/", studentController.getAllStudentsController);
studentRouter.get("/:id", studentController.getStudentController);
studentRouter.patch("/:id", studentController.updateStudentController);
studentRouter.delete("/:id", studentController.deleteStudentController);

module.exports = studentRouter;
