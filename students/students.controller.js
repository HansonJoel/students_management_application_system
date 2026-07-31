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
  const student = await studentService.updateStudent(id, req.body, req.user);

  return res.status(200).json({
    message: "Student updated successfully",
    data: student,
  });
});

// Deactivate student
const deactivateStudentController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const student = await studentService.deactivateStudent(id);

  return res.status(200).json({
    message: "Student account deactivated successfully",
    // data: student,
  });
});

// Get single student
const getStudentController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const student = await studentService.getStudent(id, req.user);

  return res.status(200).json({
    message: "Student retrieved successfully",
    data: student,
  });
});

// GET ALL STUDENTS
const getAllStudentsController = catchAsync(async (req, res, next) => {
  const students = await studentService.getAllStudents(req.query);

  return res.status(200).json({
    message: "Students retrieved successfully",
    data: students,
  });
});

module.exports = {
  createStudentController,
  createBulkStudentsController,
  updateStudentController,
  deactivateStudentController,
  getStudentController,
  getAllStudentsController,
};
