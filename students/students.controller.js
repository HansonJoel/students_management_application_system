const studentService = require("./students.service");
const catchAsync = require("../utils/catchAsync");

// CREATE STUDENT
const createStudentController = catchAsync(async (req, res, next) => {
  const student = await studentService.createStudent(req.body);

  return res.status(201).json({
    message: "Student created Successfully",
    data: student,
  });
});

// CREATE BULK STUDENTS
const createBulkStudentsController = catchAsync(async (req, res, next) => {
  const students = await studentService.createBulkStudents(req.body);

  return res.status(201).json({
    message: "Students created Successfully",
    data: students,
  });
});

// UPDATE STUDENT
const updateStudentController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const student = await studentService.updateStudent(id, req.body);

  return res.status(200).json({
    message: "Student updated successfully",
    data: student,
  });
});

const deleteStudentController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const student = await studentService.deleteStudent(id);

  return res.status(200).json({
    message: "Student deleted successfully",
    // data: student,
  });
});

const getStudentController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const student = await studentService.getStudent(id);

  return res.status(200).json({
    message: "Student retrieved successfully",
    data: student,
  });
});

// GET ALL STUDENTS
const getAllStudentsController = catchAsync(async (req, res, next) => {
  const data = await studentService.getAllStudents(req.query);

  return res.status(200).json({
    message: "Students retrieved successfully",
    data: data,
  });
});

module.exports = {
  createStudentController,
  createBulkStudentsController,
  updateStudentController,
  deleteStudentController,
  getStudentController,
  getAllStudentsController,
};
