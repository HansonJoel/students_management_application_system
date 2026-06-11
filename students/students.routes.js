const Router = require("express").Router;
const studentController = require("./students.controller");

const studentRouter = Router();

studentRouter.post("/", studentController.createStudentController);
studentRouter.get("/", studentController.getStudentController);
studentRouter.get("/:id", studentController.getAllStudentsController);
studentRouter.patch("/:id", studentController.updateStudentController);
studentRouter.delete("/:id", studentController.deleteStudentController);

module.exports = studentRouter;
