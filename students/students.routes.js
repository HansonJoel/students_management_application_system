const Router = require("express").Router;
const studentController = require("./students.controller");

const studentRouter = Router();

studentRouter.post("/", studentController.createStudentController);
studentRouter.get("/", studentController.getAllStudentsController);
studentRouter.get("/:id", studentController.getStudentController);
studentRouter.patch("/:id", studentController.updateStudentController);
studentRouter.delete("/:id", studentController.deleteStudentController);

module.exports = studentRouter;
